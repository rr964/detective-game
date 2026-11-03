import { useState, useEffect, useRef } from 'react'

const sid = crypto.randomUUID()

async function post(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error('请求失败')
  return r.json()
}

export default function App() {
  const [surface, setSurface] = useState('加载中...')
  const [log, setLog] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('/api/puzzle').then(r => r.json()).then(d => setSurface(d.surface))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  const add = (role, content) => setLog(l => [...l, { role, content }])

  async function send() {
    const q = text.trim()
    if (!q || loading) return
    setText(''); add('me', q); setLoading(true)
    try {
      const d = await post('/api/ask', { session_id: sid, question: q })
      add('ai', d.answer)
    } catch { add('ai', '出错了，请重试') }
    setLoading(false)
  }

  async function guess() {
    const g = text.trim()
    if (!g || loading) return
    setText(''); add('me', '【作答】' + g); setLoading(true)
    try {
      const d = await post('/api/guess', { guess: g })
      add('ai', '裁判：' + d.verdict)
      if (d.bottom) add('ai', '汤底：' + d.bottom)
    } catch { add('ai', '出错了，请重试') }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '2em auto', padding: '0 1em' }}>
      <h2>海龟汤</h2>
      <p>汤面：{surface}</p>
      <div style={{ border: '1px solid #ccc', height: 320, overflowY: 'auto', padding: 8 }}>
        {log.map((m, i) => (
          <div key={i} style={{ color: m.role === 'me' ? '#06c' : '#333', margin: '4px 0' }}>
            {m.role === 'me' ? '你：' : '主持人：'}{m.content}
          </div>
        ))}
        {loading && <div style={{ color: '#999' }}>思考中...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
        <input
          style={{ flex: 1, padding: 6 }}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="输入问题，或写下你的完整推理"
        />
        <button onClick={send} disabled={loading}>提问</button>
        <button onClick={guess} disabled={loading}>我知道了</button>
      </div>
    </div>
  )
}