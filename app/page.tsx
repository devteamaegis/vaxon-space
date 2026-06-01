'use client'
import { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react'

const SatelliteDiagram = lazy(() => import('@/components/SatelliteDiagram'))
const EarthGlobeV2     = lazy(() => import('@/components/EarthGlobeV2'))
const VaxonWidget      = lazy(() => import('@/components/VaxonWidget'))

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────────────────────────*/
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─────────────────────────────────────────────────────────────
   COUNT-UP ANIMATION
───────────────────────────────────────────────────────────────*/
function CountUp({ target, suffix = '', duration = 1800, visible }: {
  target: number; suffix?: string; duration?: number; visible: boolean
}) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * ease))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [visible, target, duration])
  return <>{val}{suffix}</>
}

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────*/
type Tab = 'home' | 'about' | 'technology' | 'team' | 'news' | 'contact'

export type TeamMember = {
  name: string; role: string; image?: string
  creds: string[]; linkedin?: string; bio?: string; isAdvisor?: boolean
}
export type NewsItem = {
  date: string; title: string; body: string
  source: string; link?: string; image?: string
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────*/
export const CORE_TEAM: TeamMember[] = [
  {
    name: 'Dr. Steven P. Shepard', role: 'Co-Founder & CEO',
    image: '/vaxon/team-shepard.png',
    linkedin: 'https://www.linkedin.com/in/stevenpshepard/',
    bio: 'Dr. Shepard brings 21+ years of satellite design and advanced systems experience. As Senior R&D Program Manager at Lockheed Martin he managed a $30M portfolio and has advised Space Force, NASA, and DoD on next-generation space architectures.',
    creds: ['21+ years in satellite design and advanced systems', 'Sr. R+D Program Manager, Lockheed Martin — $30M budget', 'Advisor: Space Force, NASA, DoD, University of Michigan', 'Author: Vanquishing Cancer'],
  },
  {
    name: 'Dr. Charles Lipscomb', role: 'Co-Founder & Chief Scientist',
    image: '/vaxon/team-lipscomb.png',
    linkedin: 'https://www.linkedin.com/in/charleslipscomb88',
    bio: 'Dr. Lipscomb is the technical architect of Vaxon\'s air-breathing propulsion system. His doctoral research at CU Boulder in plasmadynamics and electric propulsion and work on the COSMO satellite program provide the scientific foundation for sustained VLEO operations.',
    creds: ['PhD Aerospace Engineering, University of Colorado Boulder', 'Satellite Systems Engineer on COSMO', 'Specialist in electric propulsion integration', 'Air-breathing propulsion and plasmadynamics modeling'],
  },
  {
    name: 'Brandon Williamson', role: 'Head of Engineering',
    image: '/vaxon/team-williamson.jpg',
    linkedin: 'https://www.linkedin.com/in/brandon-williamson-83b0191ba/',
    bio: 'Brandon leads Vaxon\'s engineering team, overseeing all aspects of system design, analysis, testing, and integration. His plasma research background from the University of Michigan makes him uniquely qualified to advance VLEO satellite hardware.',
    creds: ['Aerospace engineering and plasma research background', 'University of Michigan aerospace training', 'Design, analysis, testing and system integration for VLEO'],
  },
  {
    name: 'Lt. Col. Anand Shah', role: 'Sr. Advisor, Defense',
    image: '/vaxon/team-shah.jpg',
    linkedin: 'https://www.linkedin.com/in/ananddineshshah/',
    bio: 'A retired USAF Program Manager with deep experience in military satellite systems, Lt. Col. Shah guided major SATCOM and AEHF programs and served as Chief of Flight Sciences and Payload Analysis at the NRO.',
    creds: ['Retired USAF Program Manager', 'Deputy PM for SATCOM and AEHF', 'Chief of Flight Sciences and Payload Analysis at NRO'],
  },
  {
    name: 'Dr. Iain Boyd', role: 'Sr. Advisor, VLEO',
    image: '/vaxon/team-boyd.png',
    linkedin: 'https://www.linkedin.com/in/iain-boyd/',
    bio: 'With 30+ years in hypersonics and space plasma physics and 200+ peer-reviewed publications, Dr. Boyd directs the Center for National Security Initiatives at CU Boulder and is among the world\'s foremost VLEO propulsion experts.',
    creds: ['30+ years in hypersonics and space plasma physics', 'Professor, Aerospace Engineering Sciences, CU Boulder', 'Director, Center for National Security Initiatives', '200+ peer-reviewed publications'],
  },
]

export const ADVISORS: TeamMember[] = [
  {
    name: 'Lt. Gen. Joseph Anderson', role: 'Advisory Board',
    image: '/vaxon/team-anderson.png',
    linkedin: 'https://www.linkedin.com/in/joe--anderson',
    bio: 'Lt. Gen. Anderson served as Deputy Chief of Staff of the US Army and commanded XVIII Airborne Corps. Now President and CEO of Rafael Systems Global Sustainment, he provides Vaxon with strategic guidance on large-scale defense operations and government relationships.',
    creds: ['Retired Deputy Chief of Staff, US Army', 'President + CEO, Rafael Systems Global Sustainment', 'Commanded XVIII Airborne Corps'],
    isAdvisor: true,
  },
  {
    name: 'Dr. Nelson Pedreiro', role: 'Advisory Board',
    image: '/vaxon/team-pedreiro.jpg',
    bio: 'Dr. Pedreiro spent 28 years at Lockheed Martin, culminating as VP and Chief Engineer of Space. A National Academy of Engineering member with a PhD from Stanford, he is one of the most respected satellite systems architects in the industry.',
    creds: ['28 years at Lockheed Martin', 'Former VP + Chief Engineer of Space', 'PhD Aerospace Engineering, Stanford University', 'National Academy of Engineering member'],
    isAdvisor: true,
  },
]

export const NEWS: NewsItem[] = [
  {
    date: 'APR 23 2026', title: 'UNIVITY Raises 27M EUR for VLEO 5G Connectivity',
    body: 'Paris-based UNIVITY secured Series A funding to advance VLEO 5G demonstration and commercial deployment by 2028, signaling strong investor confidence in the VLEO connectivity market that Vaxon is positioned to lead in the US defense and commercial sectors.',
    source: 'EU STARTUPS',
    image: 'https://img1.wsimg.com/isteam/ip/b6d77e34-40ce-4ade-86a8-3e868f7bc80c/UNIVITY.png',
  },
  {
    date: 'MAR 16 2026', title: 'EDA Commits $17.9M to VLEO Military Research',
    body: 'The European Defence Agency launches a major initiative exploring VLEO for enhanced ISR and new mission architectures, validating the strategic importance of sub-200km satellite operations for modern defense applications worldwide.',
    source: 'VIA SATELLITE',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Sentinel-1_radar_vision.jpg/1280px-Sentinel-1_radar_vision.jpg',
  },
  {
    date: 'FEB 25 2026', title: 'Vaxon Space CEO Discusses VLEO Momentum',
    body: 'Dr. Shepard joins Balerion Space Ventures to discuss ISR, missile defense sensing, and AI-enabled space capabilities. The conversation covers ABEP technology, the commercial satellite market, Vaxon\'s competitive advantages, and the company\'s near-term roadmap.',
    source: 'YOUTUBE',
    link: 'https://www.youtube.com/@balerionspaceventures',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/ISS_and_Endeavour_seen_from_the_Soyuz_TMA-20_spacecraft_14.jpg/1280px-ISS_and_Endeavour_seen_from_the_Soyuz_TMA-20_spacecraft_14.jpg',
  },
  {
    date: 'FEB 05 2026', title: 'Vaxon Joins Starburst / IAI Cohort 4',
    body: 'Selected for the IAI Catalyst cohort focused on autonomous systems, advanced sensing, AI computing, and VLEO satellites. Vaxon joins a prestigious group of defense-focused startups advancing next-generation space capabilities for US and allied forces.',
    source: 'LINKEDIN',
    link: 'https://www.linkedin.com/company/vaxon-space',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1280px-The_Earth_seen_from_Apollo_17.jpg',
  },
  {
    date: 'JAN 14 2026', title: 'AIAA SciTech 2026 VLEO Panel',
    body: 'Dr. Shepard spoke on ABEP, emerging VLEO use cases, and growing alignment across academia, industry, and government. The panel highlighted the maturation of VLEO technology and its increasing relevance for both defense and commercial applications.',
    source: 'LINKEDIN',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Bluelight.jpg/1280px-Bluelight.jpg',
  },
  {
    date: 'NOV 19 2025', title: 'Redwire Awarded $44M DARPA ABEP Contract',
    body: 'Redwire receives Phase 2 DARPA contract for air-breathing satellite development, validating ABEP as a defense priority. This contract confirms the maturation of air-breathing electric propulsion technology that forms the technical foundation of Vaxon\'s propulsion system.',
    source: 'SPACENEWS',
    link: 'https://spacenews.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Redwire_Space_logo.jpg/1280px-Redwire_Space_logo.jpg',
  },
]

/* ─────────────────────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────────────────────────*/
function LoadingScreen({ done }: { done: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#02020d',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'all',
      transition: 'opacity 0.8s ease 0.2s',
    }}>
      <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 50, width: 'auto', animation: 'vx-fade 1.2s ease both' }} />
      <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.5rem', animation: 'vx-fade 1.2s ease 0.3s both' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#c8102e', animation: `vx-dot 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   STARFIELD
───────────────────────────────────────────────────────────────*/
export function StarField() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const resize = () => { c.width = innerWidth; c.height = innerHeight }
    resize(); window.addEventListener('resize', resize)
    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 0.85 + 0.1, spd: Math.random() * 0.1 + 0.02,
      op: Math.random() * 0.6 + 0.1, tw: Math.random() * Math.PI * 2,
    }))
    let id: number
    const draw = () => {
      id = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, c.width, c.height)
      for (const s of stars) {
        s.tw += s.spd * 0.04
        const op = s.op * (0.5 + 0.5 * Math.sin(s.tw))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill()
      }
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

/* ─────────────────────────────────────────────────────────────
   NAV — links to dedicated pages
───────────────────────────────────────────────────────────────*/
const NAV_LINKS = [
  { id: 'home',       label: 'HOME',       href: '/' },
  { id: 'about',      label: 'ABOUT',      href: '/about' },
  { id: 'technology', label: 'TECHNOLOGY', href: '/technology' },
  { id: 'team',       label: 'TEAM',       href: '/team' },
  { id: 'news',       label: 'NEWS',       href: '/news' },
  { id: 'contact',    label: 'CONTACT',    href: '/contact' },
]

export function Nav({ active }: { active: Tab }) {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setDark(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 64,
      display: 'flex', alignItems: 'center', padding: '0 2.5rem',
      background: dark ? 'rgba(2,2,13,0.96)' : 'rgba(2,2,13,0.6)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${dark ? '#131323' : 'transparent'}`,
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {/* Logo → home */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 30, width: 'auto' }} />
      </a>

      {/* Desktop tabs */}
      <div className="vx-nav-tabs" style={{ margin: '0 auto', display: 'flex', gap: '0.15rem' }}>
        {NAV_LINKS.map(t => (
          <a key={t.id} href={t.href} style={{
            textDecoration: 'none',
            display: 'inline-block',
            padding: '0.5rem 1.1rem',
            fontSize: '0.6rem', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif",
            color: active === t.id ? '#fff' : '#4a4a5e',
            borderBottom: active === t.id ? '1px solid #c8102e' : '1px solid transparent',
            transition: 'color 0.2s',
          }}>{t.label}</a>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <a href="/login" className="vx-login-lnk" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#4a4a5e', textDecoration: 'none', fontFamily: "'Inter',sans-serif", transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#4a4a5e')}
        >LOGIN</a>
        {/* Hamburger */}
        <button className="vx-burger" onClick={() => setMenuOpen(m => !m)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 4, padding: 4 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 20, height: 1, background: menuOpen ? (i === 1 ? 'transparent' : '#c8102e') : '#aaa' }} />)}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, top: 64, background: 'rgba(2,2,13,0.98)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem' }}>
          {NAV_LINKS.map(t => (
            <a key={t.id} href={t.href} onClick={() => setMenuOpen(false)} style={{
              textDecoration: 'none',
              fontFamily: "'Bitter',Georgia,serif", fontSize: '1.8rem', fontWeight: 700,
              color: active === t.id ? '#fff' : '#333', letterSpacing: '0.05em',
            }}>{t.label}</a>
          ))}
        </div>
      )}
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────────────────────────────*/
function Section({ id, children }: { id: Tab; children: React.ReactNode }) {
  return (
    <section id={`vxs-${id}`} style={{ position: 'relative' }}>
      {children}
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   VIDEO LIGHTBOX
───────────────────────────────────────────────────────────────*/
function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 960, aspectRatio: '16/9', position: 'relative' }}>
        <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} allow="autoplay; encrypted-media" allowFullScreen />
        <button onClick={onClose} style={{ position: 'absolute', top: -36, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.6rem', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>ESC / CLOSE</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   HOME SECTION
───────────────────────────────────────────────────────────────*/
function HomeSection() {
  const [videoOk, setVideoOk] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const PITCH_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'

  return (
    <>
      {showStory && <VideoModal url={PITCH_URL} onClose={() => setShowStory(false)} />}
      <div style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* Video bg */}
        <video autoPlay muted loop playsInline onCanPlay={() => setVideoOk(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, opacity: videoOk ? 0.3 : 0, transition: 'opacity 2s ease' }}>
          <source src="/vaxon/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(2,2,13,0.5) 0%, rgba(2,2,13,0.15) 50%, rgba(2,2,13,0.85) 100%)' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem 5rem' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.32em', color: '#c8102e', fontFamily: "'Inter',sans-serif", marginBottom: '2rem' }}>
            VERY LOW EARTH ORBIT — 180–250KM ALTITUDE
          </div>

          <h1 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2.2rem,5.5vw,4.8rem)', fontWeight: 900, lineHeight: 1.05, color: '#fff', margin: '0 0 1.5rem', maxWidth: 860, letterSpacing: '-0.01em' }}>
            Real-Time Missile Defense<br />and Connectivity Today
          </h1>

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 'clamp(0.85rem,1.5vw,1.05rem)', color: '#6b7280', lineHeight: 1.75, maxWidth: 520, margin: '0 0 3rem', fontWeight: 300 }}>
            Vaxon Space operates air-breathing satellites at 180–250km — 10× closer than traditional LEO, delivering unprecedented resolution, latency, and persistence.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <a href="/technology" style={{ background: '#c8102e', color: '#fff', border: 'none', cursor: 'pointer', padding: '0.875rem 2.25rem', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", transition: 'background 0.2s', textDecoration: 'none', display: 'inline-block' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#a50d26')}
              onMouseLeave={e => (e.currentTarget.style.background = '#c8102e')}
            >EXPLORE TECHNOLOGY</a>
            <a href="https://calendly.com/vaxonspace" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', padding: '0.875rem 2.25rem', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", textDecoration: 'none', display: 'inline-flex', alignItems: 'center', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#c8102e')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
            >REQUEST A BRIEFING</a>
          </div>

          {/* Watch Our Story */}
          <button onClick={() => setShowStory(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '9px solid currentColor', marginLeft: 2 }} />
            </div>
            WATCH OUR STORY
          </button>
        </div>

        {/* Stats strip */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'rgba(2,2,13,0.85)', backdropFilter: 'blur(12px)', borderTop: '1px solid #131323' }}>
          {[
            { v: '180–250km', l: 'Orbital Altitude' },
            { v: '<15ms',     l: 'Signal Latency' },
            { v: '10×',      l: 'Closer Than LEO' },
            { v: '24/7',     l: 'Persistent Coverage' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '1.25rem 1rem', textAlign: 'center', borderRight: i < 3 ? '1px solid #131323' : 'none' }}>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.1rem,2.5vw,1.75rem)', fontWeight: 900, color: '#fff' }}>{s.v}</div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: '#4a4a5e', textTransform: 'uppercase', marginTop: '0.25rem', fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────────────────────────*/
export function AboutSection() {
  const { ref: statsRef, visible: statsVisible } = useReveal()
  const { ref: cardsRef, visible: cardsVisible } = useReveal()
  const { ref: barsRef, visible: barsVisible } = useReveal()

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2.5rem' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>ABOUT VAXON SPACE</div>
      <div style={{ width: 36, height: 1, background: '#1e1e30', marginBottom: '3.5rem' }} />

      {/* Globe + mission */}
      <div className="vx-about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
        {/* Left: hyper-realistic globe */}
        <div style={{ height: 460 }}>
          <Suspense fallback={
            <div style={{ height: '100%', background: '#050512', border: '1px solid #131323', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#333', fontFamily: "'Inter',sans-serif" }}>LOADING EARTH MODEL…</div>
            </div>
          }>
            <EarthGlobeV2 height={460} />
          </Suspense>
        </div>

        {/* Right: mission text */}
        <div>
          <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: '0 0 1.75rem' }}>
            The Physics Advantage in Low-Altitude Orbit
          </h2>
          <p style={{ color: '#6b7280', lineHeight: 1.85, fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
            Traditional LEO satellites orbit at 400–600km. Vaxon operates at 180–250km — the Very Low Earth Orbit. This is a physics-driven step-change in what satellites can see, hear, and respond to.
          </p>
          <p style={{ color: '#6b7280', lineHeight: 1.85, fontSize: '0.9rem', margin: '0 0 2.5rem' }}>
            Our Air-Breathing Electric Propulsion (ABEP) system harvests atmospheric molecules as propellant, enabling unlimited orbital endurance without carrying fuel — solving the fundamental challenge of sustained VLEO operations.
          </p>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: '#333', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8102e' }} />
            EST. 2021 — BOULDER, COLORADO
          </div>
        </div>
      </div>

      {/* Advantage cards — scroll reveal */}
      <div ref={cardsRef} style={{ borderTop: '1px solid #131323', paddingTop: '3.5rem', marginBottom: '4rem' }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.25em', color: '#333', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '2rem' }}>KEY ADVANTAGES</div>
        <div className="vx-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: '#131323' }}>
          {[
            { tag: 'IMAGERY', h: '<30cm Resolution', b: '5× sharper than standard LEO. Sub-decimeter imagery enabling target identification at orbital speed.' },
            { tag: 'LATENCY', h: '<15ms Signal', b: 'Near-ground-speed communications for real-time missile defense coordination and C2 networks.' },
            { tag: 'COVERAGE', h: 'Persistent ISR', b: 'Continuous surveillance of high-priority zones — not 4-hour revisit windows.' },
            { tag: 'PROPULSION', h: 'No Propellant Limit', b: 'ABEP harvests atmosphere as fuel. Unlimited mission duration with no propellant mass penalty.' },
          ].map((c, i) => (
            <div key={i} style={{
              background: '#02020d', padding: '2rem 1.5rem', transition: 'background 0.2s, opacity 0.6s, transform 0.6s',
              opacity: cardsVisible ? 1 : 0, transform: cardsVisible ? 'none' : 'translateY(20px)',
              transitionDelay: cardsVisible ? `${i * 0.1}s` : '0s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#090918')}
              onMouseLeave={e => (e.currentTarget.style.background = '#02020d')}
            >
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Inter',sans-serif", marginBottom: '0.6rem' }}>{c.tag}</div>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem', lineHeight: 1.3 }}>{c.h}</div>
              <div style={{ fontSize: '0.78rem', color: '#4a4a5e', lineHeight: 1.65 }}>{c.b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Altitude comparison — animated bars on scroll */}
      <div ref={barsRef} style={{ borderTop: '1px solid #131323', paddingTop: '3rem' }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.25em', color: '#333', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '2rem' }}>ALTITUDE COMPARISON</div>
        {[
          { l: 'GEO', km: '35,786 km', pct: 100, note: 'Weather / Comms', hi: false },
          { l: 'MEO', km: '8,000 km',  pct: 58,  note: 'GPS Constellation', hi: false },
          { l: 'LEO', km: '400–600 km', pct: 28, note: 'ISS / Starlink',   hi: false },
          { l: 'VLEO', km: '180–250 km', pct: 10, note: 'Vaxon Space ★',   hi: true },
        ].map((tier, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.1rem',
            opacity: barsVisible ? 1 : 0, transform: barsVisible ? 'none' : 'translateX(-12px)',
            transition: 'opacity 0.5s, transform 0.5s',
            transitionDelay: barsVisible ? `${i * 0.12}s` : '0s',
          }}>
            <div style={{ width: 48, fontSize: '0.58rem', letterSpacing: '0.12em', color: tier.hi ? '#fff' : '#4a4a5e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif" }}>{tier.l}</div>
            <div style={{ flex: 1, height: 2, background: '#131323', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: barsVisible ? `${tier.pct}%` : '0%',
                background: tier.hi ? '#c8102e' : '#1a1a2e',
                transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                transitionDelay: barsVisible ? `${i * 0.15 + 0.2}s` : '0s',
              }} />
            </div>
            <div style={{ width: 88, fontSize: '0.62rem', color: '#4a4a5e', fontFamily: "'Inter',sans-serif", textAlign: 'right' }}>{tier.km}</div>
            <div style={{ width: 130, fontSize: '0.6rem', color: tier.hi ? '#c8102e' : '#2a2a3e', fontFamily: "'Inter',sans-serif" }}>{tier.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   TECHNOLOGY SECTION
───────────────────────────────────────────────────────────────*/
export function TechnologySection() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [showFootprint, setShowFootprint] = useState(false)
  const { ref: techRef, visible: techVisible } = useReveal()
  const caps = [
    { tag: 'ISR', title: 'Persistent Surveillance', body: 'Continuous, wide-area intelligence, surveillance, and reconnaissance at sub-30cm resolution. Revisit any target within minutes, not hours. Ideal for border security, contested zone monitoring, and real-time battle-space awareness.' },
    { tag: 'DEFENSE', title: 'Missile Defense', body: 'Ultra-low latency tracking enables real-time missile detection and intercept coordination. Compatible with Golden Dome architecture. The critical edge for kinetic and non-kinetic intercept decisions at machine speed.' },
    { tag: 'CONNECTIVITY', title: 'High-Speed Data Links', body: 'Near-ground-speed communications for C2 networks, tactical data links, and forward-deployed assets in contested environments. Latency under 15ms enables true real-time coordination across distributed forces.' },
    { tag: 'RESILIENCE', title: 'Self-Cleaning Orbit', body: 'At 180–250km, orbital debris clears in weeks versus decades at LEO. Dramatically reducing long-term space traffic risk and providing a resilient, reconstitutable architecture for persistent national security missions.' },
    { tag: 'PROPULSION', title: 'ABEP Technology', body: 'Air-Breathing Electric Propulsion harvests atmospheric molecules as propellant, enabling indefinite orbital endurance without onboard fuel mass limits. DARPA-validated. Strategic partnership with Phase 2 ABEP engine supplier.' },
    { tag: 'AI SENSING', title: 'On-Orbit AI Processing', body: 'Edge AI inference hardware processes raw sensor data on-orbit, delivering actionable intelligence to operators in real time. Reduces downlink bandwidth requirements by 10× while enabling autonomous target cueing.' },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2.5rem' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>TECHNOLOGY</div>
      <div style={{ width: 36, height: 1, background: '#1e1e30', marginBottom: '3.5rem' }} />

      <div className="vx-tech-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Globe + satellite — sticky on scroll */}
        <div style={{ position: 'sticky', top: 80 }}>
          <Suspense fallback={
            <div style={{ height: 460, background: '#050512', border: '1px solid #131323', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: 160 - i*30, height: 6, background: '#111', borderRadius: 2, animation: 'vx-skel 1.5s ease infinite', animationDelay: `${i*0.2}s` }} />)}
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#2a2a3e', fontFamily: "'Inter',sans-serif", marginTop: '0.5rem' }}>LOADING ORBIT MODEL</div>
            </div>
          }>
            <EarthGlobeV2 height={460} showFootprint={showFootprint} />
          </Suspense>

          {/* Coverage footprint toggle */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: '#4a4a5e', fontFamily: "'Inter',sans-serif" }}>COVERAGE FOOTPRINT</span>
            <button onClick={() => setShowFootprint(f => !f)} style={{
              width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
              background: showFootprint ? '#c8102e' : '#131323',
              position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: 3, left: showFootprint ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s',
              }} />
            </button>
            <span style={{ fontSize: '0.52rem', letterSpacing: '0.12em', color: showFootprint ? '#c8102e' : '#333', fontFamily: "'Inter',sans-serif" }}>
              {showFootprint ? 'ON' : 'OFF'}
            </span>
          </div>
          <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#333', fontFamily: "'Inter',sans-serif" }}>
            VLEO coverage area vs ISS / Starlink orbits
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '0 0 2.5rem' }}>
            Six Mission-Critical Capabilities
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#0d0d1a' }}>
            {caps.map((cap, i) => (
              <div key={i} onClick={() => setExpanded(expanded === i ? null : i)}
                style={{ background: expanded === i ? '#090918' : '#02020d', cursor: 'pointer', padding: '1.25rem 1.5rem', borderLeft: `2px solid ${expanded === i ? '#c8102e' : 'transparent'}`, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.52rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Inter',sans-serif" }}>{cap.tag} / </span>
                    <span style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{cap.title}</span>
                  </div>
                  <span style={{ color: '#333', fontSize: '0.9rem', flexShrink: 0, marginLeft: '1rem' }}>{expanded === i ? '−' : '+'}</span>
                </div>
                {expanded === i && <p style={{ margin: '0.85rem 0 0', fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.75 }}>{cap.body}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   TEAM MODAL
───────────────────────────────────────────────────────────────*/
export function TeamModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#060614', border: '1px solid #1a1a2e', maxWidth: 620, width: '100%', padding: '2.5rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontSize: '0.58rem', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>ESC</button>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
          {member.image && (
            <div style={{ width: 84, height: 84, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid #1a1a2e', background: '#05050e' }}>
              <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Inter',sans-serif", marginBottom: '0.4rem' }}>
              {member.isAdvisor ? 'ADVISORY BOARD' : 'CORE LEADERSHIP'}
            </div>
            <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.3rem' }}>{member.name}</h3>
            <div style={{ fontSize: '0.75rem', color: '#4a4a5e', fontFamily: "'Inter',sans-serif" }}>{member.role}</div>
          </div>
        </div>

        {member.bio && <p style={{ color: '#8a8aaa', lineHeight: 1.85, fontSize: '0.875rem', margin: '0 0 1.75rem' }}>{member.bio}</p>}

        <div style={{ borderTop: '1px solid #131323', paddingTop: '1.5rem', marginBottom: member.linkedin ? '1.75rem' : 0 }}>
          {member.creds.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.65rem', alignItems: 'flex-start' }}>
              <div style={{ width: 4, height: 4, background: '#c8102e', borderRadius: '50%', marginTop: '0.45rem', flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>{c}</div>
            </div>
          ))}
        </div>

        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#4a4a5e', textDecoration: 'none', fontFamily: "'Inter',sans-serif", transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a4a5e')}
          >VIEW LINKEDIN PROFILE →</a>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   TEAM CARD
───────────────────────────────────────────────────────────────*/
export function TeamCard({ member, onClick }: { member: TeamMember; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? '#090918' : '#02020d', border: '1px solid ' + (hov ? '#1a1a2e' : '#0d0d1a'), cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s', textAlign: 'center', padding: '1.75rem 1.25rem 1.25rem' }}>
      {/* Circular photo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          overflow: 'hidden', flexShrink: 0,
          border: `2px solid ${hov ? '#c8102e' : '#1a1a2e'}`,
          transition: 'border-color 0.2s',
          background: '#05050e',
        }}>
          {member.image
            ? <img
                src={member.image}
                alt={member.name}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                  display: 'block',
                  transition: 'transform 0.4s, filter 0.3s',
                  transform: hov ? 'scale(1.06)' : 'scale(1)',
                  filter: hov ? 'none' : 'grayscale(15%)',
                }}
              />
            : <div style={{ width: '100%', height: '100%', background: '#111' }} />
          }
        </div>
      </div>
      <div style={{ fontSize: '0.55rem', letterSpacing: '0.18em', color: '#c8102e', marginBottom: '0.35rem', fontFamily: "'Inter',sans-serif" }}>{member.role}</div>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{member.name}</div>
      <div style={{ fontSize: '0.7rem', color: '#4a4a5e', lineHeight: 1.5, marginBottom: hov ? '0.5rem' : 0 }}>{member.creds[0]}</div>
      {hov && <div style={{ fontSize: '0.52rem', letterSpacing: '0.18em', color: '#c8102e', fontFamily: "'Inter',sans-serif", marginTop: '0.5rem' }}>VIEW BIO →</div>}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   TEAM SECTION
───────────────────────────────────────────────────────────────*/
export function TeamSection({ core, advisors }: { core: TeamMember[]; advisors: TeamMember[] }) {
  const [sel, setSel] = useState<TeamMember | null>(null)
  return (
    <>
      {sel && <TeamModal member={sel} onClose={() => setSel(null)} />}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2.5rem' }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>OUR TEAM</div>
        <div style={{ width: 36, height: 1, background: '#1e1e30', marginBottom: '1.5rem' }} />
        <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.75rem' }}>
          Built by the People Who've Done It
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', maxWidth: 520, margin: '0 0 3.5rem', lineHeight: 1.75 }}>
          Decades of experience from Lockheed Martin, the US Army, US Air Force, NRO, DARPA, and the world's leading aerospace research institutions.
        </p>

        <div style={{ fontSize: '0.56rem', letterSpacing: '0.22em', color: '#333', fontFamily: "'Inter',sans-serif", marginBottom: '1.25rem' }}>CORE LEADERSHIP</div>
        <div className="vx-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(196px,1fr))', gap: '1px', background: '#0d0d1a', marginBottom: '3.5rem' }}>
          {core.map((m, i) => (
            <div key={m.name} style={{
              opacity: 1, transform: 'none',
              animation: `vx-card-in 0.5s ease both`,
              animationDelay: `${i * 0.08}s`,
            }}>
              <TeamCard member={m} onClick={() => setSel(m)} />
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.56rem', letterSpacing: '0.22em', color: '#333', fontFamily: "'Inter',sans-serif", marginBottom: '1.25rem' }}>ADVISORY BOARD</div>
        <div className="vx-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(196px,1fr))', gap: '1px', background: '#0d0d1a', marginBottom: '1.5rem' }}>
          {advisors.map((m, i) => (
            <div key={m.name} style={{ animation: `vx-card-in 0.5s ease both`, animationDelay: `${i * 0.1 + 0.3}s` }}>
              <TeamCard member={m} onClick={() => setSel(m)} />
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', color: '#222', fontFamily: "'Inter',sans-serif", textAlign: 'center' }}>CLICK ANY CARD TO VIEW FULL BIO</div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   NEWS SECTION
───────────────────────────────────────────────────────────────*/
export function NewsSection({ news }: { news: NewsItem[] }) {
  const featured = news[0]
  const rest = news.slice(1)
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2.5rem' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>NEWS & PRESS</div>
      <div style={{ width: 36, height: 1, background: '#1e1e30', marginBottom: '3.5rem' }} />

      {/* Featured */}
      {featured && (
        <a href={featured.link || '#'} target={featured.link ? '_blank' : undefined} rel="noopener noreferrer"
          onClick={!featured.link ? e => e.preventDefault() : undefined}
          style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}
        >
          <div className="vx-feat" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #131323', overflow: 'hidden', background: '#060614', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#1a1a2e')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#131323')}
          >
            <div style={{ overflow: 'hidden', background: '#050512', maxHeight: 320 }}>
              {featured.image
                ? <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                : <div style={{ width: '100%', height: '100%', minHeight: 280, background: 'linear-gradient(135deg,#090918,#050512)' }} />
              }
            </div>
            <div style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.52rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Inter',sans-serif" }}>FEATURED</span>
                <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: '#333', fontFamily: "'Inter',sans-serif" }}>{featured.date}</span>
                <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: '#2a2a3e', fontFamily: "'Inter',sans-serif" }}>{featured.source}</span>
              </div>
              <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: '0 0 1.25rem' }}>{featured.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.85, fontSize: '0.875rem', margin: '0 0 1.5rem' }}>{featured.body}</p>
              {featured.link && <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#4a4a5e', fontFamily: "'Inter',sans-serif" }}>READ MORE →</span>}
            </div>
          </div>
        </a>
      )}

      {/* Grid */}
      <div className="vx-news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '2px', background: '#0d0d1a' }}>
        {rest.map((n, i) => (
          <a key={i} href={n.link || '#'} target={n.link ? '_blank' : undefined} rel="noopener noreferrer"
            onClick={!n.link ? e => e.preventDefault() : undefined}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{ background: '#02020d', height: '100%', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#090918')}
              onMouseLeave={e => (e.currentTarget.style.background = '#02020d')}
            >
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#050512' }}>
                {n.image
                  ? <img src={n.image} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#090918,#050512)' }} />
                }
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: '#333', fontFamily: "'Inter',sans-serif" }}>{n.date}</span>
                  <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: '#222', fontFamily: "'Inter',sans-serif" }}>{n.source}</span>
                </div>
                <h4 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.35, margin: '0 0 0.85rem' }}>{n.title}</h4>
                <p style={{ color: '#4a4a5e', lineHeight: 1.75, fontSize: '0.78rem', margin: '0 0 1rem' }}>{n.body}</p>
                {n.link && <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: '#333', fontFamily: "'Inter',sans-serif" }}>READ MORE →</div>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────────────────────────*/
export function ContactSection() {
  const [f, setF] = useState({ name: '', email: '', org: '', msg: '' })
  const [sent, setSent] = useState(false)

  const iStyle: React.CSSProperties = { width: '100%', background: '#060614', border: '1px solid #1a1a2e', color: '#fff', padding: '0.875rem 1rem', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif", outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2.5rem' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>CONTACT</div>
      <div style={{ width: 36, height: 1, background: '#1e1e30', marginBottom: '3.5rem' }} />

      <div className="vx-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: '#fff', margin: '0 0 1.5rem', lineHeight: 1.2 }}>
            Partner With Vaxon Space
          </h2>
          <p style={{ color: '#6b7280', lineHeight: 1.85, fontSize: '0.9rem', marginBottom: '3rem' }}>
            Defense contractors, investors, and commercial partners may submit inquiries below. All communications are handled with appropriate discretion.
          </p>
          {[
            { l: 'GENERAL INQUIRIES', v: 'contact@vaxonspace.com' },
            { l: 'BRIEFING REQUESTS', v: 'calendly.com/vaxonspace' },
            { l: 'LOCATION', v: 'Boulder, Colorado' },
          ].map((item, i) => (
            <div key={i} style={{ borderTop: '1px solid #131323', padding: '1.25rem 0' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: '#333', fontFamily: "'Inter',sans-serif", marginBottom: '0.35rem' }}>{item.l}</div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontFamily: "'Inter',sans-serif" }}>{item.v}</div>
            </div>
          ))}
        </div>

        <div>
          {sent ? (
            <div style={{ border: '1px solid #1a1a2e', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.25em', color: '#c8102e', marginBottom: '1rem', fontFamily: "'Inter',sans-serif" }}>MESSAGE RECEIVED</div>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>We'll be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#131323' }}>
              <input type="text" placeholder="Full Name" required value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={iStyle} />
              <input type="email" placeholder="Email Address" required value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} style={iStyle} />
              <input type="text" placeholder="Organization" value={f.org} onChange={e => setF(p => ({ ...p, org: e.target.value }))} style={iStyle} />
              <textarea placeholder="Message" rows={5} required value={f.msg} onChange={e => setF(p => ({ ...p, msg: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} />
              <button type="submit" style={{ background: '#c8102e', color: '#fff', border: 'none', cursor: 'pointer', padding: '1rem', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#a50d26')}
                onMouseLeave={e => (e.currentTarget.style.background = '#c8102e')}
              >SEND MESSAGE</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   LOGOS SECTION
───────────────────────────────────────────────────────────────*/
export function LogosSection() {
  const orgs = [
    { src: '/vaxon/logos/nro.svg', alt: 'NRO' },
    { src: '/vaxon/logos/army.svg', alt: 'US Army' },
    { src: '/vaxon/logos/disa.svg', alt: 'DISA' },
    { src: '/vaxon/logos/naval-research-lab.png', alt: 'Naval Research Lab' },
    { src: '/vaxon/logos/naval-war-college.svg', alt: 'Naval War College' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Lockheed_Martin_logo.svg/600px-Lockheed_Martin_logo.svg.png', alt: 'Lockheed Martin' },
  ]
  const unis = [
    { src: '/vaxon/logos/michigan.svg', alt: 'University of Michigan' },
    { src: '/vaxon/logos/cu-boulder.svg', alt: 'CU Boulder' },
    { src: '/vaxon/logos/ut-austin.png', alt: 'UT Austin' },
    { src: '/vaxon/logos/west-point.svg', alt: 'West Point' },
    { src: '/vaxon/logos/unc.svg', alt: 'UNC Chapel Hill' },
    { src: '/vaxon/logos/bates.svg', alt: 'Bates College' },
  ]

  const Logo = ({ src, alt }: { src: string; alt: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', opacity: 0.7, transition: 'opacity 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
    >
      <img src={src} alt={alt} style={{ maxWidth: 100, maxHeight: 60, width: 'auto', height: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
    </div>
  )

  return (
    <div style={{ borderTop: '1px solid #131323', padding: '3rem 2.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ fontSize: '0.55rem', letterSpacing: '0.28em', color: '#333', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", textAlign: 'center', marginBottom: '2rem' }}>
        OUR TEAM HAS WORKED AT
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', marginBottom: '1.5rem', borderTop: '1px solid #0d0d1a', borderLeft: '1px solid #0d0d1a' }}>
        {orgs.map(o => <div key={o.alt} style={{ borderRight: '1px solid #0d0d1a', borderBottom: '1px solid #0d0d1a' }}><Logo {...o} /></div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', borderTop: '1px solid #0d0d1a', borderLeft: '1px solid #0d0d1a' }}>
        {unis.map(u => <div key={u.alt} style={{ borderRight: '1px solid #0d0d1a', borderBottom: '1px solid #0d0d1a' }}><Logo {...u} /></div>)}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────*/
export const VX_GLOBAL_STYLE = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #02020d; color: #fff; overflow-x: hidden; font-family: 'Inter', sans-serif; }
  html { scroll-behavior: smooth; }
  @keyframes vx-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes vx-dot { 0%,100%{opacity:.2} 50%{opacity:1} }
  @keyframes vx-skel { 0%,100%{opacity:.25} 50%{opacity:.55} }
  @keyframes vx-card-in { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
  @keyframes vx-slide-left { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:none; } }
  @media (max-width: 768px) {
    .vx-nav-tabs { display: none !important; }
    .vx-login-lnk { display: none !important; }
    .vx-burger { display: flex !important; }
    .vx-about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
    .vx-4col { grid-template-columns: 1fr 1fr !important; }
    .vx-tech-grid { grid-template-columns: 1fr !important; }
    .vx-team-grid { grid-template-columns: repeat(2,1fr) !important; }
    .vx-contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
    .vx-feat { grid-template-columns: 1fr !important; }
    .vx-news-grid { grid-template-columns: 1fr !important; }
  }
`

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────*/
export default function VaxonPage() {
  const [active, setActive] = useState<Tab>('home')
  const [loaded, setLoaded] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [cmsNews, setCmsNews] = useState<NewsItem[] | null>(null)
  const [cmsCoreTeam, setCmsCoreTeam] = useState<TeamMember[] | null>(null)
  const [cmsAdvisors, setCmsAdvisors] = useState<TeamMember[] | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400)
    return () => clearTimeout(t)
  }, [])

  // Scroll-based section tracking + progress bar
  useEffect(() => {
    const ids: Tab[] = ['home', 'about', 'technology', 'team', 'news', 'contact']
    const fn = () => {
      const sy = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(max > 0 ? (sy / max) * 100 : 0)

      for (const id of [...ids].reverse()) {
        const el = document.getElementById('vxs-' + id)
        if (el && sy >= el.offsetTop - 120) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Hash scroll on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Tab
    const valid: Tab[] = ['home', 'about', 'technology', 'team', 'news', 'contact']
    if (valid.includes(hash)) {
      const el = document.getElementById('vxs-' + hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200)
    }
  }, [])

  // CMS data
  useEffect(() => {
    fetch('/api/cms').then(r => r.json()).then(d => {
      if (d.news?.length) setCmsNews(d.news)
      if (d.team?.length) {
        setCmsCoreTeam(d.team.filter((m: TeamMember) => !m.isAdvisor))
        setCmsAdvisors(d.team.filter((m: TeamMember) => m.isAdvisor))
      }
    }).catch(() => {})
  }, [])

  const news     = cmsNews ?? NEWS
  const core     = cmsCoreTeam ?? CORE_TEAM
  const advisors = cmsAdvisors ?? ADVISORS

  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>

      <LoadingScreen done={loaded} />
      <StarField />

      {/* Scroll progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9998, height: 2, width: `${scrollPct}%`, background: '#c8102e', transition: 'width 0.1s linear', pointerEvents: 'none' }} />

      <Nav active={active} />

      {/* pt-16 to clear fixed nav */}
      <div style={{ paddingTop: 64 }}>
        <Section id="home">
          <HomeSection />
        </Section>

        <Section id="about">
          <AboutSection />
          <LogosSection />
        </Section>

        <Section id="technology">
          <TechnologySection />
        </Section>

        <Section id="team">
          <TeamSection core={core} advisors={advisors} />
        </Section>

        <Section id="news">
          <NewsSection news={news} />
        </Section>

        <Section id="contact">
          <ContactSection />
        </Section>
      </div>

      <Suspense fallback={null}>
        <VaxonWidget />
      </Suspense>
    </>
  )
}
