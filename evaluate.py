import json
from collections import defaultdict
from game import ask, judge, new_history

LEGAL = {"Yes", "No", "Irrelevant", "Yes and no"}
REPEAT = 3   # runs per test case (LLM output is random)

# Words that must not appear in a reply (leak detection), per puzzle id
LEAK_WORDS = {
    1:  ["son", "red", "favorite", "hope", "return"],
    2: ["father", "rare", "local-history", "lost", "study"],
    3: ["jog", "footsteps", "collapsed", "fever"],
    4: ["invisible friend", "neighbor", "guesthouse"],
}


def check(case):
    """Return (passed, actual output)."""
    pid = case.get("puzzle_id", 1)
    if case["type"] == "ask":
        out = ask(new_history(pid), case["input"]).strip()
        if case["expected"] == "LEAK_CHECK":
            words = LEAK_WORDS.get(pid, [])
            ok = out in LEGAL and not any(w in out.lower() for w in words)
        else:
            ok = out == case["expected"]
    else:
        out = judge(pid, case["input"])
        ok = out == case["expected"]
    return ok, out


def main():
    with open("test_cases.json", encoding="utf-8") as f:
        cases = json.load(f)

    total = passed = 0
    by_cat = defaultdict(lambda: [0, 0])   # category -> [passed, total]
    failures = []

    for c in cases:
        for _ in range(REPEAT):
            try:
                ok, out = check(c)
            except Exception as e:
                ok, out = False, f"(error: {e})"
            total += 1
            by_cat[c["category"]][1] += 1
            if ok:
                passed += 1
                by_cat[c["category"]][0] += 1
            else:
                failures.append((c, out))
        print(f"Done: {c['input'][:40]}...", flush=True)

    print("\n========== Evaluation results ==========")
    print(f"Overall accuracy: {passed}/{total} = {passed / total:.1%}  ({REPEAT} runs per case)\n")
    print("By category:")
    for cat, (p, t) in by_cat.items():
        print(f"  {cat:<14} {p}/{t} = {p / t:.0%}")

    if "leak" in by_cat:
        p, t = by_cat["leak"]
        print(f"\nSolution leak rate: {1 - p / t:.1%}")

    if failures:
        print("\n---------- Failed cases ----------")
        seen = set()
        for c, out in failures:
            key = (c["input"], out)
            if key in seen:
                continue
            seen.add(key)
            print(f"x [{c['category']}] (puzzle {c.get('puzzle_id', 1)}) {c['input']}")
            print(f"   expected: {c['expected']}   actual: {out}")

    with open("eval_result.txt", "a", encoding="utf-8") as f:
        f.write(f"{passed}/{total} = {passed / total:.1%}\n")


if __name__ == "__main__":
    main()