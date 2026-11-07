import time
from collections import OrderedDict
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from game import ask, judge, new_history, get_puzzle, list_puzzles, pick

BASE_DIR = Path(__file__).parent
DIST_DIR = BASE_DIR / "frontend" / "dist"

# ---------- Config ----------
MAX_SESSIONS = 500          # max games kept in memory at once
SESSION_TTL = 60 * 60       # a game expires after 1 hour of inactivity (seconds)
MAX_QUESTIONS = 60          # max questions per game
MAX_GUESSES = 20            # max final answers per game

# ---------- Rate limiting: per IP ----------
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------- Session storage ----------
# {(session_id, puzzle_id): {"history": [...], "last": timestamp, "questions": 0, "guesses": 0}}
sessions = OrderedDict()


def cleanup_sessions():
    """Remove expired sessions and keep the total under the limit."""
    now = time.time()
    expired = [k for k, v in sessions.items() if now - v["last"] > SESSION_TTL]
    for k in expired:
        del sessions[k]
    while len(sessions) > MAX_SESSIONS:
        sessions.popitem(last=False)   # drop the oldest


def get_session(session_id, puzzle_id):
    cleanup_sessions()
    key = (session_id, puzzle_id)
    if key not in sessions:
        sessions[key] = {
            "history": new_history(puzzle_id),   # raises KeyError if the puzzle does not exist
            "last": time.time(),
            "questions": 0,
            "guesses": 0,
        }
    s = sessions[key]
    s["last"] = time.time()
    sessions.move_to_end(key)
    return s


# ---------- Request models ----------
class AskReq(BaseModel):
    session_id: str = Field(min_length=1, max_length=64)
    puzzle_id: int
    question: str = Field(min_length=1, max_length=200)


class GuessReq(BaseModel):
    session_id: str = Field(min_length=1, max_length=64)
    puzzle_id: int
    guess: str = Field(min_length=1, max_length=500)
    lang: str = "en"


# ---------- API ----------
@app.get("/api/puzzles")
def api_puzzles(lang: str = "en"):
    return list_puzzles(lang)


@app.post("/api/ask")
@limiter.limit("20/minute")
def api_ask(request: Request, req: AskReq):
    try:
        s = get_session(req.session_id, req.puzzle_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    if s["questions"] >= MAX_QUESTIONS:
        raise HTTPException(status_code=429, detail="Question limit reached for this game")
    s["questions"] += 1
    return {"answer": ask(s["history"], req.question), "questions": s["questions"]}


@app.post("/api/guess")
@limiter.limit("20/minute")
def api_guess(request: Request, req: GuessReq):
    try:
        puzzle = get_puzzle(req.puzzle_id)
        s = get_session(req.session_id, req.puzzle_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    if s["guesses"] >= MAX_GUESSES:
        raise HTTPException(status_code=429, detail="Guess limit reached for this game")
    s["guesses"] += 1
    verdict = judge(req.puzzle_id, req.guess)
    return {
        "verdict": verdict,
        "bottom": pick(puzzle, "bottom", req.lang) if verdict == "Correct" else None,
    }


# ---------- Serve the frontend (must come after all /api routes) ----------
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{path:path}")
    def spa(path: str):
        """Return index.html for any other path; real files in dist (icons etc.) are served directly."""
        file = (DIST_DIR / path).resolve()
        if path and file.is_file() and DIST_DIR.resolve() in file.parents:
            return FileResponse(file)
        return FileResponse(DIST_DIR / "index.html")