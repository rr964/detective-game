import { useState, useEffect, useRef } from 'react'
import './App.css'
import Art from './Art.jsx'

const sid = crypto.randomUUID()

const T = {
  en: {
    title: 'Lateral Thinking Soup',
    intro: 'Ask yes/no questions to uncover the story behind each puzzle.',
    back: '← Back',
    questions: 'questions',
    hint: 'Ask questions to uncover what happened.',
    thinking: 'Thinking...',
    placeholder: 'Ask a yes/no question, or write your full answer',
    ask: 'Ask',
    guess: 'I know!',
    answerLabel: '[Answer] ',
    truth: 'Solution: ',
    limit: 'Limit reached. Please wait a moment or switch puzzles.',
    error: 'Something went wrong, please try again.',
    loadFail: 'Failed to load puzzles. Is the backend running?',
  },
  zh: {
    title: '海龟汤推理',
    intro: '通过是非问题，还原每个谜题背后的故事。',
    back: '← 返回',
    questions: '个问题',
    hint: '通过提问还原事情的经过吧。',
    thinking: '思考中...',
    placeholder: '提一个是非问题，或写下你的完整推理',
    ask: '提问',
    guess: '我知道了',
    answerLabel: '【作答】',
    truth: '汤底：',
    limit: '请求过于频繁或次数已用完，请稍后再试或换一题。',
    error: '出错了，请重试。',
    loadFail: '题目加载失败，请确认后端已启动。',
  },
}

// Backend always answers in English; the frontend translates for display
const ANSWER = {
  Yes: { cls: 'yes', zh: '是' },
  No: { cls: 'no', zh: '不是' },
  Irrelevant: { cls: 'na', zh: '无关' },
  'Yes and no': { cls: 'both', zh: '是也不是' },
}
const VERDICT = {
  Correct: { cls: 'win yes', en: 'Correct!', zh: '猜对了！' },
  Close: { cls: 'both', en: 'Close', zh: '接近了' },
  Wrong: { cls: 'no', en: 'Wrong', zh: '不对' },
}
const LEVEL = { Easy: '简单', Medium: '中等', Hard: '困难' }

async function post(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const err = new Error('request failed')
    err.status = r.status
    throw err
  }
  return r.json()
}

function Badge({ level, lang }) {
  return (
    <span className={'badge ' + level.toLowerCase()}>
      {lang === 'zh' ? LEVEL[level] || level : level}
    </span>
  )
}

function PuzzleList({ puzzles, onPick, lang, t }) {
  return (
    <div>
      <p className="intro">{t.intro}</p>
      <div className="grid">
        {puzzles.map(p => (
          <div key={p.id} className="card" onClick={() => onPick(p.id)}>
            <div className="art"><Art id={p.id} /></div>
            <div className="card-body">
              <div className="card-head">
                <b>{p.title}</b>
                <Badge level={p.difficulty} lang={lang} />
              </div>
              <div className="surface">{p.surface}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Game({ puzzle, onBack, lang, t }) {
  const [log, setLog] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [asked, setAsked] = useState(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  const add = item => setLog(l => [...l, item])
  const fail = e => add({ role: 'ai', kind: e.status === 429 ? 'limit' : 'error' })

  async function send() {
    const q = text.trim()
    if (!q || loading) return
    setText('')
    add({ role: 'me', text: q })
    setLoading(true)
    try {
      const d = await post('/api/ask', { session_id: sid, puzzle_id: puzzle.id, question: q })
      add({ role: 'ai', kind: 'answer', raw: d.answer })
      setAsked(d.questions)
    } catch (e) { fail(e) }
    setLoading(false)
  }

  async function guess() {
    const g = text.trim()
    if (!g || loading) return
    setText('')
    add({ role: 'me', kind: 'guess', text: g })
    setLoading(true)
    try {
      const d = await post('/api/guess', { session_id: sid, puzzle_id: puzzle.id, guess: g, lang })
      add({ role: 'ai', kind: 'verdict', raw: d.verdict })
      if (d.bottom) add({ role: 'ai', kind: 'bottom', text: d.bottom })
    } catch (e) { fail(e) }
    setLoading(false)
  }

  // Translate at render time, so switching language also updates the history
  function render(m) {
    if (m.role === 'me') {
      return { cls: 'me', content: m.kind === 'guess' ? t.answerLabel + m.text : m.text }
    }
    if (m.kind === 'answer') {
      const a = ANSWER[m.raw]
      return { cls: 'ai ' + (a ? a.cls : ''), content: lang === 'zh' && a ? a.zh : m.raw }
    }
    if (m.kind === 'verdict') {
      const v = VERDICT[m.raw]
      return { cls: 'ai ' + (v ? v.cls : ''), content: v ? v[lang] : m.raw }
    }
    if (m.kind === 'bottom') return { cls: 'ai', content: t.truth + m.text }
    return { cls: 'ai no', content: t[m.kind] }
  }

  return (
    <div className="game">
      <button onClick={onBack}>{t.back}</button>
      <div className="banner"><Art id={puzzle.id} /></div>
      <div className="title-row">
        <h2>{puzzle.title}</h2>
        <Badge level={puzzle.difficulty} lang={lang} />
        <span className="counter">{asked} {t.questions}</span>
      </div>
      <div className="surface-box">{puzzle.surface}</div>
      <div className="chat">
        {log.length === 0 && <div className="hint">{t.hint}</div>}
        {log.map((m, i) => {
          const { cls, content } = render(m)
          return <div key={i} className={'bubble ' + cls}>{content}</div>
        })}
        {loading && <div className="hint">{t.thinking}</div>}
        <div ref={bottomRef} />
      </div>
      <div className="inputbar">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={t.placeholder}
          maxLength={200}
        />
        <button className="primary" onClick={send} disabled={loading}>{t.ask}</button>
        <button onClick={guess} disabled={loading}>{t.guess}</button>
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  )
  const [puzzles, setPuzzles] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [error, setError] = useState(false)
  const t = T[lang]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  // Re-fetch when the language changes so titles and puzzles switch too
  useEffect(() => {
    fetch('/api/puzzles?lang=' + lang)
      .then(r => r.json())
      .then(d => { setPuzzles(d); setError(false) })
      .catch(() => setError(true))
  }, [lang])

  const current = puzzles.find(p => p.id === currentId)

  return (
    <div className="app">
      <div className="topbar">
        <h1>🐢 {t.title}</h1>
        <div className="tools">
          <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>
            {lang === 'en' ? '中文' : 'EN'}
          </button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      {error && <p style={{ color: 'var(--no)' }}>{t.loadFail}</p>}
      {current
        ? <Game key={current.id} puzzle={current} onBack={() => setCurrentId(null)} lang={lang} t={t} />
        : <PuzzleList puzzles={puzzles} onPick={setCurrentId} lang={lang} t={t} />}
    </div>
  )
}