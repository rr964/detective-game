from game import ask, judge, new_history, SURFACE, BOTTOM

print("=== 海龟汤 ===")
print("汤面：" + SURFACE)
print("直接输入问题提问；输入 /答 + 你的推理 提交最终答案；输入 q 退出\n")

history = new_history()
questions = 0
guesses = 0

while True:
    text = input("> ").strip()
    if text.lower() == "q":
        break
    if not text:
        continue

    if text.startswith("/答"):
        guess = text[2:].strip()
        if not guess:
            print("请在 /答 后面写上你的完整推理\n")
            continue
        guesses += 1
        verdict = judge(guess)
        if verdict == "猜对了":
            print(f"\n🎉 猜对了！你用了 {questions} 个问题、{guesses} 次回答。")
            print("汤底：" + BOTTOM + "\n")
            break
        print(f"裁判：{verdict}\n")
    else:
        questions += 1
        print("主持人：" + ask(history, text) + "\n")