'use client'
import { useState, useMemo, useEffect } from 'react'
import { Nav, Footer, VX_GLOBAL_STYLE, CORE_TEAM, ADVISORS, HEADSHOT_CROP } from '../page'

// Gate: sha256 of the access phrase. Read-only tool, so this just keeps it private.
const GATE_HASH = 'd4ca503b6b550df9c23e95b8233571e7b16b8615ce715c84edad1c05b8f63f2d'
async function sha256(s: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('')
}

/* Unlisted internal tool: visually frame any team headshot in the circle and
   copy the resulting crop values. Not linked in the nav. */

const ALL = [...CORE_TEAM, ...ADVISORS].filter(m => m.image)

function keyFor(name: string) {
  return Object.keys(HEADSHOT_CROP).find(k => name.includes(k))
}
function parsePosY(pos: string) {
  const m = pos.match(/(-?\d+(?:\.\d+)?)%\s*$/)
  return m ? parseFloat(m[1]) : 20
}

export default function HeadshotTool() {
  const [idx, setIdx] = useState(ALL.findIndex(m => m.name.includes('Williamson')) || 0)
  const member = ALL[idx]
  const init = useMemo(() => {
    const k = keyFor(member.name)
    const c = k ? HEADSHOT_CROP[k] : { scale: 1, pos: '50% 20%', tx: '0%' }
    return { scale: c.scale, posY: parsePosY(c.pos), tx: parseFloat(c.tx) || 0 }
  }, [member.name])

  const [scale, setScale] = useState(init.scale)
  const [posY, setPosY] = useState(init.posY)
  const [tx, setTx] = useState(init.tx)
  const [copied, setCopied] = useState(false)

  // ── access gate ──
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  useEffect(() => { if (typeof window !== 'undefined' && sessionStorage.getItem('hst') === '1') setAuthed(true) }, [])
  const submitPw = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await sha256(pw) === GATE_HASH) { setAuthed(true); sessionStorage.setItem('hst', '1') } else { setErr(true) }
  }

  // re-sync sliders when the selected member changes
  const reset = (i: number) => {
    const m = ALL[i], k = keyFor(m.name)
    const c = k ? HEADSHOT_CROP[k] : { scale: 1, pos: '50% 20%', tx: '0%' }
    setIdx(i); setScale(c.scale); setPosY(parsePosY(c.pos)); setTx(parseFloat(c.tx) || 0); setCopied(false)
  }

  if (!authed) {
    return (
      <>
        <style>{VX_GLOBAL_STYLE}</style>
        <Nav active="team" />
        <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <form onSubmit={submitPw} style={{ width: 360, maxWidth: '100%', border: '1px solid #1a1a2e', background: '#060614', padding: '2.5rem' }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.62rem', letterSpacing: '0.22em', color: '#c8102e', marginBottom: '1.5rem' }}>RESTRICTED · INTERNAL TOOL</div>
            <input type="password" value={pw} autoFocus onChange={e => { setPw(e.target.value); setErr(false) }} placeholder="Access phrase"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${err ? '#c8102e' : '#1a1a2e'}`, color: '#fff', padding: '0.875rem 1rem', fontSize: '0.9rem', fontFamily: "'Inter',sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' }} />
            {err && <div style={{ color: '#c8102e', fontSize: '0.75rem', fontFamily: "'Inter',sans-serif", marginBottom: '1rem' }}>Incorrect phrase.</div>}
            <button type="submit" style={{ width: '100%', background: '#c8102e', color: '#fff', border: 'none', cursor: 'pointer', padding: '0.9rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>Unlock</button>
          </form>
        </div>
      </>
    )
  }

  const k = keyFor(member.name) || member.name.split(' ').pop()
  const line = `'${k}': { scale: ${scale}, pos: '50% ${posY}%', tx: '${tx}%' },`
  const imgStyle: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'cover',
    objectPosition: `50% ${posY}%`, transform: `scale(${scale}) translateX(${tx}%)`, display: 'block',
  }
  const Circle = ({ d }: { d: number }) => (
    <div style={{ width: d, height: d, borderRadius: '50%', overflow: 'hidden', border: '2px solid #c8102e', flexShrink: 0, background: '#05050e' }}>
      <img src={member.image} alt={member.name} style={imgStyle} />
    </div>
  )
  const Slider = ({ label, val, min, max, step, set, fmt }: { label: string; val: number; min: number; max: number; step: number; set: (n: number) => void; fmt: (n: number) => string }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter',sans-serif", fontSize: '0.7rem', letterSpacing: '0.12em', color: '#9aa6c0', marginBottom: '0.5rem' }}>
        <span>{label}</span><span style={{ color: '#fff' }}>{fmt(val)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e => { set(parseFloat(e.target.value)); setCopied(false) }}
        style={{ width: '100%', accentColor: '#c8102e' }} />
    </div>
  )

  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <Nav active="team" />
      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '4rem 2.5rem' }}>
          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 400, color: '#fff', marginBottom: '0.5rem' }}>Headshot crop tool</div>
          <div style={{ width: 48, height: 2, background: '#c8102e', marginBottom: '1rem' }} />
          <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 2.5rem', maxWidth: 620 }}>
            Pick a person, drag the sliders until the framing looks right in the circle, then copy the line at the bottom and send it to me. The big and small circles match exactly how it renders on the Team page.
          </p>

          <select value={idx} onChange={e => reset(parseInt(e.target.value))}
            style={{ background: '#0a0a16', color: '#fff', border: '1px solid #1a1a2e', padding: '0.7rem 1rem', fontFamily: "'Inter',sans-serif", fontSize: '0.85rem', marginBottom: '2.5rem', minWidth: 280 }}>
            {ALL.map((m, i) => <option key={m.name} value={i}>{m.name}</option>)}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem', alignItems: 'start' }} className="vx-about-grid">
            {/* previews */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <Circle d={260} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Circle d={190} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.6rem', letterSpacing: '0.15em', color: '#6b7280' }}>← TEAM PAGE SIZE (190px)</span>
              </div>
            </div>

            {/* controls */}
            <div>
              <Slider label="ZOOM" val={scale} min={1} max={2.4} step={0.01} set={setScale} fmt={n => n.toFixed(2) + '×'} />
              <Slider label="VERTICAL  (lower = show more of the top / head)" val={posY} min={0} max={60} step={1} set={setPosY} fmt={n => n + '%'} />
              <Slider label="HORIZONTAL  (nudge left / right)" val={tx} min={-25} max={25} step={1} set={setTx} fmt={n => n + '%'} />

              <div style={{ marginTop: '2.5rem', borderTop: '1px solid #131323', paddingTop: '1.5rem' }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.62rem', letterSpacing: '0.18em', color: '#c8102e', marginBottom: '0.75rem' }}>COPY THIS LINE</div>
                <div style={{ background: '#0a0a16', border: '1px solid #1a1a2e', padding: '1rem', fontFamily: 'monospace', fontSize: '0.82rem', color: '#cfe0f5', wordBreak: 'break-all', marginBottom: '1rem' }}>{line}</div>
                <button onClick={() => { navigator.clipboard?.writeText(line); setCopied(true) }}
                  style={{ background: '#c8102e', color: '#fff', border: 'none', cursor: 'pointer', padding: '0.8rem 1.75rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
                <button onClick={() => reset(idx)}
                  style={{ background: 'none', color: 'rgba(255,255,255,0.55)', border: '1px solid #1a1a2e', cursor: 'pointer', padding: '0.8rem 1.5rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginLeft: '0.75rem' }}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
