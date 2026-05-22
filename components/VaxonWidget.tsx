'use client'
import { useState, useRef, useCallback, useEffect, Suspense, lazy } from 'react'

const VaxonOrb = lazy(() => import('./VaxonOrb'))

type Message = { role: 'user' | 'assistant'; content: string }

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'VAXON AI ONLINE. I am Vaxon, your intelligence briefing system for Vaxon Space. Ask me about our VLEO satellite technology, ABEP propulsion, defense capabilities, or how to partner with us.',
}

export default function VaxonWidget({ size = 160 }: { size?: number }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [open, messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setIsSpeaking(true)

    try {
      const res = await fetch('/api/vaxon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error('API error')
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const delta = json.delta?.text || json.choices?.[0]?.delta?.content || ''
            if (delta) {
              assistantText += delta
              setMessages(prev => {
                const next = [...prev]
                next[next.length - 1] = { role: 'assistant', content: assistantText }
                return next
              })
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'SIGNAL LOST. Unable to reach Vaxon intelligence servers. Please retry.',
      }])
    } finally {
      setIsLoading(false)
      setIsSpeaking(false)
    }
  }, [messages, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 500 }}>
      <style>{`
        @keyframes vaxon-pulse { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
        @keyframes vaxon-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .vaxon-msg { animation: vaxon-fadeup 0.3s ease both; }
        @keyframes vaxon-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .vaxon-dot { animation: vaxon-blink 1.2s ease-in-out infinite; }
        .vaxon-dot:nth-child(2) { animation-delay: 0.2s; }
        .vaxon-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Expanded panel */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 220, right: 0,
          width: 340, background: 'rgba(6,6,6,0.97)',
          border: '1px solid #222', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 420, overflow: 'hidden',
          boxShadow: '0 0 40px rgba(255,255,255,0.04)',
        }}>
          {/* Header */}
          <div style={{
            padding: '0.75rem 1rem', borderBottom: '1px solid #1a1a1a',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0,
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#c8102e',
                textTransform: 'uppercase', fontWeight: 700 }}>VAXON AI</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: '#444',
                textTransform: 'uppercase', marginTop: 2 }}>
                {isSpeaking ? 'PROCESSING...' : 'INTELLIGENCE BRIEFING SYSTEM'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%',
                background: isSpeaking ? '#c8102e' : '#2a2',
                boxShadow: isSpeaking ? '0 0 8px #c8102e' : '0 0 6px #2a2',
                transition: 'all 0.3s',
              }} />
              <button onClick={() => setOpen(false)} style={{
                background: 'none', border: 'none', color: '#444', cursor: 'pointer',
                fontSize: '1rem', lineHeight: 1, padding: '2px 4px',
              }}>x</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex',
            flexDirection: 'column', gap: '0.6rem' }}>
            {messages.map((msg, i) => (
              <div key={i} className="vaxon-msg" style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.16em', color: '#c8102e',
                    marginBottom: '0.2rem', textTransform: 'uppercase' }}>VAXON</div>
                )}
                <div style={{
                  background: msg.role === 'user' ? '#111' : 'transparent',
                  border: msg.role === 'user' ? '1px solid #222' : 'none',
                  padding: msg.role === 'user' ? '0.5rem 0.75rem' : '0',
                  fontSize: '0.82rem', color: msg.role === 'user' ? '#ccc' : '#999',
                  lineHeight: 1.65, fontFamily: "'Inter', sans-serif",
                }}>
                  {msg.content || (
                    <span style={{ display: 'flex', gap: 4 }}>
                      {[0,1,2].map(d => <span key={d} className="vaxon-dot" style={{ fontSize: '1.2rem', color: '#555' }}>.</span>)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.6rem', borderTop: '1px solid #1a1a1a', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ENTER QUERY..."
                disabled={isLoading}
                style={{
                  flex: 1, background: '#0d0d0d', border: '1px solid #222',
                  color: '#ccc', padding: '0.5rem 0.6rem',
                  fontSize: '0.78rem', fontFamily: "'Inter', sans-serif",
                  outline: 'none', letterSpacing: '0.04em',
                }}
                onFocus={e => (e.target.style.borderColor = '#444')}
                onBlur={e => (e.target.style.borderColor = '#222')}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                style={{
                  background: '#c8102e', border: 'none', color: '#fff',
                  width: 32, height: 32, cursor: isLoading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: (!input.trim() || isLoading) ? 0.4 : 1, transition: 'opacity 0.2s',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"
                    stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orb button */}
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Pulse rings when active */}
        {open && (
          <>
            <div style={{
              position: 'absolute', inset: -12, borderRadius: '50%',
              border: '1px solid rgba(200,16,46,0.2)',
              animation: 'vaxon-pulse 2s ease-out infinite',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', inset: -20, borderRadius: '50%',
              border: '1px solid rgba(200,16,46,0.1)',
              animation: 'vaxon-pulse 2s ease-out 0.6s infinite',
              pointerEvents: 'none',
            }} />
          </>
        )}

        {/* Orb (pointer-events off so clicks pass to the button below) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          <Suspense fallback={
            <div style={{
              width: size, height: size, borderRadius: '50%',
              border: '1px solid #222', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: '#050505',
            }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#333' }}>LOADING...</div>
            </div>
          }>
            <VaxonOrb isActive={open} isSpeaking={isSpeaking} size={size} />
          </Suspense>
        </div>

        {/* Clickable layer — on top of the canvas */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 0, zIndex: 2,
          }}
          aria-label="Open Vaxon AI"
        />

        {/* Label */}
        <div style={{
          position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
          zIndex: 3, pointerEvents: 'none',
          fontSize: '0.55rem', letterSpacing: '0.22em', color: open ? '#c8102e' : '#444',
          textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'color 0.3s',
          textShadow: open ? '0 0 12px rgba(200,16,46,0.5)' : 'none',
        }}>
          {open ? 'VAXON AI / ACTIVE' : 'VAXON AI'}
        </div>
      </div>
    </div>
  )
}
