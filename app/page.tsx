'use client'
import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'

const VaxonWidget      = lazy(() => import('@/components/VaxonWidget'))
const SatelliteDiagram = lazy(() => import('@/components/SatelliteDiagram'))

/* ─────────────────────────────────────────────────────── */
/*  TYPES                                                   */
/* ─────────────────────────────────────────────────────── */
type Section = 'home' | 'about' | 'technology' | 'team' | 'news' | 'contact'

/* ─────────────────────────────────────────────────────── */
/*  LOADING SCREEN                                          */
/* ─────────────────────────────────────────────────────── */
function LoadingScreen({ done }: { done: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'all',
      transition: 'opacity 0.6s ease 0.1s',
    }}>
      <img src="/vaxon/logo.png" alt="Vaxon Space" style={{
        height: 56, width: 'auto', opacity: done ? 0 : 1,
        animation: 'vx-logofade 1.2s ease both',
      }} />
      <div style={{
        marginTop: '2rem', display: 'flex', gap: '0.4rem',
        animation: 'vx-logofade 1.2s ease 0.3s both',
      }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: 3, height: 3, borderRadius: '50%', background: '#333',
            animation: `vx-load-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
      <div style={{
        marginTop: '1.25rem', fontSize: '0.6rem', letterSpacing: '0.28em',
        textTransform: 'uppercase', color: '#333',
        animation: 'vx-logofade 1.2s ease 0.5s both',
      }}>
        VAXON SPACE / INITIALIZING
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  STARFIELD CANVAS                                        */
/* ─────────────────────────────────────────────────────── */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const STARS = 200
    const stars = Array.from({ length: STARS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.15 + 0.03,
      opacity: Math.random() * 0.7 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
    }))

    let animId: number

    const draw = () => {
      animId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        s.twinkle += s.speed * 0.05
        const op = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${op})`
        ctx.fill()
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      zIndex: 1, pointerEvents: 'none',
    }} />
  )
}

/* ─────────────────────────────────────────────────────── */
/*  TYPEWRITER                                              */
/* ─────────────────────────────────────────────────────── */
function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(id)
    }, 65)
    return () => clearInterval(id)
  }, [started, text])

  return (
    <>
      {displayed}
      {displayed.length < text.length && (
        <span style={{ animation: 'vx-blink 0.8s ease infinite', opacity: 1 }}>|</span>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  CLASSIFIED STAT (redaction reveal)                     */
/* ─────────────────────────────────────────────────────── */
function ClassifiedStat({ value, label, revealed, delay = 0 }: { value: string; label: string; revealed: boolean; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(t)
    }
  }, [revealed, delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      setDisplayed(value.slice(0, i + 1))
      i++
      if (i >= value.length) clearInterval(id)
    }, 150)
    return () => clearInterval(id)
  }, [started, value])

  const done = displayed.length >= value.length

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2.2rem,3.5vw,3.2rem)',
        fontWeight: 900, color: '#fff', position: 'relative', display: 'inline-block',
        minWidth: '4ch' }}>
        {displayed || <span style={{ opacity: 0 }}>{value}</span>}
        {started && !done && (
          <span style={{ animation: 'vx-blink 0.8s ease infinite', opacity: 1, color: '#c8102e' }}>|</span>
        )}
      </div>
      <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: '#fff',
        textTransform: 'uppercase', marginTop: '0.3rem', opacity: done ? 1 : 0.4,
        transition: 'opacity 0.4s ease' }}>{label}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  VLEO COMPARISON BAR                                    */
/* ─────────────────────────────────────────────────────── */
function VLEOComparison({ visible }: { visible: boolean }) {
  const bars = [
    { label: 'Image Resolution', vleo: 95, leo: 55, vUnit: '<30cm', lUnit: '~50cm' },
    { label: 'Signal Latency',   vleo: 92, leo: 40, vUnit: '<15ms', lUnit: '~40ms' },
    { label: 'Revisit Time',     vleo: 90, leo: 50, vUnit: '<2hr',  lUnit: '~4hr'  },
    { label: 'Debris Risk',      vleo: 88, leo: 30, vUnit: 'Weeks', lUnit: 'Years'  },
  ]

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#444', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <span>VLEO vs LEO PERFORMANCE</span>
        <span style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, background: '#c8102e', display: 'inline-block' }} />VLEO
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, background: '#333', display: 'inline-block' }} />LEO
          </span>
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {bars.map((b, i) => (
          <div key={b.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#ddd', letterSpacing: '0.06em', fontFamily: "'Inter', sans-serif" }}>{b.label}</span>
              <span style={{ fontSize: '0.68rem', color: '#c8102e', letterSpacing: '0.08em' }}>{b.vUnit}</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: '#111', borderRadius: 0 }}>
              {/* LEO bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                background: '#2a2a2a',
                width: visible ? `${b.leo}%` : '0%',
                transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
              }} />
              {/* VLEO bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                background: 'linear-gradient(90deg, #8b0000, #c8102e)',
                width: visible ? `${b.vleo}%` : '0%',
                transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.15 + 0.2}s`,
                boxShadow: '0 0 8px rgba(200,16,46,0.4)',
              }} />
            </div>
            <div style={{ fontSize: '0.6rem', color: '#555', marginTop: '0.25rem', textAlign: 'right', fontFamily: "'Inter', sans-serif" }}>
              LEO: {b.lUnit}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  LEFT SECTION INDICATOR                                  */
/* ─────────────────────────────────────────────────────── */
function SectionIndicator({ active }: { active: Section }) {
  const SECTIONS: Section[] = ['home', 'about', 'technology', 'team', 'news', 'contact']
  return (
    <div style={{
      position: 'fixed', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
      zIndex: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
    }}>
      <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #333)' }} />
      {SECTIONS.map(s => (
        <div key={s} title={s.toUpperCase()} style={{
          width: active === s ? 6 : 4,
          height: active === s ? 6 : 4,
          borderRadius: '50%',
          background: active === s ? '#c8102e' : '#333',
          boxShadow: active === s ? '0 0 8px #c8102e' : 'none',
          transition: 'all 0.3s ease',
          cursor: 'default',
        }} />
      ))}
      <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #333, transparent)' }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  SCROLL REVEAL                                           */
/* ─────────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}

function Fade({ children, delay = 0, up = true, fromRight = false }: {
  children: React.ReactNode; delay?: number; up?: boolean; fromRight?: boolean
}) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : (fromRight ? 'translateX(40px)' : up ? 'translateY(24px)' : 'translateX(-20px)'),
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    }}>{children}</div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  COUNTER                                                 */
/* ─────────────────────────────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0)
  const { ref, vis } = useReveal()
  useEffect(() => {
    if (!vis) return
    let start: number
    const raf = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1600, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [vis, to])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}

/* ─────────────────────────────────────────────────────── */
/*  EXPANDABLE CARD                                         */
/* ─────────────────────────────────────────────────────── */
function ExpandCard({ title, summary, full, image }: {
  title: string; summary: string; full: string; image?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{ cursor: 'pointer', border: '1px solid #1a1a1a', background: open ? '#0a0a0a' : '#000',
        transition: 'background 0.3s, border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#c8102e'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#1a1a1a'}
    >
      {image && (
        <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative' }}>
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover',
            filter: 'brightness(0.75)',
            transform: open ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #000)' }} />
        </div>
      )}
      <div style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <h3 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: '1.15rem', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>{title}</h3>
          <span style={{ fontSize: '1.25rem', color: open ? '#c8102e' : '#555', flexShrink: 0, marginTop: 2,
            transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s, color 0.3s', display: 'inline-block' }}>+</span>
        </div>
        <p style={{ color: '#ddd', fontSize: '0.95rem', marginTop: '0.75rem', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>{summary}</p>
        <div style={{ maxHeight: open ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.5s ease' }}>
          <p style={{ color: '#e0e0e0', fontSize: '0.95rem', marginTop: '1rem', lineHeight: 1.8,
            borderTop: '1px solid #222', paddingTop: '1rem', fontFamily: "'Inter', sans-serif" }}>{full}</p>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', letterSpacing: '0.12em',
          color: open ? '#c8102e' : '#555', textTransform: 'uppercase', transition: 'color 0.3s' }}>
          {open ? 'COLLAPSE' : 'READ MORE'}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  LOGIN MODAL                                             */
/* ─────────────────────────────────────────────────────── */
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <div style={{ background: '#050505', border: '1px solid #1a1a1a', padding: '2.5rem',
        width: 360, maxWidth: '90vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase' }}>SECURE ACCESS</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555',
            cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>x</button>
        </div>
        <div style={{ borderBottom: '1px solid #1a1a1a', marginBottom: '2rem', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#c8102e',
            textTransform: 'uppercase', marginBottom: '0.5rem' }}>STATUS: RESTRICTED</div>
          <div style={{ color: '#ddd', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif" }}>
            Portal under development. Access credentials will be issued upon authorization.
          </div>
        </div>
        {['EMAIL / CLEARANCE ID', 'PASSPHRASE'].map(ph => (
          <div key={ph} style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: '#444',
              marginBottom: '0.35rem', textTransform: 'uppercase' }}>{ph}</div>
            <input disabled type={ph.includes('PASS') ? 'password' : 'email'} placeholder="---"
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#444',
                padding: '0.6rem 0.75rem', fontSize: '0.85rem', fontFamily: 'inherit',
                boxSizing: 'border-box' }} />
          </div>
        ))}
        <button disabled style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem',
          background: '#0d0d0d', border: '1px solid #c8102e22', color: '#c8102e44',
          fontFamily: "'Bitter',Georgia,serif", fontSize: '0.75rem', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'not-allowed' }}>
          ACCESS RESTRICTED
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  CAPABILITY STRIP — auto-scroll + click modal           */
/* ─────────────────────────────────────────────────────── */
type CapCard = { tag: string; title: string; sub: string; body: string }

function CapabilityStrip() {
  const [selectedCap, setSelectedCap] = useState<CapCard | null>(null)

  const cards: CapCard[] = [
    {
      tag: 'ISR',
      title: 'Persistent Surveillance',
      sub: '24/7 sub-30cm imaging coverage',
      body: 'Vaxon satellites operating in VLEO deliver sub-30cm resolution imagery with revisit times under two hours. This persistent coverage enables continuous battlefield awareness, infrastructure monitoring, and disaster response that legacy satellites simply cannot match.',
    },
    {
      tag: 'DEFENSE',
      title: 'Missile Defense',
      sub: 'Golden Dome ready, <15ms guidance',
      body: 'Our VLEO constellation provides precise navigation data for hypersonic and intercept missiles with latency under 15ms. The shorter signal path from 200km altitude is critical for Golden Dome-class missile defense systems requiring near-instantaneous guidance corrections.',
    },
    {
      tag: 'COMMS',
      title: 'High-Speed Connectivity',
      sub: '5x lower latency than LEO',
      body: 'Operating five times closer to Earth than conventional LEO satellites, Vaxon delivers latency improvements that transform real-time communications. Financial trading, remote surgery, directed energy systems, and military C2 networks all benefit from this dramatic reduction.',
    },
    {
      tag: 'VLEO',
      title: 'Self-Cleaning Orbit',
      sub: 'Debris-free in weeks, not decades',
      body: "Natural atmospheric drag at VLEO altitudes clears debris within weeks rather than the decades required at LEO. This self-cleaning mechanism dramatically reduces collision risk and ensures the long-term sustainability of Vaxon's operational constellation.",
    },
    {
      tag: 'ABEP',
      title: 'No Propellant Limits',
      sub: 'Atmosphere as infinite fuel source',
      body: "Vaxon's patented Air-Breathing Electric Propulsion system collects atmospheric molecules and uses them as propellant, eliminating the traditional constraint of finite fuel tanks. Satellites can operate indefinitely in VLEO, turning atmospheric drag from a mission-ending enemy into a renewable resource.",
    },
    {
      tag: 'AI',
      title: 'AI-Enabled Sensing',
      sub: 'Edge compute for on-orbit processing',
      body: 'Onboard AI processors perform real-time analysis of sensor data before downlink, dramatically reducing bandwidth requirements while accelerating decision timelines. Target detection, change analysis, and threat classification happen in orbit, not in a ground data center.',
    },
  ]

  return (
    <>
      <div style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', overflow: 'hidden',
        background: '#030303' }}>
        <div style={{ display: 'flex', animation: 'vx-strip-scroll 35s linear infinite' }}>
          {[...cards, ...cards].map((c, i) => (
            <div key={i} onClick={() => setSelectedCap(c)} style={{
              flexShrink: 0, width: 240, padding: '2rem 1.75rem',
              borderRight: '1px solid #111', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = '#0a0a0a'
                const tag = e.currentTarget.querySelector('.cap-tag') as HTMLElement
                if (tag) tag.style.color = '#c8102e'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                const tag = e.currentTarget.querySelector('.cap-tag') as HTMLElement
                if (tag) tag.style.color = '#444'
              }}
            >
              <div className="cap-tag" style={{ fontSize: '0.58rem', letterSpacing: '0.2em',
                color: '#444', textTransform: 'uppercase', marginBottom: '0.6rem',
                transition: 'color 0.2s' }}>{c.tag}</div>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', fontWeight: 700,
                marginBottom: '0.4rem', color: '#fff' }}>{c.title}</div>
              <div style={{ fontSize: '0.84rem', color: '#ddd', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCap && (
        <div
          onClick={() => setSelectedCap(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(12px)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#060606', border: '1px solid #222', padding: '3rem',
              width: 540, maxWidth: '90vw', animation: 'vx-fadeup 0.35s ease both',
              position: 'relative' }}
          >
            <button
              onClick={() => setSelectedCap(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'none', border: 'none', color: '#555', cursor: 'pointer',
                fontSize: '1.2rem', lineHeight: 1 }}
            >×</button>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#c8102e', marginBottom: '0.75rem' }}>{selectedCap.tag}</div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.75rem', fontWeight: 700,
              color: '#fff', margin: '0 0 0.5rem', lineHeight: 1.2 }}>{selectedCap.title}</h2>
            <div style={{ fontSize: '0.8rem', color: '#c8102e', letterSpacing: '0.08em',
              marginBottom: '1.5rem', fontFamily: "'Inter', sans-serif" }}>{selectedCap.sub}</div>
            <p style={{ color: '#ddd', fontSize: '0.95rem', lineHeight: 1.8,
              fontFamily: "'Inter', sans-serif", margin: 0 }}>{selectedCap.body}</p>
          </div>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  GLOBE ANIMATION (2D canvas)                            */
/* ─────────────────────────────────────────────────────── */
function GlobeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 600
    const H = 420
    canvas.width = W
    canvas.height = H

    const cx = W * 0.42
    const cy = H * 0.5
    const R = 140
    const vleoR = R + 28
    const leoR = R + 65
    const sunX = W - 90
    const sunY = 75

    let angle = 0
    let animId: number

    // Trail history
    const trail: { x: number; y: number }[] = []

    const draw = () => {
      animId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)

      // ── Sun-to-Earth light beam ──
      const beamGrad = ctx.createLinearGradient(sunX, sunY, cx, cy)
      beamGrad.addColorStop(0, 'rgba(255,240,100,0.12)')
      beamGrad.addColorStop(1, 'rgba(255,240,100,0)')
      ctx.beginPath()
      ctx.moveTo(sunX, sunY)
      ctx.lineTo(cx, cy)
      ctx.strokeStyle = beamGrad
      ctx.lineWidth = 18
      ctx.stroke()

      // ── Earth base ──
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = '#0a1a2e'
      ctx.fill()

      // ── Continent blobs ──
      const continents = [
        { dx: -55, dy: -40, rx: 32, ry: 22, rot: 0.3 },
        { dx: 20, dy: -50, rx: 28, ry: 18, rot: -0.2 },
        { dx: -20, dy: 20, rx: 40, ry: 26, rot: 0.5 },
        { dx: 55, dy: 10, rx: 22, ry: 30, rot: -0.4 },
        { dx: -60, dy: 50, rx: 18, ry: 12, rot: 0.1 },
      ]
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R - 1, 0, Math.PI * 2)
      ctx.clip()
      for (const c of continents) {
        ctx.save()
        ctx.translate(cx + c.dx, cy + c.dy)
        ctx.rotate(c.rot)
        ctx.beginPath()
        ctx.ellipse(0, 0, c.rx, c.ry, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#1a5a1a'
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()

      // ── Night-side shadow ──
      const sunDir = Math.atan2(sunY - cy, sunX - cx)
      const shadowGrad = ctx.createRadialGradient(
        cx - Math.cos(sunDir) * R * 0.4, cy - Math.sin(sunDir) * R * 0.4, R * 0.1,
        cx - Math.cos(sunDir) * R * 0.1, cy - Math.sin(sunDir) * R * 0.1, R
      )
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0)')
      shadowGrad.addColorStop(0.5, 'rgba(0,0,20,0.4)')
      shadowGrad.addColorStop(1, 'rgba(0,0,20,0.85)')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = shadowGrad
      ctx.fill()

      // ── Light-side highlight ──
      const litGrad = ctx.createRadialGradient(
        cx + Math.cos(sunDir) * R * 0.3, cy + Math.sin(sunDir) * R * 0.3, 0,
        cx + Math.cos(sunDir) * R * 0.3, cy + Math.sin(sunDir) * R * 0.3, R * 0.8
      )
      litGrad.addColorStop(0, 'rgba(100,180,255,0.08)')
      litGrad.addColorStop(1, 'rgba(100,180,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = litGrad
      ctx.fill()

      // ── Atmosphere ring ──
      const atmosGrad = ctx.createRadialGradient(cx, cy, R - 2, cx, cy, R + 22)
      atmosGrad.addColorStop(0, 'rgba(80,160,255,0.18)')
      atmosGrad.addColorStop(0.5, 'rgba(80,160,255,0.07)')
      atmosGrad.addColorStop(1, 'rgba(80,160,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R + 22, 0, Math.PI * 2)
      ctx.fillStyle = atmosGrad
      ctx.fill()

      // ── Earth outline ──
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(80,160,255,0.35)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // ── LEO orbit (dashed) ──
      ctx.save()
      ctx.setLineDash([6, 8])
      ctx.beginPath()
      ctx.ellipse(cx, cy, leoR, leoR * 0.38, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(100,100,100,0.25)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
      // LEO label
      const leoLabelX = cx + leoR * Math.cos(-0.3)
      const leoLabelY = cy + leoR * 0.38 * Math.sin(-0.3) - 10
      ctx.fillStyle = 'rgba(120,120,120,0.7)'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('LEO 400km', leoLabelX, leoLabelY)

      // ── VLEO orbit (solid red) ──
      ctx.beginPath()
      ctx.ellipse(cx, cy, vleoR, vleoR * 0.38, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(200,16,46,0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      // VLEO label
      const vleoLabelX = cx + vleoR * Math.cos(0.4)
      const vleoLabelY = cy + vleoR * 0.38 * Math.sin(0.4) - 8
      ctx.fillStyle = 'rgba(200,16,46,0.9)'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText('VLEO 200km', vleoLabelX, vleoLabelY)

      // ── Satellite position ──
      const satX = cx + Math.cos(angle) * vleoR
      const satY = cy + Math.sin(angle) * vleoR * 0.38
      angle += 0.008

      // Update trail
      trail.push({ x: satX, y: satY })
      if (trail.length > 8) trail.shift()

      // Ion exhaust trail
      for (let ti = 0; ti < trail.length; ti++) {
        const alpha = (ti / trail.length) * 0.5
        ctx.beginPath()
        ctx.arc(trail[ti].x, trail[ti].y, 2.5 - ti * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100,200,255,${alpha})`
        ctx.fill()
      }

      // Satellite glow
      const glowGrad = ctx.createRadialGradient(satX, satY, 0, satX, satY, 18)
      glowGrad.addColorStop(0, 'rgba(100,220,255,0.35)')
      glowGrad.addColorStop(1, 'rgba(100,220,255,0)')
      ctx.beginPath()
      ctx.arc(satX, satY, 18, 0, Math.PI * 2)
      ctx.fillStyle = glowGrad
      ctx.fill()

      // Satellite body
      ctx.fillStyle = '#aab'
      ctx.fillRect(satX - 4, satY - 6, 8, 12)

      // Solar panels
      ctx.fillStyle = '#2244aa'
      ctx.fillRect(satX - 12, satY - 2, 7, 4)
      ctx.fillRect(satX + 5, satY - 2, 7, 4)

      // ── Sun ──
      // Sun rays
      for (let i = 0; i < 8; i++) {
        const rayAngle = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(sunX + Math.cos(rayAngle) * 14, sunY + Math.sin(rayAngle) * 14)
        ctx.lineTo(sunX + Math.cos(rayAngle) * 22, sunY + Math.sin(rayAngle) * 22)
        ctx.strokeStyle = 'rgba(255,220,80,0.6)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
      // Sun body
      const sunGrad = ctx.createRadialGradient(sunX - 3, sunY - 3, 2, sunX, sunY, 14)
      sunGrad.addColorStop(0, '#fff8c0')
      sunGrad.addColorStop(0.5, '#ffcc00')
      sunGrad.addColorStop(1, '#ff8800')
      ctx.beginPath()
      ctx.arc(sunX, sunY, 14, 0, Math.PI * 2)
      ctx.fillStyle = sunGrad
      ctx.fill()
      // Sun outer glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 30)
      sunGlow.addColorStop(0, 'rgba(255,200,0,0.15)')
      sunGlow.addColorStop(1, 'rgba(255,200,0,0)')
      ctx.beginPath()
      ctx.arc(sunX, sunY, 30, 0, Math.PI * 2)
      ctx.fillStyle = sunGlow
      ctx.fill()
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  )
}

/* ─────────────────────────────────────────────────────── */
/*  LOGO STRIP                                              */
/* ─────────────────────────────────────────────────────── */
function LogoItem({ src, alt, invert = false }: { src: string; alt: string; invert?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 120, height: 80, flexShrink: 0,
        transition: 'transform 0.25s ease',
        transform: hovered ? 'scale(1.14)' : 'scale(1)',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%', maxHeight: '100%',
          objectFit: 'contain',
          filter: hovered
            ? 'brightness(1) grayscale(0) opacity(1)'
            : invert
              ? 'brightness(0) invert(1) opacity(0.55)'
              : 'brightness(0) invert(1) opacity(0.55)',
          transition: 'filter 0.3s ease',
        }}
      />
    </div>
  )
}

function LogoSection() {
  const orgs = [
    { src: '/vaxon/logos/nasa.svg',     alt: 'NASA',                invert: false },
    { src: '/vaxon/logos/lockheed.svg', alt: 'Lockheed Martin',     invert: true  },
    { src: '/vaxon/logos/dod.svg',      alt: 'Department of Defense', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/United_States_Space_Force_emblem.svg',
      alt: 'US Space Force', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/National_Reconnaissance_Office_seal.svg',
      alt: 'NRO', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/Seal_of_the_United_States_Department_of_the_Army.svg',
      alt: 'US Army', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/Defense_Information_Systems_Agency_seal.svg',
      alt: 'DISA', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/Naval_Research_Laboratory_logo.svg',
      alt: 'Naval Research Laboratory', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/Space_and_Missile_Systems_Center.png',
      alt: 'Space & Missile Systems Center', invert: false },
  ]
  const unis = [
    { src: '/vaxon/logos/stanford.svg', alt: 'Stanford University',  invert: false },
    { src: '/vaxon/logos/cornell.svg',  alt: 'Cornell University',   invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/University_of_Michigan_Logo.svg',
      alt: 'University of Michigan', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/Seal_of_The_University_of_Texas_at_Austin.svg',
      alt: 'UT Austin', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/University_of_North_Carolina_at_Chapel_Hill_seal.svg',
      alt: 'UNC Chapel Hill', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/US_Naval_War_College_seal.svg',
      alt: 'US Naval War College', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/Army_West_Point_Athletics_logo.svg',
      alt: 'West Point', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/University_of_Colorado_seal.svg',
      alt: 'CU Boulder', invert: false },
    { src: 'https://en.wikipedia.org/wiki/Special:FilePath/Bates_College_seal.svg',
      alt: 'Bates College', invert: false },
  ]

  return (
    <section style={{ padding: '5rem 2.5rem', background: '#020202', borderTop: '1px solid #0d0d0d' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Fade>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #1a1a1a)' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#555', whiteSpace: 'nowrap' }}>OUR TEAM HAS WORKED AT</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #1a1a1a)' }} />
          </div>
        </Fade>

        <Fade delay={100}>
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#444', textAlign: 'center', marginBottom: '1.5rem' }}>COMPANIES + ORGANIZATIONS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
              alignItems: 'center', gap: '1rem', rowGap: '1.5rem' }}>
              {orgs.map(o => <LogoItem key={o.alt} {...o} />)}
            </div>
          </div>
        </Fade>

        <Fade delay={200}>
          <div style={{ marginTop: '3.5rem' }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#444', textAlign: 'center', marginBottom: '1.5rem' }}>UNIVERSITIES + RESEARCH</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
              alignItems: 'center', gap: '1rem', rowGap: '1.5rem' }}>
              {unis.map(u => <LogoItem key={u.alt} {...u} />)}
            </div>
          </div>
        </Fade>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  MAIN PAGE                                               */
/* ─────────────────────────────────────────────────────── */
export default function VaxonPage() {
  const [active, setActive] = useState<Section>('home')
  const [showLogin, setShowLogin] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [heroParallax, setHeroParallax] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [compVisible, setCompVisible] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const statsRef = useRef<HTMLDivElement>(null)
  const compRef = useRef<HTMLDivElement>(null)

  /* Loading screen */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1500)
    return () => clearTimeout(t)
  }, [])

  /* Scroll handler */
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY
      setNavScrolled(sy > 40)
      setHeroParallax(sy * 0.25)

      const sections: Section[] = ['home', 'about', 'technology', 'team', 'news', 'contact']
      for (const id of [...sections].reverse()) {
        const el = sectionRefs.current[id]
        if (el && sy >= el.offsetTop - 120) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Stats + comparison visibility */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCompVisible(true) }, { threshold: 0.2 })
    if (compRef.current) obs.observe(compRef.current)
    return () => obs.disconnect()
  }, [])

  const scrollTo = useCallback((id: Section) => {
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const setRef = (id: Section) => (el: HTMLElement | null) => { sectionRefs.current[id] = el }
  const NAV: Section[] = ['home', 'about', 'technology', 'team', 'news', 'contact']

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif",
      minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        body { background: #000 !important; color: #fff !important; font-family: 'Inter', sans-serif !important; }
        * { box-sizing: border-box; }
        ::selection { background: #c8102e; color: #fff; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #c8102e; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes vx-logofade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes vx-load-dot { 0%,80%,100%{opacity:0.15} 40%{opacity:0.8} }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes vx-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes vx-fadeup { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes vx-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes vx-redact { 0%{filter:blur(0px);background:#fff} 100%{filter:blur(0px);background:transparent} }
        @keyframes vx-strip-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>

      {/* ── LOADING ── */}
      <LoadingScreen done={loaded} />

      {/* ── LEFT INDICATOR ── */}
      <SectionIndicator active={active} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 20, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 56,
        background: navScrolled ? 'rgba(0,0,0,0.92)' : 'transparent',
        borderBottom: navScrolled ? '1px solid #111' : 'none',
        backdropFilter: navScrolled ? 'blur(16px)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <button onClick={() => scrollTo('home')} style={{ background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: 0 }}>
          <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 34, width: 'auto' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {NAV.filter(s => s !== 'home').map(s => (
            <button key={s} onClick={() => scrollTo(s)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: '0.7rem', letterSpacing: '0.14em', fontWeight: 500,
              textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
              color: active === s ? '#c8102e' : '#bbb',
              borderBottom: active === s ? '1px solid #c8102e' : '1px solid transparent',
              paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s',
            }}>{s}</button>
          ))}
          <button onClick={() => setShowLogin(true)} style={{
            background: 'none', border: '1px solid #444', cursor: 'pointer',
            padding: '0.3rem 0.9rem', color: '#bbb',
            fontSize: '0.65rem', letterSpacing: '0.14em', fontWeight: 600,
            textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8102e'; (e.currentTarget as HTMLButtonElement).style.color = '#c8102e' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#444'; (e.currentTarget as HTMLButtonElement).style.color = '#bbb' }}
          >LOGIN</button>
        </div>
      </nav>

      {/* ── HOME ── */}
      <section ref={setRef('home')} id="home" style={{
        position: 'relative', height: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 2.5rem 5rem', overflow: 'hidden',
      }}>
        {/* Starfield */}
        <StarField />

        {/* Hero image with parallax */}
        <img src="/vaxon/hero.png" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '120%',
          objectFit: 'cover', filter: 'brightness(0.38)', zIndex: 0,
          transform: `translateY(${heroParallax}px)`,
          top: '-10%',
        }} />

        {/* Noise texture overlay */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2,
          pointerEvents: 'none', opacity: 0.04 }}>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
          zIndex: 3 }} />

        {/* Scan line */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 4, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            animation: 'scan 10s linear infinite' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 5, maxWidth: 900 }}>
          <div style={{ fontSize: '0.63rem', letterSpacing: '0.24em', textTransform: 'uppercase',
            color: '#c8102e', marginBottom: '1.5rem', animation: 'vx-fadeup 1s ease 0.3s both' }}>
            VLEO SATELLITE SYSTEMS / DEFENSE + CONNECTIVITY
          </div>
          <h1 style={{ fontFamily: "'Bitter', Georgia, serif",
            fontSize: 'clamp(2rem,4vw,4rem)', fontWeight: 900, lineHeight: 1.08,
            letterSpacing: '-0.01em', margin: 0, animation: 'vx-fadeup 1s ease 0.5s both' }}>
            <span style={{ display: 'block' }}>
              <TypeWriter text="Real-time missile defense" delay={600} />
            </span>
            <span style={{ display: 'block' }}>
              <TypeWriter text="and connectivity today." delay={1800} />
            </span>
          </h1>
          <p style={{ color: '#ddd', fontSize: '1rem', maxWidth: 540, marginTop: '1.5rem',
            lineHeight: 1.7, animation: 'vx-fadeup 1s ease 0.8s both', fontFamily: "'Inter', sans-serif" }}>
            Vaxon Space operates air-breathing satellites at 180-250 km altitude, delivering defense-grade
            imaging, sub-15ms latency, and next-generation connectivity with no propellant limits.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap',
            animation: 'vx-fadeup 1s ease 1s both' }}>
            <button onClick={() => scrollTo('about')} style={{
              background: '#fff', color: '#000', border: 'none', cursor: 'pointer',
              padding: '0.75rem 2rem', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#ddd'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#fff'}
            >EXPLORE MISSION</button>
            <button onClick={() => scrollTo('technology')} style={{
              background: 'transparent', color: '#fff', border: '1px solid #333', cursor: 'pointer',
              padding: '0.75rem 2rem', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8102e'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#333'}
            >VIEW TECHNOLOGY</button>
          </div>
        </div>

        {/* CLASSIFIED metrics bar */}
        <div ref={statsRef} style={{ position: 'relative', zIndex: 5,
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px',
          marginTop: '4rem', borderTop: '1px solid #1a1a1a', paddingTop: '2rem',
          justifyContent: 'center', maxWidth: '100%',
          animation: 'vx-fadeup 1s ease 1.2s both' }}>
          {[
            { v: '<15ms', label: 'LATENCY',      d: 0    },
            { v: '<30cm', label: 'RESOLUTION',   d: 800  },
            { v: '250km', label: 'ALTITUDE',     d: 1600 },
            { v: '<2hr',  label: 'REVISIT TIME', d: 2400 },
          ].map(m => (
            <ClassifiedStat key={m.label} value={m.v} label={m.label} revealed={statsVisible} delay={m.d} />
          ))}
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '2rem', right: '2.5rem', zIndex: 5 }}>
          <div style={{ width: 1, height: 60,
            background: 'linear-gradient(to bottom, transparent, #c8102e)', margin: '0 auto' }} />
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.22em', color: '#444',
            marginTop: '0.5rem', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>SCROLL</div>
        </div>
      </section>

      {/* ── CAPABILITY STRIP ── */}
      <CapabilityStrip />

      {/* ── LOGO STRIP ── */}
      <LogoSection />

      {/* ── ABOUT ── */}
      <section ref={setRef('about')} id="about" style={{ padding: '6rem 2.5rem', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#c8102e22' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>MISSION CAPABILITIES</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
              Four Pillars of VLEO Superiority
            </h2>
            <p style={{ color: '#ddd', maxWidth: 580, lineHeight: 1.75, marginBottom: '3.5rem', fontSize: '0.95rem', fontFamily: "'Inter', sans-serif" }}>
              Operating 3x closer to Earth's surface unlocks capabilities that are physically impossible from higher orbits.
              Click any capability to expand the full briefing.
            </p>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1px', background: '#0d0d0d' }}>
            {[
              {
                title: 'Remote Sensing',
                summary: 'Sub-30cm imagery with 1-2 hour revisit times. Defense and commercial ISR from 180-250km.',
                image: '/vaxon/scene1.png',
                full: 'Operating 3x closer to the surface in very low Earth orbit (VLEO) with altitudes of 180-250 km, Vaxon satellites revolutionize space-based imaging and intelligence. VLEO operation enables image resolutions under 30 cm with revisit times of 1-2 hours, serving the US government and its allies to ensure leaders and soldiers have the pivotal information they need to make vital decisions. We also provide information to the commercial market, providing agriculture, energy, infrastructure, forestry and mapping services.',
              },
              {
                title: 'Missile Defense',
                summary: 'Golden Dome ready. Precise navigation for hypersonic and intercept missiles via decreased latency.',
                image: '/vaxon/scene2.png',
                full: 'Golden Dome is the DoD\'s next big challenge and Vaxon Space is ready to partner. Our satellites enable more precise navigation for hypersonic and intercept missiles by decreasing latency. Faster response for hypersonic tracking is paramount and enabled by Vaxon\'s patented air-breathing electric propulsion subsystem. Precise navigation also extends to our commercial customers, such as maritime tracking and traffic route optimization.',
              },
              {
                title: 'Connectivity',
                summary: 'Best-in-class VLEO bus for satellite partners. Sub-15ms latency for military comms and AI data transmission.',
                image: '/vaxon/scene3.png',
                full: 'Vaxon Space is a bus provider for satellite partners looking to bring connectivity to another level. With advancements in AI and data transmission exponentially increasing, satellites operating in VLEO provide best-in-class performance. As Internet providers increase their footprint in space, we will be right there with them to revolutionize information dissemination. Lower latency also enhances financial trading, remote surgery, directed energy weapons and military communications.',
              },
              {
                title: 'Space Resiliency',
                summary: 'Self-cleaning orbit. Debris re-enters within weeks, not decades. Survivability advantage over LEO.',
                image: '/vaxon/scene4.png',
                full: 'Satellites in low Earth orbit (LEO) are susceptible to orbital debris, e.g. by anti-satellite attacks or careless operations. Operating in VLEO has the advantage of being self-cleaning where debris falls down into Earth\'s atmosphere within a few weeks versus decades or years for LEO satellites. Vaxon satellites, as well as partnering companies using Vaxon buses for payload operations, will have this survivability advantage over traditional satellites as we create the next generation of proliferated satellites.',
              },
            ].map((c, i) => (
              <Fade key={c.title} delay={i * 80}>
                <ExpandCard {...c} />
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section ref={setRef('technology')} id="technology" style={{ padding: '6rem 2.5rem', background: '#040404' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#c8102e22' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>BREAKTHROUGH TECHNOLOGY</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
              Air-Breathing Electric Propulsion
            </h2>
            <p style={{ color: '#ddd', maxWidth: 620, lineHeight: 1.75, marginBottom: '4rem', fontSize: '0.95rem', fontFamily: "'Inter', sans-serif" }}>
              ABEP harnesses atmospheric molecules as propellant, enabling continuous operation in ultra-low Earth orbits
              where conventional satellites cannot survive. ABEP transforms extreme atmospheric drag from an enemy into an advantage.
            </p>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', marginBottom: '4rem' }}>
            <Fade up={false}>
              <div style={{ position: 'relative', border: '1px solid #1a1a1a' }}>
                <GlobeAnimation />
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, transparent 60%, #040404)',
                  pointerEvents: 'none' }} />
              </div>
            </Fade>
            <div>
              {[
                { n: '01', title: 'Sharper Imagery', sub: 'Under 30cm Resolution',
                  body: 'Operating three times closer to Earth delivers up to twice the imaging precision. Our proprietary Air Intake System achieves this without heavier optical systems.' },
                { n: '02', title: 'Ultra-Low Latency', sub: 'Under 15ms Signal Path',
                  body: 'A five-times shorter signal path means near-real-time performance that is unattainable at higher altitudes. Critical for directed energy, missile guidance, and remote surgery.' },
                { n: '03', title: 'Self-Cleaning Orbit', sub: 'Weeks, Not Decades',
                  body: 'Natural atmospheric drag continuously clears debris. The orbit remains safe and sustainable while LEO debris persists for years.' },
                { n: '04', title: 'The ABEP Advantage', sub: 'Atmosphere as Fuel',
                  body: 'Using the atmosphere itself as fuel, turning a former enemy into an ally. Indefinite mission duration with no propellant tank required.' },
              ].map((s, i) => (
                <Fade key={s.n} delay={i * 100} fromRight>
                  <TechStep {...s} />
                </Fade>
              ))}
            </div>
          </div>

          {/* Interactive Satellite Diagram */}
          <Fade>
            <div style={{ marginTop: '1rem', marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: 32, height: 1, background: '#c8102e22' }} />
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>ABEP SATELLITE DESIGN</span>
              </div>
              <Suspense fallback={
                <div style={{ height: 520, border: '1px solid #111', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', background: '#020202' }}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#333',
                    textTransform: 'uppercase' }}>LOADING 3D MODEL...</div>
                </div>
              }>
                <SatelliteDiagram />
              </Suspense>
            </div>
          </Fade>

          {/* VLEO vs LEO Comparison */}
          <Fade>
            <div ref={compRef}>
              <VLEOComparison visible={compVisible} />
            </div>
          </Fade>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section ref={setRef('team')} id="team" style={{ padding: '6rem 2.5rem', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#c8102e22' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>LEADERSHIP</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>Command Structure</h2>
            <p style={{ color: '#ddd', maxWidth: 560, lineHeight: 1.75, marginBottom: '4rem', fontSize: '0.95rem', fontFamily: "'Inter', sans-serif" }}>
              Decades of Lockheed Martin, DoD, Space Force, NRO, and Stanford experience. Click any member to read the full brief.
            </p>
          </Fade>

          <div style={{ fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888',
            marginBottom: '1.5rem', borderBottom: '1px solid #0d0d0d', paddingBottom: '0.75rem',
            textAlign: 'center' }}>CORE LEADERSHIP</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {CORE_TEAM.map((m, i) => <Fade key={m.name} delay={i * 80}><TeamCard {...m} /></Fade>)}
          </div>

          <div style={{ fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888',
            marginBottom: '1.5rem', borderBottom: '1px solid #0d0d0d', paddingBottom: '0.75rem',
            marginTop: '2rem', textAlign: 'center' }}>ADVISORY BOARD</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
            {ADVISORS.map((m, i) => <Fade key={m.name} delay={i * 80}><div style={{ width: 240 }}><TeamCard {...m} /></div></Fade>)}
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section ref={setRef('news')} id="news" style={{ padding: '6rem 2.5rem', background: '#040404' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#c8102e22' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>INTELLIGENCE FEED</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>News + Media</h2>
          </Fade>

          <Fade>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0',
              border: '1px solid #1a1a1a', marginBottom: '3rem' }}>
              <div style={{ padding: '2.5rem', borderRight: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#c8102e', marginBottom: '0.75rem' }}>FEATURED / FEB 25 2026</div>
                <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.3rem', fontWeight: 700,
                  margin: '0 0 1rem', lineHeight: 1.3 }}>CEO Dr. Steven Shepard on VLEO Momentum</h3>
                <p style={{ color: '#ddd', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
                  Dr. Shepard joins Balerion Space Ventures to discuss VLEO mission use cases including ISR,
                  missile defense sensing, and AI-enabled space capabilities.
                </p>
                <a href="https://www.youtube.com/@balerionspaceventures" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#666', textDecoration: 'none', borderBottom: '1px solid #222', paddingBottom: 2 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#c8102e'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#c8102e' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#666'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#222' }}
                >WATCH ON YOUTUBE / BALERION SPACE VENTURES</a>
              </div>
              <div style={{ background: '#080808', aspectRatio: '16/9' }}>
                <a href="https://www.youtube.com/watch?v=piWj3lWfUEM" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', position: 'relative', width: '100%', height: '100%' }}>
                  <img src="https://img.youtube.com/vi/piWj3lWfUEM/maxresdefault.jpg"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.1)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.3)'}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,16,46,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: '1.5rem', marginLeft: '4px' }}>&#9654;</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </Fade>

          <Fade>
            <div style={{ marginBottom: '3rem', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
              <img src="https://img1.wsimg.com/isteam/ip/b6d77e34-40ce-4ade-86a8-3e868f7bc80c/UNIVITY.png/:/rs=w:928,cg:true"
                alt="UNIVITY" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block',
                  filter: 'brightness(0.7)' }} />
            </div>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1px', background: '#0d0d0d' }}>
            {NEWS.map((n, i) => <Fade key={n.title} delay={i * 60}><NewsCard {...n} /></Fade>)}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section ref={setRef('contact')} id="contact" style={{ padding: '6rem 2.5rem', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#c8102e22' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>SECURE CONTACT</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>Partner With Vaxon Space</h2>
            <p style={{ color: '#ddd', maxWidth: 520, lineHeight: 1.75, marginBottom: '4rem', fontSize: '0.95rem', fontFamily: "'Inter', sans-serif" }}>
              Defense contractors, investors, and commercial partners may submit inquiries below.
              All communications are handled with appropriate discretion.
            </p>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <Fade up={false}><ContactForm /></Fade>
            <Fade delay={150}>
              <div>
                {[
                  { label: 'EMAIL', val: 'contact@vaxonspace.com' },
                  { label: 'WEB', val: 'vaxonspace.com' },
                  { label: 'LOCATION', val: 'United States' },
                ].map(d => (
                  <div key={d.label} style={{ borderBottom: '1px solid #0d0d0d',
                    paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: '#333', marginBottom: '0.35rem' }}>{d.label}</div>
                    <div style={{ color: '#ddd', fontSize: '0.95rem', fontFamily: "'Inter', sans-serif" }}>{d.val}</div>
                  </div>
                ))}
                <div style={{ marginTop: '2rem', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
                  <img src="/vaxon/earth.png" alt="VLEO" style={{ width: '100%', display: 'block',
                    filter: 'brightness(0.6)', maxHeight: 200, objectFit: 'cover' }} />
                </div>
              </div>
            </Fade>
          </div>

          {/* Calendly Booker */}
          <Fade>
            <div style={{ marginTop: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: 32, height: 1, background: '#c8102e22' }} />
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>SCHEDULE A BRIEFING</span>
              </div>
              <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.5rem', fontWeight: 700,
                margin: '0 0 1rem', color: '#fff' }}>Book a Meeting with Vaxon Space</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 520, fontFamily: "'Inter', sans-serif" }}>
                Schedule a 30-minute intelligence briefing with our leadership team. Defense contractors, government officials, and investors may request a classified capabilities review.
              </p>
              <iframe
                src="https://calendly.com/stevenpshepard-vaxonspace/30-1?hide_event_type_details=1&hide_gdpr_banner=1&background_color=000000&text_color=ffffff&primary_color=c8102e"
                style={{ width: '100%', height: 700, border: 'none', background: '#000' }}
                title="Book a Meeting"
              />
            </div>
          </Fade>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #0d0d0d', padding: '2.5rem 2.5rem',
        flexWrap: 'wrap', gap: '1.5rem', background: '#000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 26, width: 'auto', opacity: 0.5 }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.58rem', letterSpacing: '0.18em', color: '#555',
              textTransform: 'uppercase', marginBottom: '0.4rem' }}>MAILING ADDRESS</div>
            <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.7, fontFamily: "'Inter',sans-serif" }}>
              Vaxon Space, Inc.<br />
              2066 N Capitol Ave #5009<br />
              San Jose, CA 95132
            </div>
          </div>
          <button onClick={() => setShowLogin(true)} style={{
            background: 'none', border: '1px solid #1a1a1a', color: '#555', cursor: 'pointer',
            padding: '0.35rem 0.9rem', fontSize: '0.62rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8102e'; (e.currentTarget as HTMLButtonElement).style.color = '#c8102e' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1a1a1a'; (e.currentTarget as HTMLButtonElement).style.color = '#555' }}
          >PORTAL LOGIN</button>
        </div>
        <div style={{ borderTop: '1px solid #0d0d0d', paddingTop: '1.25rem',
          fontSize: '0.62rem', letterSpacing: '0.12em', color: '#333', textTransform: 'uppercase' }}>
          Copyright 2026 Vaxon Space. All Rights Reserved.
        </div>
      </footer>

      {/* ── VAXON AI ── */}
      <Suspense fallback={null}>
        <VaxonWidget size={130} />
      </Suspense>

      {/* ── LOGIN MODAL ── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  TECH STEP                                               */
/* ─────────────────────────────────────────────────────── */
function TechStep({ n, title, sub, body }: { n: string; title: string; sub: string; body: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      cursor: 'pointer', borderBottom: '1px solid #0d0d0d', padding: '1.25rem 0',
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.62rem', color: '#c8102e', letterSpacing: '0.1em',
          marginTop: '0.15rem', flexShrink: 0, fontFamily: "'Bitter',Georgia,serif" }}>{n}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1rem',
                letterSpacing: '0.02em' }}>{title}</div>
              <div style={{ fontSize: '0.84rem', color: '#ddd', marginTop: '0.2rem', fontFamily: "'Inter', sans-serif" }}>{sub}</div>
            </div>
            <span style={{ color: open ? '#c8102e' : '#444', fontSize: '1.1rem',
              transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s, color 0.3s',
              flexShrink: 0, marginLeft: '1rem', display: 'inline-block' }}>+</span>
          </div>
          <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
            <p style={{ color: '#e0e0e0', fontSize: '0.88rem', lineHeight: 1.75, marginTop: '0.75rem',
              paddingTop: '0.75rem', borderTop: '1px solid #0d0d0d', fontFamily: "'Inter', sans-serif" }}>{body}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  TEAM CARD                                               */
/* ─────────────────────────────────────────────────────── */
type TeamMember = { name: string; role: string; image?: string; creds: string[]; linkedin?: string }

function TeamCard({ name, role, image, creds, linkedin }: TeamMember) {
  const [open, setOpen] = useState(false)
  const initials = name.split(' ').filter(w => w.length > 1).slice(-2).map(w => w[0]).join('')
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      cursor: 'pointer', background: '#000', border: '1px solid #0d0d0d',
      padding: '1.75rem', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#c8102e'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#0d0d0d'}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          border: open ? '2px solid #c8102e' : '2px solid #2a2a2a',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#111', flexShrink: 0, transition: 'border-color 0.3s',
          boxShadow: open ? '0 0 16px rgba(200,16,46,0.25)' : 'none',
        }}>
          {image ? (
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.1rem',
              fontWeight: 700, color: '#444' }}>{initials}</span>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700,
          fontSize: '1.1rem', marginBottom: '0.3rem' }}>{name}</div>
        <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Inter', sans-serif" }}>{role}</div>

        <div style={{ maxHeight: open ? 360 : 0, overflow: 'hidden', transition: 'max-height 0.5s ease' }}>
          <div style={{ borderTop: '1px solid #0d0d0d', paddingTop: '1rem', marginTop: '0.5rem' }}>
            {creds.map(c => (
              <div key={c} style={{ fontSize: '0.84rem', color: '#ddd', lineHeight: 1.7,
                display: 'flex', gap: '0.5rem', textAlign: 'left', marginBottom: '0.3rem',
                fontFamily: "'Inter', sans-serif" }}>
                <span style={{ color: '#c8102e', flexShrink: 0 }}>-</span>{c}
              </div>
            ))}
            {linkedin && (
              <a
                href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  marginTop: '0.75rem', fontSize: '0.6rem', letterSpacing: '0.14em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  color: '#555', border: '1px solid #1a1a1a', padding: '0.3rem 0.6rem',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#c8102e'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#c8102e' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#555'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1a1a1a' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LINKEDIN
              </a>
            )}
          </div>
        </div>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: open ? '#c8102e' : '#333',
          textTransform: 'uppercase', marginTop: '0.5rem', transition: 'color 0.3s' }}>
          {open ? 'COLLAPSE' : 'VIEW BIO'}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  NEWS CARD                                               */
/* ─────────────────────────────────────────────────────── */
type NewsItem = { date: string; title: string; body: string; source: string; link?: string }

function NewsCard({ date, title, body, source, link }: NewsItem) {
  return (
    <a href={link || '#'} target={link ? '_blank' : '_self'} rel="noopener noreferrer"
      style={{ display: 'block', background: '#000', padding: '1.75rem', textDecoration: 'none',
        borderRight: '1px solid #0d0d0d', transition: 'background 0.2s, border-left-color 0.2s',
        borderLeft: '2px solid transparent' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#060606'; (e.currentTarget as HTMLAnchorElement).style.borderLeftColor = '#c8102e' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#000'; (e.currentTarget as HTMLAnchorElement).style.borderLeftColor = 'transparent' }}
    >
      <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: '0.6rem' }}>{date}</div>
      <h4 style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '0.95rem',
        color: '#fff', margin: '0 0 0.75rem', lineHeight: 1.45 }}>{title}</h4>
      <p style={{ fontSize: '0.88rem', color: '#ddd', lineHeight: 1.7, margin: '0 0 1rem', fontFamily: "'Inter', sans-serif" }}>{body}</p>
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#333', borderTop: '1px solid #0d0d0d', paddingTop: '0.75rem' }}>{source}</div>
    </a>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  CONTACT FORM                                            */
/* ─────────────────────────────────────────────────────── */
function ContactForm() {
  const [sent, setSent] = useState(false)
  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true) }}
      style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {[
        { label: 'FULL NAME', type: 'text' },
        { label: 'EMAIL ADDRESS', type: 'email' },
        { label: 'ORGANIZATION', type: 'text' },
      ].map(f => (
        <div key={f.label} style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#333', marginBottom: '0.4rem' }}>{f.label}</div>
          <input type={f.type} style={{
            width: '100%', background: '#060606', border: '1px solid #111',
            color: '#ccc', padding: '0.65rem 0.75rem', fontSize: '0.9rem',
            fontFamily: 'inherit', outline: 'none',
          }}
            onFocus={e => (e.target.style.borderColor = '#c8102e')}
            onBlur={e => (e.target.style.borderColor = '#111')}
          />
        </div>
      ))}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#333', marginBottom: '0.4rem' }}>MESSAGE</div>
        <textarea rows={5} style={{
          width: '100%', background: '#060606', border: '1px solid #111',
          color: '#ccc', padding: '0.65rem 0.75rem', fontSize: '0.9rem',
          fontFamily: 'inherit', outline: 'none', resize: 'vertical',
        }}
          onFocus={e => (e.target.style.borderColor = '#c8102e')}
          onBlur={e => (e.target.style.borderColor = '#111')}
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem',
        cursor: 'pointer', color: '#ddd', fontSize: '0.84rem', letterSpacing: '0.06em', fontFamily: "'Inter', sans-serif" }}>
        <input type="checkbox" style={{ accentColor: '#c8102e' }} />
        Subscribe to Vaxon Space updates
      </label>
      <button type="submit" style={{
        background: sent ? '#0d0d0d' : '#fff', color: sent ? '#c8102e' : '#000',
        border: sent ? '1px solid #c8102e22' : 'none',
        padding: '0.75rem 2rem', cursor: sent ? 'default' : 'pointer',
        fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.16em',
        textTransform: 'uppercase', fontFamily: "'Bitter',Georgia,serif",
        transition: 'all 0.4s', alignSelf: 'flex-start',
      }}>
        {sent ? 'MESSAGE TRANSMITTED' : 'SEND MESSAGE'}
      </button>
    </form>
  )
}

/* ─────────────────────────────────────────────────────── */
/*  DATA                                                    */
/* ─────────────────────────────────────────────────────── */
const CORE_TEAM: TeamMember[] = [
  {
    name: 'Dr. Steven P. Shepard',
    role: 'Co-Founder + CEO',
    image: '/vaxon/team-shepard.png',
    linkedin: 'https://www.linkedin.com/in/stevenpshepard/',
    creds: [
      '21+ years in satellite design and advanced systems',
      'Sr. R+D Program Manager, Lockheed Martin — $30M budget',
      'Advisor: Space Force, NASA, DoD, University of Michigan',
      'Author: Vanquishing Cancer',
    ],
  },
  {
    name: 'Dr. Charles Lipscomb',
    role: 'Co-Founder + Chief Scientist',
    image: '/vaxon/team-lipscomb.png',
    linkedin: 'https://www.linkedin.com/in/charleslipscomb88',
    creds: [
      'PhD Aerospace Engineering, University of Colorado Boulder',
      'Satellite Systems Engineer on COSMO',
      'Specialist in electric propulsion integration',
      'Air-breathing propulsion and plasmadynamics modeling',
    ],
  },
  {
    name: 'Brandon Williamson',
    role: 'Head of Engineering',
    image: '/vaxon/team-williamson.jpg',
    linkedin: 'https://www.linkedin.com/in/brandon-williamson-83b0191ba/',
    creds: [
      'Aerospace engineering and plasma research background',
      'University of Michigan aerospace training',
      'Design, analysis, testing and system integration for VLEO',
    ],
  },
  {
    name: 'Lt. Col. Anand Shah',
    role: 'Sr. Advisor, Defense',
    image: '/vaxon/team-shah.jpg',
    linkedin: 'https://www.linkedin.com/in/ananddineshshah/',
    creds: [
      'Retired USAF Program Manager',
      'Deputy PM for SATCOM and AEHF',
      'Chief of Flight Sciences and Payload Analysis at NRO',
    ],
  },
  {
    name: 'Dr. Iain Boyd',
    role: 'Sr. Advisor, VLEO',
    image: '/vaxon/team-boyd.png',
    linkedin: 'https://www.linkedin.com/in/iain-boyd/',
    creds: [
      '30+ years in hypersonics and space plasma physics',
      'Professor, Aerospace Engineering Sciences, CU Boulder',
      'Director, Center for National Security Initiatives',
      '200+ peer-reviewed publications',
    ],
  },
]

const ADVISORS: TeamMember[] = [
  {
    name: 'Lt. Gen. Joseph Anderson',
    role: 'Advisory Board',
    image: '/vaxon/team-anderson.png',
    linkedin: 'https://www.linkedin.com/in/joe--anderson',
    creds: [
      'Retired Deputy Chief of Staff, US Army',
      'President + CEO, Rafael Systems Global Sustainment',
      'Commanded XVIII Airborne Corps',
    ],
  },
  {
    name: 'Dr. Nelson Pedreiro',
    role: 'Advisory Board',
    image: '/vaxon/team-pedreiro.jpg',
    creds: [
      '28 years at Lockheed Martin',
      'Former VP + Chief Engineer of Space',
      'PhD Aerospace Engineering, Stanford University',
      'National Academy of Engineering member',
    ],
  },
]

const NEWS: NewsItem[] = [
  { date: 'APR 23 2026', title: 'UNIVITY Raises 27M EUR for VLEO 5G Connectivity', body: 'Paris-based UNIVITY secured Series A funding to advance VLEO 5G demonstration and commercial deployment by 2028.', source: 'EU STARTUPS' },
  { date: 'MAR 16 2026', title: 'EDA Commits $17.9M to VLEO Military Research', body: 'European Defence Agency launches initiative exploring VLEO for enhanced ISR and new mission architectures.', source: 'VIA SATELLITE' },
  { date: 'FEB 25 2026', title: 'Vaxon Space CEO Discusses VLEO Momentum', body: 'Dr. Shepard joins Balerion Space Ventures to discuss ISR, missile defense sensing, and AI-enabled space capabilities.', source: 'YOUTUBE', link: 'https://www.youtube.com/@balerionspaceventures' },
  { date: 'FEB 05 2026', title: 'Vaxon Joins Starburst / IAI Cohort 4', body: 'Selected for IAI Catalyst cohort focused on autonomous systems, advanced sensing, AI computing, and VLEO satellites.', source: 'LINKEDIN', link: 'https://www.linkedin.com/company/vaxon-space' },
  { date: 'JAN 14 2026', title: 'AIAA SciTech 2026 VLEO Panel', body: 'Dr. Shepard spoke on ABEP, emerging VLEO use cases, and growing alignment across academia, industry, and government.', source: 'LINKEDIN' },
  { date: 'NOV 19 2025', title: 'Redwire Awarded $44M DARPA ABEP Contract', body: 'Redwire receives Phase 2 DARPA contract for air-breathing satellite development, validating ABEP as a defense priority.', source: 'SPACENEWS', link: 'https://spacenews.com' },
]
