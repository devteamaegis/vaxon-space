'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

/* ── TYPES ─────────────────────────────────────────── */
type Section = 'home' | 'about' | 'technology' | 'team' | 'news' | 'contact'

/* ── SCROLL REVEAL ─────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.12 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return { ref, vis }
}

function Fade({ children, delay = 0, up = true }: { children: React.ReactNode; delay?: number; up?: boolean }) {
  const { ref, vis } = useReveal()
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : up ? 'translateY(24px)' : 'translateX(-20px)',
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
    }}>{children}</div>
  )
}

/* ── COUNTER ───────────────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0)
  const { ref, vis } = useReveal()
  useEffect(() => {
    if (!vis) return
    let start: number; const dur = 1600
    const raf = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [vis, to])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}

/* ── EXPANDABLE CARD ───────────────────────────────── */
function ExpandCard({ title, summary, full, image }: { title: string; summary: string; full: string; image?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        cursor: 'pointer', border: '1px solid #333', background: open ? '#111' : '#000',
        transition: 'background 0.3s',
      }}
    >
      {image && (
        <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative' }}>
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover',
            filter: 'grayscale(100%) brightness(0.7)',
            transform: open ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #000)' }} />
        </div>
      )}
      <div style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <h3 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: '1.15rem', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>{title}</h3>
          <span style={{ fontSize: '1.25rem', color: '#555', flexShrink: 0, marginTop: 2,
            transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', display: 'inline-block' }}>+</span>
        </div>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.75rem', lineHeight: 1.7 }}>{summary}</p>
        <div style={{
          maxHeight: open ? 400 : 0, overflow: 'hidden',
          transition: 'max-height 0.5s ease',
        }}>
          <p style={{ color: '#bbb', fontSize: '0.875rem', marginTop: '1rem', lineHeight: 1.8,
            borderTop: '1px solid #222', paddingTop: '1rem' }}>{full}</p>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#555',
          textTransform: 'uppercase' }}>{open ? 'COLLAPSE' : 'READ MORE'}</div>
      </div>
    </div>
  )
}

/* ── VOICE AGENT PLACEHOLDER ───────────────────────── */
function VoiceAgent() {
  const [active, setActive] = useState(false)
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200 }}>
      <button
        onClick={() => setActive(a => !a)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: active ? '#fff' : '#000',
          border: '2px solid #fff',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: active ? '0 0 0 8px rgba(255,255,255,0.08)' : 'none',
          transition: 'all 0.3s',
        }}
        aria-label="Voice agent"
      >
        <style>{`@keyframes pulse-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}`}</style>
        {active && <div style={{ position: 'absolute', width: 56, height: 56, borderRadius: '50%',
          border: '2px solid #fff', animation: 'pulse-ring 1.2s ease-out infinite' }} />}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"
            fill={active ? '#000' : '#fff'} />
          <path d="M19 10a7 7 0 0 1-14 0M12 19v4M8 23h8"
            stroke={active ? '#000' : '#fff'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {active && (
        <div style={{
          position: 'absolute', bottom: 68, right: 0, width: 280,
          background: '#111', border: '1px solid #333', padding: '1.25rem',
        }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#666', marginBottom: '0.5rem' }}>VAXON AI / VOICE AGENT</div>
          <div style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6 }}>
            Voice agent integration pending. Replace this component with your voice agent code.
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#555',
              animation: 'pulse-ring 1s ease-out infinite' }} />
            <span style={{ fontSize: '0.72rem', color: '#555', letterSpacing: '0.1em' }}>STANDBY</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── LOGIN MODAL ───────────────────────────────────── */
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '2.5rem', width: 360, maxWidth: '90vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase' }}>SECURE ACCESS</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555',
            cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>x</button>
        </div>
        <div style={{ borderBottom: '1px solid #222', marginBottom: '2rem', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase',
            marginBottom: '0.5rem' }}>STATUS</div>
          <div style={{ color: '#888', fontSize: '0.85rem' }}>Portal under development. Access credentials will be issued upon authorization.</div>
        </div>
        {['EMAIL / CLEARANCE ID', 'PASSPHRASE'].map(ph => (
          <div key={ph} style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: '#555', marginBottom: '0.35rem',
              textTransform: 'uppercase' }}>{ph}</div>
            <input disabled type={ph.includes('PASS') ? 'password' : 'email'} placeholder="---"
              style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#444',
                padding: '0.6rem 0.75rem', fontSize: '0.85rem', fontFamily: 'inherit',
                boxSizing: 'border-box' }} />
          </div>
        ))}
        <button disabled style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem',
          background: '#222', border: '1px solid #333', color: '#555',
          fontFamily: "'Bitter',Georgia,serif", fontSize: '0.75rem', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'not-allowed' }}>
          ACCESS RESTRICTED
        </button>
      </div>
    </div>
  )
}

/* ── MAIN PAGE ─────────────────────────────────────── */
export default function VaxonPage() {
  const [active, setActive] = useState<Section>('home')
  const [showLogin, setShowLogin] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40)
      const sections: Section[] = ['home','about','technology','team','news','contact']
      for (const id of [...sections].reverse()) {
        const el = sectionRefs.current[id]
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id: Section) => {
    const el = sectionRefs.current[id]
    if (el) { el.scrollIntoView({ behavior: 'smooth' }) }
  }, [])

  const setRef = (id: Section) => (el: HTMLElement | null) => { sectionRefs.current[id] = el }

  const NAV: Section[] = ['home','about','technology','team','news','contact']

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif",
      minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        body { background: #000 !important; color: #fff !important; }
        * { box-sizing: border-box; }
        ::selection { background: #fff; color: #000; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 60,
        background: navScrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
        borderBottom: navScrolled ? '1px solid #1a1a1a' : 'none',
        backdropFilter: navScrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <button onClick={() => scrollTo('home')} style={{ background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: 0 }}>
          <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 36, width: 'auto' }} />
        </button>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {NAV.filter(s => s !== 'home').map(s => (
            <button key={s} onClick={() => scrollTo(s)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 500,
              textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
              color: active === s ? '#fff' : '#555',
              borderBottom: active === s ? '1px solid #fff' : '1px solid transparent',
              paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s',
            }}>{s}</button>
          ))}
          <button onClick={() => setShowLogin(true)} style={{
            background: 'none', border: '1px solid #333', cursor: 'pointer',
            padding: '0.35rem 1rem', color: '#666',
            fontSize: '0.68rem', letterSpacing: '0.14em', fontWeight: 600,
            textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#333'; (e.currentTarget as HTMLButtonElement).style.color = '#666' }}
          >LOGIN</button>
        </div>
      </nav>

      {/* ── HOME ── */}
      <section ref={setRef('home')} id="home" style={{ position: 'relative', height: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 2.5rem 5rem', overflow: 'hidden' }}>

        {/* Hero image */}
        <img src="/vaxon/hero.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', filter: 'grayscale(100%) brightness(0.35)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.2) 60%, transparent 100%)', zIndex: 1 }} />

        {/* Scan line */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            animation: 'scan 8s linear infinite' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: 900 }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#555', marginBottom: '1.5rem', animation: 'fadeIn 1s ease 0.2s both' }}>
            VLEO SATELLITE SYSTEMS / DEFENSE + CONNECTIVITY
          </div>
          <h1 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 'clamp(2.5rem,6vw,5.5rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.01em', margin: 0,
            animation: 'fadeIn 1s ease 0.4s both' }}>
            Real-time missile defense<br />and connectivity today.
          </h1>
          <p style={{ color: '#777', fontSize: '1rem', maxWidth: 540, marginTop: '1.5rem', lineHeight: 1.7,
            animation: 'fadeIn 1s ease 0.6s both' }}>
            Vaxon Space operates air-breathing satellites at 180-250 km altitude, delivering defense-grade imaging,
            sub-15ms latency, and next-generation connectivity with no propellant limits.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap',
            animation: 'fadeIn 1s ease 0.8s both' }}>
            <button onClick={() => scrollTo('about')} style={{
              background: '#fff', color: '#000', border: 'none', cursor: 'pointer',
              padding: '0.75rem 2rem', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
              transition: 'background 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ccc' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}
            >EXPLORE MISSION</button>
            <button onClick={() => scrollTo('technology')} style={{
              background: 'transparent', color: '#fff', border: '1px solid #444', cursor: 'pointer',
              padding: '0.75rem 2rem', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#444' }}
            >VIEW TECHNOLOGY</button>
          </div>
        </div>

        {/* Metrics bar */}
        <div style={{ position: 'relative', zIndex: 3, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: '2px', marginTop: '4rem', borderTop: '1px solid #1a1a1a', paddingTop: '2rem',
          maxWidth: 800, animation: 'fadeIn 1s ease 1s both' }}>
          {[
            { v: 15, suf: 'ms', pre: '<', label: 'LATENCY' },
            { v: 30, suf: 'cm', pre: '<', label: 'RESOLUTION' },
            { v: 250, suf: 'km', pre: '', label: 'ALTITUDE' },
            { v: 2, suf: 'hr', pre: '<', label: 'REVISIT TIME' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)',
                fontWeight: 900, color: '#fff' }}>
                <Counter to={m.v} prefix={m.pre} suffix={m.suf} />
              </div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: '#555',
                textTransform: 'uppercase', marginTop: '0.3rem' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '2rem', right: '2.5rem', zIndex: 3 }}>
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, #555)', margin: '0 auto' }} />
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#444', marginTop: '0.5rem',
            writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>SCROLL</div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section ref={setRef('about')} id="about" style={{ padding: '6rem 2.5rem', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#333' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>MISSION CAPABILITIES</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
              Four Pillars of VLEO Superiority
            </h2>
            <p style={{ color: '#666', maxWidth: 580, lineHeight: 1.75, marginBottom: '3.5rem', fontSize: '0.95rem' }}>
              Operating 3x closer to Earth's surface unlocks capabilities that are physically impossible from higher orbits.
              Click any capability to expand the full briefing.
            </p>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px',
            background: '#111' }}>
            <Fade delay={0}>
              <ExpandCard
                title="Remote Sensing"
                summary="Sub-30cm imagery with 1-2 hour revisit times. Defense and commercial ISR from 180-250km."
                image="/vaxon/scene1.png"
                full="Operating 3x closer to the surface in very low Earth orbit (VLEO) with altitudes of 180-250 km, Vaxon satellites revolutionize space-based imaging and intelligence. VLEO operation enables image resolutions under 30 cm with revisit times of 1-2 hours, serving the US government and its allies to ensure leaders and soldiers have the pivotal information they need to make vital decisions. We also provide information to the commercial market, providing agriculture, energy, infrastructure, forestry and mapping services."
              />
            </Fade>
            <Fade delay={80}>
              <ExpandCard
                title="Missile Defense"
                summary="Golden Dome ready. Precise navigation for hypersonic and intercept missiles via decreased latency."
                image="/vaxon/scene2.png"
                full="Golden Dome is the DoD's next big challenge and Vaxon Space is ready to partner. Our satellites enable more precise navigation for hypersonic and intercept missiles by decreasing latency. Faster response for hypersonic tracking is paramount and enabled by Vaxon's patented air-breathing electric propulsion subsystem. Precise navigation also extends to our commercial customers, such as maritime tracking and traffic route optimization."
              />
            </Fade>
            <Fade delay={160}>
              <ExpandCard
                title="Connectivity"
                summary="Best-in-class VLEO bus for satellite partners. Sub-15ms latency for military comms and AI data transmission."
                image="/vaxon/scene3.png"
                full="Vaxon Space is a bus provider for satellite partners looking to bring connectivity to another level. With advancements in AI and data transmission exponentially increasing, satellites operating in VLEO provide best-in-class performance. As Internet providers increase their footprint in space, we will be right there with them to revolutionize information dissemination. Lower latency also enhances financial trading, remote surgery, directed energy weapons and military communications."
              />
            </Fade>
            <Fade delay={240}>
              <ExpandCard
                title="Space Resiliency"
                summary="Self-cleaning orbit. Debris re-enters within weeks, not decades. Survivability advantage over LEO."
                image="/vaxon/scene4.png"
                full="Satellites in low Earth orbit (LEO) are susceptible to orbital debris, e.g. by anti-satellite attacks or careless operations. Operating in VLEO has the advantage of being self-cleaning where debris falls down into Earth's atmosphere within a few weeks versus decades or years for LEO satellites. Vaxon satellites, as well as partnering companies using Vaxon buses for payload operations, will have this survivability advantage over traditional satellites as we create the next generation of proliferated satellites."
              />
            </Fade>
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section ref={setRef('technology')} id="technology" style={{ padding: '6rem 2.5rem', background: '#050505' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#333' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>BREAKTHROUGH TECHNOLOGY</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
              Air-Breathing Electric Propulsion
            </h2>
            <p style={{ color: '#666', maxWidth: 620, lineHeight: 1.75, marginBottom: '4rem', fontSize: '0.95rem' }}>
              ABEP harnesses atmospheric molecules as propellant, enabling continuous operation in ultra-low Earth orbits where conventional satellites cannot survive. Traditional satellites cannot operate between 150-250 km due to extreme atmospheric drag that would quickly deorbit them. ABEP transforms this challenge into an advantage.
            </p>
          </Fade>

          {/* Orbit image + specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
            <Fade up={false}>
              <div style={{ position: 'relative', border: '1px solid #1a1a1a' }}>
                <img src="/vaxon/orbit.png" alt="Orbit diagram" style={{ width: '100%', display: 'block',
                  filter: 'grayscale(100%) brightness(0.8)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #050505)' }} />
              </div>
            </Fade>
            <div>
              {[
                { n: '01', title: 'Sharper Imagery', sub: 'Under 30cm Resolution', body: 'Operating three times closer to Earth delivers up to twice the imaging precision. Our proprietary Air Intake System achieves this without heavier optical systems.' },
                { n: '02', title: 'Ultra-Low Latency', sub: 'Under 15ms Signal Path', body: 'A five-times shorter signal path means near-real-time performance that is unattainable at higher altitudes. Critical for directed energy, missile guidance, and remote surgery.' },
                { n: '03', title: 'Self-Cleaning Orbit', sub: 'Weeks, Not Decades', body: 'Natural atmospheric drag continuously clears debris. The orbit remains safe and sustainable while LEO debris persists for years.' },
                { n: '04', title: 'The ABEP Advantage', sub: 'Atmosphere as Fuel', body: 'Using the atmosphere itself as fuel, turning a former enemy into an ally. Indefinite mission duration with no propellant tank required.' },
              ].map((s, i) => (
                <Fade key={s.n} delay={i * 100}>
                  <TechStep {...s} />
                </Fade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section ref={setRef('team')} id="team" style={{ padding: '6rem 2.5rem', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#333' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>LEADERSHIP</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>Command Structure</h2>
            <p style={{ color: '#666', maxWidth: 560, lineHeight: 1.75, marginBottom: '4rem', fontSize: '0.95rem' }}>
              Decades of Lockheed Martin, DoD, Space Force, NRO, and Stanford experience. Click any member to read the full brief.
            </p>
          </Fade>

          {/* Core team */}
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444',
            marginBottom: '1.5rem', borderBottom: '1px solid #111', paddingBottom: '0.75rem' }}>CORE LEADERSHIP</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {CORE_TEAM.map((m, i) => <Fade key={m.name} delay={i * 80}><TeamCard {...m} /></Fade>)}
          </div>

          {/* Advisory */}
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444',
            marginBottom: '1.5rem', borderBottom: '1px solid #111', paddingBottom: '0.75rem', marginTop: '2rem' }}>ADVISORY BOARD</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {ADVISORS.map((m, i) => <Fade key={m.name} delay={i * 80}><TeamCard {...m} /></Fade>)}
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section ref={setRef('news')} id="news" style={{ padding: '6rem 2.5rem', background: '#050505' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#333' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>INTELLIGENCE FEED</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>News + Media</h2>
          </Fade>

          {/* CEO Video */}
          <Fade>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', border: '1px solid #1a1a1a', marginBottom: '3rem' }}>
              <div style={{ padding: '2.5rem', borderRight: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#555', marginBottom: '0.75rem' }}>FEATURED / FEB 25 2026</div>
                <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.3rem', fontWeight: 700,
                  margin: '0 0 1rem', lineHeight: 1.3 }}>CEO Dr. Steven Shepard on VLEO Momentum</h3>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                  Dr. Shepard joins Balerion Space Ventures to discuss VLEO mission use cases including ISR,
                  missile defense sensing, and AI-enabled space capabilities.
                </p>
                <a href="https://www.youtube.com/@balerionspaceventures" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#888', textDecoration: 'none', borderBottom: '1px solid #333', paddingBottom: 2,
                    transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#888'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#333' }}
                >WATCH ON YOUTUBE / BALERION SPACE VENTURES</a>
              </div>
              <div style={{ background: '#0a0a0a', aspectRatio: '16/9' }}>
                <iframe
                  style={{ width: '100%', height: '100%', border: 'none', filter: 'grayscale(30%)' }}
                  src="https://www.youtube.com/embed/videoseries?list=PLrFEm0hs_nHfT9SeSKxCVcSS2H1U5Y9Ws"
                  title="Vaxon Space CEO on VLEO"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Fade>

          {/* UNIVITY image */}
          <Fade>
            <div style={{ marginBottom: '3rem', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
              <img src="https://img1.wsimg.com/isteam/ip/b6d77e34-40ce-4ade-86a8-3e868f7bc80c/UNIVITY.png/:/rs=w:928,cg:true"
                alt="UNIVITY" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block',
                  filter: 'grayscale(100%) brightness(0.6)' }} />
            </div>
          </Fade>

          {/* News grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px',
            background: '#111' }}>
            {NEWS.map((n, i) => <Fade key={n.title} delay={i * 60}><NewsCard {...n} /></Fade>)}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section ref={setRef('contact')} id="contact" style={{ padding: '6rem 2.5rem', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
              <div style={{ width: 32, height: 1, background: '#333' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>SECURE CONTACT</span>
            </div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 900, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>Partner With Vaxon Space</h2>
            <p style={{ color: '#666', maxWidth: 520, lineHeight: 1.75, marginBottom: '4rem', fontSize: '0.95rem' }}>
              Defense contractors, investors, and commercial partners may submit inquiries below.
              All communications are handled with appropriate discretion.
            </p>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <Fade up={false}>
              <ContactForm />
            </Fade>
            <Fade delay={150}>
              <div>
                {[
                  { label: 'EMAIL', val: 'contact@vaxonspace.com' },
                  { label: 'WEB', val: 'vaxonspace.com' },
                  { label: 'LOCATION', val: 'United States' },
                ].map(d => (
                  <div key={d.label} style={{ borderBottom: '1px solid #111', paddingBottom: '1.25rem',
                    marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: '#444', marginBottom: '0.35rem' }}>{d.label}</div>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>{d.val}</div>
                  </div>
                ))}

                {/* Earth image */}
                <div style={{ marginTop: '2rem', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
                  <img src="/vaxon/earth.png" alt="VLEO" style={{ width: '100%', display: 'block',
                    filter: 'grayscale(100%) brightness(0.6)', maxHeight: 200, objectFit: 'cover' }} />
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #111', padding: '2rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 28, width: 'auto', opacity: 0.7 }} />
        </div>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: '#444', textTransform: 'uppercase' }}>
          Copyright 2026 Vaxon Space. All Rights Reserved.
        </div>
        <button onClick={() => setShowLogin(true)} style={{
          background: 'none', border: '1px solid #222', color: '#444', cursor: 'pointer',
          padding: '0.35rem 1rem', fontSize: '0.65rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', fontFamily: "'Inter',sans-serif",
          transition: 'border-color 0.2s, color 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#555'; (e.currentTarget as HTMLButtonElement).style.color = '#888' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#222'; (e.currentTarget as HTMLButtonElement).style.color = '#444' }}
        >PORTAL LOGIN</button>
      </footer>

      {/* ── FIXED COMPONENTS ── */}
      <VoiceAgent />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}

/* ── TECH STEP ─────────────────────────────────────── */
function TechStep({ n, title, sub, body }: { n: string; title: string; sub: string; body: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      cursor: 'pointer', borderBottom: '1px solid #1a1a1a', padding: '1.25rem 0',
      transition: 'background 0.2s',
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.1em',
          marginTop: '0.15rem', flexShrink: 0, fontFamily: "'Bitter',Georgia,serif" }}>{n}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1rem',
                letterSpacing: '0.02em' }}>{title}</div>
              <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '0.2rem' }}>{sub}</div>
            </div>
            <span style={{ color: '#444', fontSize: '1.1rem', transform: open ? 'rotate(45deg)' : 'none',
              transition: 'transform 0.3s', flexShrink: 0, marginLeft: '1rem', display: 'inline-block' }}>+</span>
          </div>
          <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
            <p style={{ color: '#777', fontSize: '0.85rem', lineHeight: 1.75, marginTop: '0.75rem', paddingTop: '0.75rem',
              borderTop: '1px solid #1a1a1a' }}>{body}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── TEAM CARD ─────────────────────────────────────── */
type TeamMember = { name: string; role: string; image?: string; creds: string[] }

function TeamCard({ name, role, image, creds }: TeamMember) {
  const [open, setOpen] = useState(false)
  const initials = name.split(' ').filter(w => w.length > 1).slice(-2).map(w => w[0]).join('')
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      cursor: 'pointer', background: open ? '#0a0a0a' : '#000',
      border: '1px solid #1a1a1a', padding: '1.75rem', transition: 'background 0.3s, border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#333'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#1a1a1a'}
    >
      {/* Circular photo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          border: '2px solid #333',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#111', flexShrink: 0,
          transition: 'border-color 0.3s',
        }}>
          {image ? (
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover',
              filter: 'grayscale(100%)' }} />
          ) : (
            <span style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.1rem', fontWeight: 700, color: '#555' }}>{initials}</span>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '0.95rem',
          marginBottom: '0.3rem' }}>{name}</div>
        <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '0.75rem' }}>{role}</div>

        {/* Expand */}
        <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.5s ease' }}>
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', marginTop: '0.5rem' }}>
            {creds.map(c => (
              <div key={c} style={{ fontSize: '0.78rem', color: '#777', lineHeight: 1.7,
                display: 'flex', gap: '0.5rem', textAlign: 'left', marginBottom: '0.3rem' }}>
                <span style={{ color: '#444', flexShrink: 0 }}>-</span>{c}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: '#444',
          textTransform: 'uppercase', marginTop: '0.5rem' }}>{open ? 'COLLAPSE' : 'VIEW BIO'}</div>
      </div>
    </div>
  )
}

/* ── NEWS CARD ─────────────────────────────────────── */
type NewsItem = { date: string; title: string; body: string; source: string; link?: string }

function NewsCard({ date, title, body, source, link }: NewsItem) {
  return (
    <a href={link || '#'} target={link ? '_blank' : '_self'} rel="noopener noreferrer"
      style={{ display: 'block', background: '#000', padding: '1.75rem', textDecoration: 'none',
        borderRight: '1px solid #111', transition: 'background 0.2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#080808'}
      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#000'}
    >
      <div style={{ fontSize: '0.62rem', color: '#555', letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: '0.6rem' }}>{date}</div>
      <h4 style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '0.95rem',
        color: '#ddd', margin: '0 0 0.75rem', lineHeight: 1.45 }}>{title}</h4>
      <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.7, margin: '0 0 1rem' }}>{body}</p>
      <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#444', borderTop: '1px solid #111', paddingTop: '0.75rem' }}>{source}</div>
    </a>
  )
}

/* ── CONTACT FORM ───────────────────────────────────── */
function ContactForm() {
  const [sent, setSent] = useState(false)
  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {[
        { label: 'FULL NAME', type: 'text', ph: '' },
        { label: 'EMAIL ADDRESS', type: 'email', ph: '' },
        { label: 'ORGANIZATION', type: 'text', ph: '' },
      ].map(f => (
        <div key={f.label} style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#444', marginBottom: '0.4rem' }}>{f.label}</div>
          <input type={f.type} style={{
            width: '100%', background: '#080808', border: '1px solid #222',
            color: '#ddd', padding: '0.65rem 0.75rem', fontSize: '0.9rem',
            fontFamily: 'inherit', outline: 'none',
          }}
            onFocus={e => (e.target.style.borderColor = '#555')}
            onBlur={e => (e.target.style.borderColor = '#222')}
          />
        </div>
      ))}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#444', marginBottom: '0.4rem' }}>MESSAGE</div>
        <textarea rows={5} style={{
          width: '100%', background: '#080808', border: '1px solid #222',
          color: '#ddd', padding: '0.65rem 0.75rem', fontSize: '0.9rem',
          fontFamily: 'inherit', outline: 'none', resize: 'vertical',
        }}
          onFocus={e => (e.target.style.borderColor = '#555')}
          onBlur={e => (e.target.style.borderColor = '#222')}
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem',
        cursor: 'pointer', color: '#555', fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        <input type="checkbox" style={{ accentColor: '#fff' }} />
        Subscribe to Vaxon Space updates
      </label>
      <button type="submit" style={{
        background: sent ? '#1a1a1a' : '#fff', color: sent ? '#555' : '#000',
        border: 'none', padding: '0.75rem 2rem', cursor: sent ? 'default' : 'pointer',
        fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.16em',
        textTransform: 'uppercase', fontFamily: "'Bitter',Georgia,serif",
        transition: 'all 0.3s', alignSelf: 'flex-start',
      }}>
        {sent ? 'MESSAGE TRANSMITTED' : 'SEND MESSAGE'}
      </button>
    </form>
  )
}

/* ── DATA ────────────────────────────────────────────── */
const CORE_TEAM: TeamMember[] = [
  {
    name: 'Dr. Steven P. Shepard',
    role: 'Co-Founder + CEO',
    image: '/vaxon/team-shepard.png',
    creds: [
      '21+ years in satellite design and advanced systems',
      'Sr. R+D Program Manager, Lockheed Martin - $30M budget',
      'Advisor: Space Force, NASA, DoD, University of Michigan',
      'Author: Vanquishing Cancer',
    ],
  },
  {
    name: 'Dr. Charles Lipscomb',
    role: 'Co-Founder + Chief Scientist',
    image: '/vaxon/team-lipscomb.png',
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
    image: '/vaxon/team-williamson.png',
    creds: [
      'Aerospace engineering and plasma research background',
      'University of Michigan aerospace training',
      'Design, analysis, testing and system integration for VLEO',
    ],
  },
  {
    name: 'Lt. Col. Anand Shah',
    role: 'Sr. Advisor, Defense',
    image: '/vaxon/team-shah.png',
    creds: [
      'Retired USAF Program Manager',
      'Deputy PM for SATCOM and AEHF',
      'Chief of Flight Sciences and Payload Analysis at NRO',
    ],
  },
  {
    name: 'Dr. Iain Boyd',
    role: 'Sr. Advisor, VLEO',
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
    creds: [
      'Retired Deputy Chief of Staff, US Army',
      'President + CEO, Rafael Systems Global Sustainment',
      'Commanded XVIII Airborne Corps',
    ],
  },
  {
    name: 'Dr. Nelson Pedreiro',
    role: 'Advisory Board',
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
