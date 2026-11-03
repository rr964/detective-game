from fastapi import FastAPI
from pydantic import BaseModel
from game import ask, judge, new_history, SURFACE, BOTTOM

app = FastAPI()
sessions = {}   # 简单起见，用内存存对话：{session_id: history}


class AskReq(BaseModel):
    session_id: str
    question: str


class GuessReq(BaseModel):
    guess: str


@app.get("/api/puzzle")
def puzzle():
    return {"surface": SURFACE}


@app.post("/api/ask")
def api_ask(req: AskReq):
    history = sessions.setdefault(req.session_id, new_history())
    return {"answer": ask(history, req.question)}


@app.post("/api/guess")
def api_guess(req: GuessReq):
    verdict = judge(req.guess)
    return {"verdict": verdict, "bottom": BOTTOM if verdict == "猜对了" else None}