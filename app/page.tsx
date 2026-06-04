'use client'
import { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react'

const EarthGlobeV2     = lazy(() => import('@/components/EarthGlobeV2'))

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
type Tab = 'home' | 'about' | 'technology' | 'team' | 'news' | 'contact' | 'vleo'

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
    creds: ['21+ years in satellite design and advanced systems', 'Sr. R+D Program Manager, Lockheed Martin -$30M budget', 'Advisor: Space Force, NASA, DoD, University of Michigan', 'Author: Vanquishing Cancer'],
  },
  {
    name: 'Dr. Charles Lipscomb', role: 'Co-Founder & Chief Scientist',
    image: '/vaxon/team-lipscomb.png',
    linkedin: 'https://www.linkedin.com/in/charleslipscomb88',
    bio: 'Dr. Lipscomb is the technical architect of Vaxon\'s air-breathing propulsion system. His doctoral research at CU Boulder in plasmadynamics and electric propulsion and work on the COSMO satellite program provide the scientific foundation for sustained VLEO operations.',
    creds: ['PhD Aerospace Engineering, University of Colorado Boulder', 'Satellite Systems Engineer on COSMO', 'Specialist in electric propulsion integration', 'Air-breathing propulsion and plasmadynamics modeling'],
  },
  {
    name: 'Brandon Williamson', role: 'Co-Founder & Head of Engineering',
    image: '/vaxon/team-williamson.jpg',
    linkedin: 'https://www.linkedin.com/in/brandon-williamson-83b0191ba/',
    bio: 'Brandon leads Vaxon\'s engineering team, overseeing all aspects of system design, analysis, testing, and integration. His plasma research background from the University of Michigan makes him uniquely qualified to advance VLEO satellite hardware.',
    creds: ['Aerospace engineering and plasma research background', 'University of Michigan aerospace training', 'Design, analysis, testing and system integration for VLEO'],
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
  {
    name: 'Lt. Col. Anand Shah', role: 'Advisory Board',
    image: '/vaxon/team-shah.jpg',
    linkedin: 'https://www.linkedin.com/in/ananddineshshah/',
    bio: 'A retired USAF Program Manager with deep experience in military satellite systems, Lt. Col. Shah guided major SATCOM and AEHF programs and served as Chief of Flight Sciences and Payload Analysis at the NRO.',
    creds: ['Retired USAF Program Manager', 'Deputy PM for SATCOM and AEHF', 'Chief of Flight Sciences and Payload Analysis at NRO'],
    isAdvisor: true,
  },
  {
    name: 'Dr. Iain Boyd', role: 'Advisory Board',
    image: '/vaxon/team-boyd.png',
    linkedin: 'https://www.linkedin.com/in/iain-boyd/',
    bio: 'With 30+ years in hypersonics and space plasma physics and 200+ peer-reviewed publications, Dr. Boyd directs the Center for National Security Initiatives at CU Boulder and is among the world\'s foremost VLEO propulsion experts.',
    creds: ['30+ years in hypersonics and space plasma physics', 'Professor, Aerospace Engineering Sciences, CU Boulder', 'Director, Center for National Security Initiatives', '200+ peer-reviewed publications'],
    isAdvisor: true,
  },
]

const WSIMG = 'https://img1.wsimg.com/isteam/ip/b6d77e34-40ce-4ade-86a8-3e868f7bc80c'

export const NEWS: NewsItem[] = [
  {
    date: 'MAY 20 2026', title: 'ASCEND 2026 Panel Explores Next-Generation Operations in VLEO',
    body: 'Dr. Steven P. Shepard participated in the ASCEND 2026 panel "Racing to vLEO: Next-Generation Operations in Very Low Earth Orbit," joining Brian Cameron of The Aerospace Corporation, Dr. Gillian Bussey of the US Space Force, and Spence Wise of Redwire. The discussion covered recent technological advancements, military and commercial applications, and where the VLEO ecosystem is headed over the coming decade.',
    source: 'LINKEDIN / AIAA',
    link: 'https://www.linkedin.com/posts/stevenpshepard_aiaaascend26-vleo-spacetech-activity-7463033959719788544-W-uy',
    image: '/vaxon/ascend-2026.jpg',
  },
  {
    date: 'MAY 13 2026', title: 'Bay Area Space Ecosystem Map Highlights Regional Growth',
    body: "A new Bay Area Space Ecosystem map highlights the region's growing concentration of space startups, suppliers, investors, and research organizations. Vaxon Space is included among the companies contributing to this expanding ecosystem, reflecting continued momentum around next-generation satellite architectures, VLEO platforms, defense applications, connectivity, and commercial space infrastructure.",
    source: 'LINKEDIN / ADAM BARTON',
    link: 'https://www.linkedin.com/feed/update/urn:li:activity:7458376693133553664/',
    image: '/vaxon/bay-area-space-map.jpg',
  },
  {
    date: 'APR 23 2026', title: 'UNIVITY Raises €27M for VLEO 5G Connectivity',
    body: 'Paris-based UNIVITY secured Series A funding to advance VLEO 5G demonstration and commercial deployment by 2028, signaling strong investor confidence in the VLEO connectivity market that Vaxon is positioned to lead in the US defense and commercial sectors.',
    source: 'EU STARTUPS',
    image: `${WSIMG}/UNIVITY.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:800,cg:true`,
  },
  {
    date: 'MAR 16 2026', title: 'EDA Commits $17.9M to VLEO Military Research',
    body: 'The European Defence Agency launches a major initiative exploring VLEO for enhanced ISR and new mission architectures, validating the strategic importance of sub-200km satellite operations for modern defense applications worldwide.',
    source: 'VIA SATELLITE',
    image: `${WSIMG}/EDA-image.webp/:/cr=t:0%25,l:21.88%25,w:56.25%25,h:100%25/rs=w:800,h:400,cg:true`,
  },
  {
    date: 'FEB 05 2026', title: 'Vaxon Joins Starburst / IAI Cohort 4',
    body: 'Selected for the IAI Catalyst cohort focused on autonomous systems, advanced sensing, AI computing, and VLEO satellites. Vaxon joins a prestigious group of defense-focused startups advancing next-generation space capabilities for US and allied forces.',
    source: 'LINKEDIN',
    link: 'https://www.linkedin.com/company/vaxon-space',
    image: `${WSIMG}/IAI_Kickoff.jpg/:/cr=t:0%25,l:10.87%25,w:56.25%25,h:100%25/rs=w:800,h:400,cg:true`,
  },
  {
    date: 'JAN 14 2026', title: 'AIAA SciTech 2026 VLEO Panel',
    body: 'Dr. Shepard spoke on ABEP, emerging VLEO use cases, and growing alignment across academia, industry, and government. The panel highlighted the maturation of VLEO technology and its increasing relevance for both defense and commercial applications.',
    source: 'LINKEDIN',
    image: `${WSIMG}/AIAA%20ASCEND%202026.jpg/:/cr=t:0%25,l:12.07%25,w:75%25,h:100%25/rs=w:800,h:400,cg:true`,
  },
  {
    date: 'NOV 19 2025', title: 'Redwire Awarded $44M DARPA ABEP Contract',
    body: 'Redwire receives Phase 2 DARPA contract for air-breathing satellite development, validating ABEP as a defense priority. This contract confirms the maturation of air-breathing electric propulsion technology that forms the technical foundation of Vaxon\'s propulsion system.',
    source: 'SPACENEWS',
    link: 'https://spacenews.com',
    image: `${WSIMG}/Redwire.webp/:/cr=t:0%25,l:18.97%25,w:62.05%25,h:100%25/rs=w:800,h:400,cg:true`,
  },
  {
    date: 'FEB 25 2026', title: "Why This Space Startup Flies Where Other Satellites Can't Survive",
    body: 'Vaxon Space CEO Dr. Steven P. Shepard has a conversation with Aidan Daoussis of Balerion Space Ventures, discussing the momentum behind very low Earth orbit (VLEO) satellites and the mission use cases being built at Vaxon Space. The discussion includes why VLEO is becoming such an important domain for the next generation of space infrastructure, including opportunities for enhanced ISR, missile defense sensing and new AI-enabled space capabilities.',
    source: 'BALERION SPACE VENTURES',
    link: 'https://www.youtube.com/watch?v=piWj3lWfUEM',
    image: '/vaxon/vaxonspacesatelitessurvive.jpg',
  },
  {
    date: 'SEP 2025', title: 'Spanish Startup Wins $9M for VLEO Satellite Tech',
    body: 'Kreios Space raises funding to develop VLEO satellite technology, joining a growing global ecosystem of companies validating the commercial and defense case for sub-250km orbital operations.',
    source: 'TECH CRUNCH',
    image: `${WSIMG}/satellite_kreios.jpg/:/cr=t:0%25,l:8.47%25,w:64.97%25,h:100%25/rs=w:800,h:400,cg:true`,
  },
  {
    date: 'AUG 2025', title: 'DeepSat Secures USAF $1.25M SBIR for VLEO Constellation',
    body: 'DeepSat wins US Air Force Small Business Innovation Research contract to develop a VLEO constellation architecture, further confirming DoD interest in persistent low-altitude space-based intelligence assets.',
    source: 'DEFENSE NEWS',
    image: `${WSIMG}/Deepsat.jpg/:/cr=t:0%25,l:15.71%25,w:68.58%25,h:100%25/rs=w:800,h:400,cg:true`,
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
   NAV -links to dedicated pages
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
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 80,
      display: 'flex', alignItems: 'center', padding: '0 2.5rem',
      background: dark ? 'rgba(2,2,13,0.96)' : 'rgba(2,2,13,0.6)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${dark ? '#131323' : 'transparent'}`,
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {/* Logo → home */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 60, width: 'auto' }} />
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
        {/* Hamburger */}
        <button className="vx-burger" onClick={() => setMenuOpen(m => !m)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 4, padding: 4 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 20, height: 1, background: menuOpen ? (i === 1 ? 'transparent' : '#c8102e') : '#aaa' }} />)}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, top: 80, background: 'rgba(2,2,13,0.98)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem' }}>
          {NAV_LINKS.map(t => (
            <a key={t.id} href={t.href} onClick={() => setMenuOpen(false)} style={{
              textDecoration: 'none',
              fontFamily: "'Bitter',Georgia,serif", fontSize: '1.8rem', fontWeight: 400,
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const PITCH_URL = 'https://www.youtube.com/embed/piWj3lWfUEM?autoplay=1&rel=0'

  // Ensure autoplay fires even if browser delays it
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [])

  return (
    <>
      {showStory && <VideoModal url={PITCH_URL} onClose={() => setShowStory(false)} />}
      <div style={{ position: 'relative', height: 'calc(100vh - 80px)', overflow: 'hidden', background: '#02020d' }}>

        {/* ── Cinematic background video ── */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          onCanPlay={() => setVideoOk(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            zIndex: 1,
            opacity: videoOk ? 0.82 : 0,
            transition: 'opacity 2.4s cubic-bezier(0.4,0,0.2,1)',
            willChange: 'opacity',
          }}
        >
          <source src="/vaxon/hero-video.mp4" type="video/mp4" />
        </video>

        {/* ── Cinematic overlays ── */}
        {/* Top vignette -keeps nav readable */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(2,2,13,0.72) 0%, rgba(2,2,13,0.08) 28%, rgba(2,2,13,0.0) 52%, rgba(2,2,13,0.55) 78%, rgba(2,2,13,0.96) 100%)' }} />
        {/* Side vignettes -pull focus to center */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 100% at 50% 50%, transparent 50%, rgba(2,2,13,0.55) 100%)' }} />
        {/* Very subtle dark fade at bottom for stat strip transition */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%', zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(2,2,13,0.85) 0%, transparent 100%)' }} />

        {/* Hero headline - top left */}
        <div style={{
          position: 'absolute', top: '1.75rem', left: '2.5rem', zIndex: 4,
          fontSize: 'clamp(1.4rem,2.8vw,2.8rem)', color: '#fff',
          fontFamily: "'Bitter',Georgia,serif", fontWeight: 400,
          lineHeight: 1.15, maxWidth: 640,
          opacity: videoOk ? 1 : 0,
          transition: 'opacity 1s ease 0.6s',
        }}>
          Real-time missile defense and connectivity today — and AI tomorrow
        </div>

        {/* ── (hero text removed -video shown clean) ── */}
        <div style={{ display: 'none' }}>

          <h1 style={{
            fontFamily: "'Bitter',Georgia,serif",
            fontSize: 'clamp(2.4rem,5.8vw,5.2rem)',
            fontWeight: 400, lineHeight: 1.04, color: '#fff',
            margin: '0 0 1.5rem', maxWidth: 900, letterSpacing: '-0.02em',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
            opacity: videoOk ? 1 : 0, transform: videoOk ? 'none' : 'translateY(12px)',
            transition: 'opacity 1s ease 0.8s, transform 1s ease 0.8s',
          }}>
            Real-Time Missile Defense<br />and Connectivity Today
          </h1>

          <p style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: 'clamp(0.85rem,1.5vw,1.05rem)',
            color: 'rgba(255,255,255,0.62)', lineHeight: 1.8,
            maxWidth: 520, margin: '0 0 3rem', fontWeight: 300,
            textShadow: '0 1px 12px rgba(0,0,0,0.8)',
            opacity: videoOk ? 1 : 0, transform: videoOk ? 'none' : 'translateY(8px)',
            transition: 'opacity 1s ease 1s, transform 1s ease 1s',
          }}>
            Vaxon Space operates air-breathing satellites at 180–250km -10× closer than traditional LEO,
            delivering unprecedented resolution, latency, and persistence.
          </p>

          <div style={{
            display: 'flex', gap: '0.875rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem',
            opacity: videoOk ? 1 : 0, transform: videoOk ? 'none' : 'translateY(8px)',
            transition: 'opacity 1s ease 1.2s, transform 1s ease 1.2s',
          }}>
            <a href="/technology" style={{
              background: '#c8102e', color: '#fff', border: 'none', cursor: 'pointer',
              padding: '0.9rem 2.5rem', fontSize: '0.62rem', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif",
              textDecoration: 'none', display: 'inline-block',
              boxShadow: '0 0 32px rgba(200,16,46,0.35)',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background='#a50d26'; (e.currentTarget as HTMLAnchorElement).style.boxShadow='0 0 48px rgba(200,16,46,0.5)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background='#c8102e'; (e.currentTarget as HTMLAnchorElement).style.boxShadow='0 0 32px rgba(200,16,46,0.35)' }}
            >EXPLORE TECHNOLOGY</a>
            <a href="https://calendly.com/stevenpshepard-vaxonspace/30-1" target="_blank" rel="noopener noreferrer" style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)',
              color: '#fff', border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer',
              padding: '0.9rem 2.5rem', fontSize: '0.62rem', fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif",
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor='#c8102e'; (e.currentTarget as HTMLAnchorElement).style.background='rgba(200,16,46,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(255,255,255,0.22)'; (e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,0.06)' }}
            >REQUEST A BRIEFING</a>
          </div>

          {/* Watch Our Story -now opens Dr. Shepard interview */}
          <button onClick={() => setShowStory(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter',sans-serif",
            fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            transition: 'color 0.2s',
            opacity: videoOk ? 1 : 0, transition2: 'opacity 1s ease 1.4s',
          } as React.CSSProperties}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.28)',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style={{ marginLeft: 2 }}>
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            WATCH CEO INTERVIEW
          </button>
        </div>

      </div>
    </>
  )
}

function TypeOut({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    let i = 0
    const t = setTimeout(() => {
      const id = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(id)
      }, 60)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [text, delay])
  return <>{displayed || ' '}</>
}

function StatsStrip() {
  const { ref, visible } = useReveal()
  return (
    <>
      <div ref={ref} className="vx-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'rgba(2,2,13,0.72)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { v: '180-250km', l: 'Orbital Altitude',    d: 0   },
          { v: '<15ms',     l: 'Signal Latency',       d: 200 },
          { v: '10x',       l: 'Closer Than LEO',      d: 400 },
          { v: '24/7',      l: 'Persistent Coverage',  d: 600 },
        ].map((s, i) => (
          <div key={i} style={{ padding: '1.5rem 1rem', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.1rem,2.5vw,1.75rem)', fontWeight: 400, color: '#fff', minHeight: '2rem' }}>
              {visible ? <TypeOut text={s.v} delay={s.d} /> : ' '}
            </div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginTop: '0.25rem', fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* Hero subtext + CTA */}
      <div style={{ background: '#02020d', padding: '3rem 2.5rem', textAlign: 'center', borderBottom: '1px solid #131323' }}>
        <p style={{
          fontFamily: "'Inter',sans-serif", fontSize: 'clamp(0.9rem,1.5vw,1.1rem)',
          color: 'rgba(255,255,255,0.65)', lineHeight: 1.8,
          maxWidth: 580, margin: '0 auto 2rem', fontWeight: 300,
        }}>
          Vaxon Space operates air-breathing satellites at 180-250km, 10x closer than traditional LEO,
          delivering unprecedented resolution, latency, and persistence.
        </p>
        <a href="/technology"
          style={{
            display: 'inline-block',
            background: 'transparent', color: '#fff', border: '1px solid #c8102e',
            padding: '0.85rem 2.5rem', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif",
            textDecoration: 'none', transition: 'background 0.2s',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = '#c8102e')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.background = 'transparent')}
        >EXPLORE TECHNOLOGY</a>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   ALTITUDE BARS -standalone component with reliable animation
───────────────────────────────────────────────────────────────*/
const TIERS = [
  { l: 'GEO',  km: '35,786 km',  pct: 100, note: 'Weather / Comms',    hi: false },
  { l: 'MEO',  km: '8,000 km',   pct: 68,  note: 'GPS Constellation',  hi: false },
  { l: 'LEO',  km: '400–600 km', pct: 38,  note: 'ISS / Starlink',     hi: false },
  { l: 'VLEO', km: '180–250 km', pct: 10,  note: 'Vaxon Space ★',      hi: true  },
]

function AltitudeBars() {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect()
        // Double rAF: guarantees 0% state is painted before transition fires
        requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)))
      }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ borderTop: '1px solid #131323', paddingTop: '3rem' }}>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.2rem,2vw,1.6rem)', fontWeight: 400, color: '#fff', marginBottom: '2.5rem' }}>
        ALTITUDE COMPARISON
      </div>
      {TIERS.map((tier, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem',
          opacity: animated ? 1 : 0,
          transform: animated ? 'none' : 'translateX(-10px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
          transitionDelay: `${i * 0.1}s`,
        }}>
          <div style={{ width: 56, fontSize: '0.85rem', letterSpacing: '0.08em', color: tier.hi ? '#fff' : 'rgba(255,255,255,0.45)', textTransform: 'uppercase', fontFamily: "'Bitter',Georgia,serif", fontWeight: tier.hi ? 700 : 400, flexShrink: 0 }}>
            {tier.l}
          </div>
          <div style={{ flex: 1, height: tier.hi ? 14 : 10, background: '#0d0d1a', position: 'relative', borderRadius: 3 }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 3,
              width: animated ? `${tier.pct}%` : '0%',
              background: tier.hi ? '#c8102e' : '#1e2040',
              transition: 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: `${i * 0.12 + 0.1}s`,
              boxShadow: tier.hi ? '0 0 12px rgba(200,16,46,0.5)' : 'none',
            }} />
          </div>
          <div style={{ width: 110, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter',sans-serif", textAlign: 'right', flexShrink: 0 }}>{tier.km}</div>
          <div style={{ width: 160, fontSize: '0.78rem', color: tier.hi ? '#c8102e' : 'rgba(255,255,255,0.3)', fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>{tier.note}</div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────────────────────────*/
const MISSION_PROFILES = [
  {
    title: 'Remote Sensing',
    image: '/vaxon/mission-remote-sensing.jpg',
    body: 'Operating 3x closer to the surface in very low Earth orbit (VLEO) with altitudes of 180-250 km, Vaxon satellites revolutionize space-based imaging and intelligence. VLEO operation enables image resolutions under 30 cm with revisit times of 1-2 hours, serving the US government and its allies to ensure leaders and soldiers have the pivotal information they need to make vital decisions. We also provide information to the commercial market, providing agriculture, energy, infrastructure, forestry and mapping services.',
  },
  {
    title: 'Missile Defense',
    image: '/vaxon/mission-missile-defense.jpg',
    body: "Golden Dome is the DoD's next big challenge and Vaxon Space is ready to partner. Our satellites enable more precise navigation for hypersonic and intercept missiles by decreasing latency. Faster response for hypersonic tracking is paramount and enabled by Vaxon's patented air-breathing electric propulsion subsystem. Precise navigation also extends to our commercial customers, such as maritime tracking and traffic route optimization.",
  },
  {
    title: 'Connectivity',
    image: '/vaxon/mission-connectivity.jpg',
    body: 'Vaxon Space is a bus provider for satellite partners looking to bring connectivity to another level. With advancements in AI and data transmission exponentially increasing, satellites operating in VLEO provide best-in-class performance. As Internet providers increase their footprint in space, we will be right there with them to revolutionize information dissemination. Lower latency also enhances financial trading, remote surgery, directed energy weapons and military communications.',
  },
  {
    title: 'Space Resiliency',
    image: '/vaxon/mission-resiliency.jpg',
    body: 'Satellites in low Earth orbit (LEO) are susceptible to orbital debris, e.g. by anti-satellite attacks or careless operations. Operating in VLEO has the advantage of being "self-cleaning" where debris falls down into Earth\'s atmosphere within a few weeks versus decades or years for LEO satellites. Vaxon satellites, as well as partnering companies using Vaxon buses for payload operations, will have this survivability advantage over traditional satellites as we create the next generation of proliferated satellites.',
  },
]

const BREAKTHROUGH_ITEMS = [
  { h: 'Sharper Imagery, Under 30 cm Resolution', b: 'Operating three times closer to Earth delivers up to twice the imaging precision. Our proprietary Air Intake System (Vaxon Space IP) achieves this without the need for heavier optical systems.' },
  { h: 'Ultra-Low Latency, Under 15 ms', b: "A five-times shorter signal path means near-real-time performance that's unattainable at higher altitudes." },
  { h: 'Self-Cleaning Orbit', b: 'Natural atmospheric drag continuously clears debris, keeping the orbit safe and sustainable in weeks instead of years.' },
  { h: 'The ABEP Advantage', b: 'Traditional satellites cannot operate between 150 and 250 km due to extreme atmospheric drag that would quickly deorbit them. ABEP transforms this challenge into an advantage, using the atmosphere itself as fuel, turning a former enemy into an ally.' },
]

export function AboutSection() {
  const [showFootprint, setShowFootprint] = useState(false)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2.5rem' }}>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.5rem' }}>About Vaxon Space</div>
      <div style={{ width: 48, height: 2, background: '#c8102e', marginBottom: '3.5rem' }} />

      {/* Globe + mission */}
      <div className="vx-about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
        {/* Left: hyper-realistic globe + coverage footprint toggle */}
        <div>
          <div style={{ height: 460 }}>
            <Suspense fallback={
              <div style={{ height: '100%', background: '#050512', border: '1px solid #131323', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#333', fontFamily: "'Inter',sans-serif" }}>LOADING EARTH MODEL…</div>
              </div>
            }>
              <EarthGlobeV2 height={460} showFootprint={showFootprint} />
            </Suspense>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#888', fontFamily: "'Inter',sans-serif" }}>COVERAGE FOOTPRINT</span>
            <button onClick={() => setShowFootprint(f => !f)} style={{
              width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
              background: showFootprint ? '#c8102e' : '#131323', position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{ position: 'absolute', top: 3, left: showFootprint ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </button>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: showFootprint ? '#c8102e' : '#555', fontFamily: "'Inter',sans-serif" }}>{showFootprint ? 'ON' : 'OFF'}</span>
          </div>
        </div>

        {/* Right: mission text */}
        <div>
          <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, margin: '0 0 1.75rem' }}>
            Vaxon Space operates where no other satellite can survive.
          </h2>
          <p style={{ fontFamily: "'Bitter',Georgia,serif", color: '#fff', lineHeight: 1.85, fontSize: '1rem', fontWeight: 400, margin: '0 0 1.5rem' }}>
            Operating at 180-250km, 10x closer than traditional LEO, Vaxon's air-breathing satellites deliver sub-30cm imagery, under-15ms latency, and persistent coverage for defense and commercial customers.
          </p>
          <p style={{ fontFamily: "'Bitter',Georgia,serif", color: '#fff', lineHeight: 1.85, fontSize: '1rem', fontWeight: 400, margin: 0 }}>
            Our Air-Breathing Electric Propulsion system harvests atmospheric molecules as propellant, enabling unlimited mission duration with no propellant mass penalty.
          </p>
        </div>
      </div>

      {/* ── MISSION PROFILES ── */}
      <div style={{ borderTop: '1px solid #131323', paddingTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '3.5rem' }}>Mission Profiles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {MISSION_PROFILES.map((m, i) => (
            <div key={m.title} className="vx-about-grid vx-mission-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
              <div className="vx-mission-img" style={{ order: i % 2 === 0 ? 0 : 1, overflow: 'hidden', border: '1px solid #1a1a2e', background: '#050512', aspectRatio: '16/10' }}>
                <img src={m.image} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="vx-mission-txt" style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.4rem,2.4vw,2rem)', fontWeight: 400, color: '#fff', margin: '0 0 1rem' }}>{m.title}</h3>
                <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, fontSize: '0.95rem', fontWeight: 400, margin: 0 }}>{m.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BREAKTHROUGH TECHNOLOGY ── */}
      <div style={{ borderTop: '1px solid #131323', paddingTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>Breakthrough Technology</div>
        <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, fontSize: '1rem', fontWeight: 400, maxWidth: 760, margin: '0 0 3rem' }}>
          Air-breathing electric propulsion (ABEP) harnesses atmospheric molecules as propellant, enabling continuous operation in ultra-low Earth orbits where conventional satellites cannot survive.
        </p>
        <div className="vx-about-grid" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(235,240,248,0.96)', borderRadius: 8, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/vaxon/mission-orbit-diagram.png" alt="VLEO orbit profile" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {BREAKTHROUGH_ITEMS.map(item => (
              <div key={item.h}>
                <h4 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.15rem', fontWeight: 400, color: '#fff', margin: '0 0 0.4rem' }}>{item.h}</h4>
                <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '0.9rem', fontWeight: 400, margin: 0 }}>{item.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Altitude comparison -animated bars on scroll */}
      <AltitudeBars />

      {/* ── COMPETITIVE COMPARISON ── */}
      <div style={{ borderTop: '1px solid #131323', paddingTop: '4rem', marginTop: '4rem' }}>
        <div style={{ fontSize: '1.05rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.5rem' }}>COMPETITIVE LANDSCAPE</div>
        <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#fff', margin: '0 0 0.75rem' }}>How Vaxon Compares</h3>
        <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: 560, margin: '0 0 2.5rem', lineHeight: 1.75 }}>
          Technical comparison across altitude, resolution, latency, revisit time, and mission life.
        </p>
        <div className="vx-table-wrap" style={{ overflowX: 'auto', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
          <table className="vx-cmp-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#06060f', borderBottom: '1px solid #1a1a2e' }}>
                {['PLATFORM', 'ALTITUDE', 'RESOLUTION', 'LATENCY', 'REVISIT', 'PROPULSION LIFE'].map((h, i) => (
                  <th key={h} style={{ padding: '0.85rem 1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '0.7rem', letterSpacing: '0.14em', color: i === 0 ? '#c8102e' : '#fff', textTransform: 'uppercase', textAlign: 'left', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Vaxon Space', alt: '180–250 km', res: '<30 cm', lat: '<15 ms', rev: '<2 hr', prop: 'Unlimited (ABEP)', vaxon: true },
                { name: 'Company A', alt: '475–525 km', res: '50 cm–3 m', lat: '~65 ms', rev: '4–12 hr', prop: '3–5 yr (propellant)', vaxon: false },
                { name: 'Company B', alt: '420–450 km', res: '50 cm', lat: '~60 ms', rev: '~1–4 hr', prop: '3–5 yr (propellant)', vaxon: false },
                { name: 'Company C', alt: '530–570 km', res: 'N/A (comms)', lat: '20–40 ms', rev: 'Continuous (comms)', prop: '5 yr (propellant)', vaxon: false },
                { name: 'Company D', alt: '617 km', res: '31 cm', lat: '~82 ms', rev: '<1 hr (single sat)', prop: '10+ yr (GEO-class)', vaxon: false },
              ].map((r, i) => (
                <tr key={r.name} style={{ background: r.vaxon ? 'rgba(200,16,46,0.06)' : (i % 2 === 0 ? '#02020d' : '#030312'), borderBottom: '1px solid #0d0d1a' }}>
                  <td style={{ padding: '1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', fontWeight: 400, color: '#fff', borderLeft: r.vaxon ? '2px solid #c8102e' : '2px solid transparent' }}>{r.name}</td>
                  <td style={{ padding: '1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: r.vaxon ? '#c8102e' : '#fff' }}>{r.alt}</td>
                  <td style={{ padding: '1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: r.vaxon ? '#c8102e' : '#fff' }}>{r.res}</td>
                  <td style={{ padding: '1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: r.vaxon ? '#c8102e' : '#fff' }}>{r.lat}</td>
                  <td style={{ padding: '1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: r.vaxon ? '#c8102e' : '#fff' }}>{r.rev}</td>
                  <td style={{ padding: '1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: r.vaxon ? '#c8102e' : '#fff' }}>{r.prop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <div style={{ fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>TECHNOLOGY</div>
      <div style={{ width: 36, height: 1, background: '#1e1e30', marginBottom: '3.5rem' }} />

      <div className="vx-tech-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Globe + satellite -sticky on scroll */}
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, margin: '0 0 2.5rem' }}>
            Six Mission-Critical Capabilities
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#0d0d1a' }}>
            {caps.map((cap, i) => (
              <div key={i} onClick={() => setExpanded(expanded === i ? null : i)}
                style={{ background: expanded === i ? '#090918' : '#02020d', cursor: 'pointer', padding: '1.25rem 1.5rem', borderLeft: `2px solid ${expanded === i ? '#c8102e' : 'transparent'}`, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.05rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Inter',sans-serif" }}>{cap.tag} / </span>
                    <span style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.9rem', fontWeight: 400, color: '#fff' }}>{cap.title}</span>
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
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Stagger: backdrop first, then slide card in
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => { cancelAnimationFrame(t); document.removeEventListener('keydown', fn) }
  }, [onClose])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      background: visible ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0)',
      backdropFilter: visible ? 'blur(14px)' : 'blur(0px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      transition: 'background 0.35s ease, backdrop-filter 0.35s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#060614', border: '1px solid #1a1a2e',
        maxWidth: 640, width: '100%', padding: '2.5rem', position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
        transition: 'opacity 0.4s cubic-bezier(0.22,1,0.36,1) 0.05s, transform 0.4s cubic-bezier(0.22,1,0.36,1) 0.05s',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontSize: '0.58rem', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>ESC</button>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
          {member.image && (() => {
            const k = Object.keys(HEADSHOT_CROP).find(kk => member.name.includes(kk))
            const cr = k ? HEADSHOT_CROP[k] : { scale: 1, pos: 'center top', tx: '0%' }
            return (
              <div style={{ width: 130, height: 130, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #1a1a2e', background: '#05050e' }}>
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: cr.pos, transform: `scale(${cr.scale}) translateX(${cr.tx})`, display: 'block' }} />
              </div>
            )
          })()}
          <div>
            <div style={{ fontSize: '1.1rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Inter',sans-serif", marginBottom: '0.4rem' }}>
              {member.isAdvisor ? 'ADVISORY BOARD' : 'CORE LEADERSHIP'}
            </div>
            <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.5rem', fontWeight: 400, color: '#fff', margin: '0 0 0.3rem' }}>{member.name}</h3>
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
// Per-headshot crop params (analyzed against the Shepard baseline) so every
// face is centered and fills the circle consistently.
const HEADSHOT_CROP: Record<string, { scale: number; pos: string; tx: string }> = {
  'Shepard':    { scale: 1.45, pos: '50% 28%', tx: '7%' },
  'Lipscomb':   { scale: 1.15, pos: '50% 22%', tx: '0%' },
  'Williamson': { scale: 1.45, pos: '50% 24%', tx: '3%' },
  'Anderson':   { scale: 1.0,  pos: '50% 30%', tx: '0%' },
  // Pedreiro & Shah reverted to the original default (no zoom) — their heads were getting cut off.
  'Pedreiro':   { scale: 1.0,  pos: 'center top', tx: '0%' },
  'Shah':       { scale: 1.0,  pos: 'center top', tx: '0%' },
  'Boyd':       { scale: 1.05, pos: '50% 30%', tx: '0%' },
}

export function TeamCard({ member, onClick }: { member: TeamMember; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  // Per-headshot crop so every face matches the Shepard baseline framing in the circle.
  const key = Object.keys(HEADSHOT_CROP).find(k => member.name.includes(k))
  const crop = key ? HEADSHOT_CROP[key] : { scale: 1, pos: 'center top', tx: '0%' }
  const imgPosition = crop.pos
  const baseTransform = `scale(${crop.scale}) translateX(${crop.tx})`
  const hovTransform = `scale(${(crop.scale + 0.1).toFixed(2)}) translateX(${crop.tx})`
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'transparent',
        cursor: 'pointer', overflow: 'hidden',
        transition: 'transform 0.3s',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        textAlign: 'center', padding: '2.25rem 1.5rem 1.75rem',
        height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
      {/* Circular photo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          width: 190, height: 190, borderRadius: '50%',
          overflow: 'hidden', flexShrink: 0,
          border: `2px solid ${hov ? '#c8102e' : '#1a1a2e'}`,
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: hov ? '0 0 24px rgba(200,16,46,0.25)' : 'none',
          background: '#05050e',
        }}>
          {member.image
            ? <img
                src={member.image}
                alt={member.name}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: imgPosition,
                  display: 'block',
                  transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                  transform: hov ? hovTransform : baseTransform,
                }}
              />
            : <div style={{ width: '100%', height: '100%', background: '#111' }} />
          }
        </div>
      </div>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 400, fontSize: '1.4rem', letterSpacing: '0.1em', color: '#c8102e', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{member.role}</div>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.7rem', fontWeight: 400, color: '#fff', marginBottom: '0.6rem', lineHeight: 1.2 }}>{member.name}</div>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, flexGrow: 1, fontWeight: 400 }}>{member.creds[0]}</div>
      <div style={{
        fontSize: '0.8rem', letterSpacing: '0.18em',
        color: hov ? '#c8102e' : '#fff',
        fontFamily: "'Inter',sans-serif", marginTop: '1rem',
        transition: 'color 0.3s',
      }}>VIEW FULL BIO →</div>
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
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.5rem' }}>Our Team</div>
          <div style={{ width: 48, height: 2, background: '#c8102e', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, color: '#fff', margin: '0 0 0.75rem' }}>
            Built by the People Who've Done It
          </h2>
          <p style={{ color: '#fff', fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1rem,1.5vw,1.15rem)', maxWidth: 640, margin: '0 auto', lineHeight: 1.75, fontWeight: 400 }}>
            Decades of experience from Lockheed Martin, the US Army, US Air Force, NRO, DARPA, and the world's leading aerospace research institutions.
          </p>
        </div>

        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400, color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>Core Leadership</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '0', marginBottom: '4rem' }}>
          {core.map((m, i) => (
            <div key={m.name} style={{ animation: `vx-card-in 0.6s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 0.1}s`, display: 'flex', width: 280, flexShrink: 0 }}>
              <TeamCard member={m} onClick={() => setSel(m)} />
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400, color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>Advisory Board</div>
        <div style={{ display: 'flex', flexWrap: 'nowrap' as const, gap: '0', marginBottom: '1.5rem', justifyContent: 'center' }}>
          {advisors.map((m, i) => (
            <div key={m.name} style={{ animation: `vx-card-in 0.6s cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${i * 0.1 + 0.2}s`, display: 'flex', width: 260, flexShrink: 0 }}>
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
   VIDEO EMBED (click-to-play YouTube thumbnail)
───────────────────────────────────────────────────────────────*/
function VideoEmbed({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false)
  if (playing) {
    return (
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }}
          title="Dr. Steven Shepard – Vaxon Space VLEO Interview" />
      </div>
    )
  }
  return (
    <div onClick={() => setPlaying(true)} style={{ position: 'relative', cursor: 'pointer', width: '100%', aspectRatio: '16/9', background: '#02020d', overflow: 'hidden' }}>
      <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="Dr. Shepard VLEO Interview"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.72)' }}
        onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,2,13,0.7) 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(2,2,13,0.85)', border: '2px solid rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
        >
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28" style={{ marginLeft: 4 }}>
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', marginBottom: 4, fontFamily: "'Bitter',Georgia,serif", fontWeight: 400 }}>FEATURED INTERVIEW</div>
        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.05rem', fontWeight: 400, color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
          Dr. Steven Shepard - VLEO Mission + Strategy
        </div>
      </div>
    </div>
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
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.5rem' }}>News &amp; Press</div>
      <div style={{ width: 48, height: 2, background: '#c8102e', marginBottom: '3.5rem' }} />

      {/* Dr. Shepard interview video -pinned above featured card */}
      <div style={{ border: '1px solid #131323', marginBottom: '2px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="vx-feat">
        <div style={{ padding: '2.5rem', borderRight: '1px solid #131323', background: '#060614', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.2rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Bitter',Georgia,serif", fontWeight: 400, marginBottom: '0.75rem' }}>FEATURED INTERVIEW / FEB 2026</div>
          <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.5rem', fontWeight: 400, color: '#fff', lineHeight: 1.25, margin: '0 0 1rem' }}>
            CEO Dr. Steven Shepard on VLEO Momentum
          </h3>
          <p style={{ color: '#fff', fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', lineHeight: 1.8, margin: '0 0 1.5rem', fontWeight: 400 }}>
            Dr. Shepard discusses VLEO mission use cases including ISR, missile defense sensing, Golden Dome potential, and AI-enabled space capabilities - the full strategic picture for Vaxon Space.
          </p>
          <a href="https://www.youtube.com/watch?v=piWj3lWfUEM" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#fff', textDecoration: 'none', fontFamily: "'Bitter',Georgia,serif", fontWeight: 400, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c8102e')}
            onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
          >WATCH FULL INTERVIEW →</a>
        </div>
        <div style={{ background: '#02020d', overflow: 'hidden' }}>
          <VideoEmbed videoId="piWj3lWfUEM" />
        </div>
      </div>

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
            <div style={{ overflow: 'hidden', background: '#050512', aspectRatio: '1/1' }}>
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
                <span style={{ fontSize: '1.2rem', letterSpacing: '0.22em', color: '#c8102e', fontFamily: "'Bitter',Georgia,serif", fontWeight: 400 }}>FEATURED</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: '#fff', fontFamily: "'Bitter',Georgia,serif" }}>{featured.date}</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: '#fff', fontFamily: "'Bitter',Georgia,serif" }}>{featured.source}</span>
              </div>
              <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.65rem', fontWeight: 400, color: '#fff', lineHeight: 1.25, margin: '0 0 1.25rem' }}>{featured.title}</h3>
              <p style={{ color: '#fff', fontFamily: "'Bitter',Georgia,serif", lineHeight: 1.85, fontSize: '1rem', margin: '0 0 1.5rem', fontWeight: 400 }}>{featured.body}</p>
              {featured.link && <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#fff', fontFamily: "'Bitter',Georgia,serif", fontWeight: 400 }}>READ MORE →</span>}
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
              <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: '#050512' }}>
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
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#fff', fontFamily: "'Bitter',Georgia,serif" }}>{n.date}</span>
                  <span style={{ fontSize: '1.2rem', letterSpacing: '0.15em', color: '#c8102e', fontFamily: "'Bitter',Georgia,serif", fontWeight: 400 }}>{n.source}</span>
                </div>
                <h4 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.2rem', fontWeight: 400, color: '#fff', lineHeight: 1.35, margin: '0 0 0.85rem' }}>{n.title}</h4>
                <p style={{ color: '#fff', fontFamily: "'Bitter',Georgia,serif", lineHeight: 1.75, fontSize: '0.92rem', margin: '0 0 1rem', fontWeight: 400 }}>{n.body}</p>
                {n.link && <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#fff', fontFamily: "'Bitter',Georgia,serif", fontWeight: 400 }}>READ MORE →</div>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   CALENDLY SCRIPT LOADER
───────────────────────────────────────────────────────────────*/
function CalendlyScript() {
  useEffect(() => {
    if (document.querySelector('script[src*="calendly"]')) return
    const s = document.createElement('script')
    s.src = 'https://assets.calendly.com/assets/external/widget.js'
    s.async = true
    document.head.appendChild(s)
  }, [])
  return null
}

/* ─────────────────────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────────────────────────*/
export function ContactSection() {
  const [f, setF] = useState({ name: '', email: '', org: '', msg: '' })
  const [sent, setSent] = useState(false)

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1a1a2e', color: '#fff', padding: '0.875rem 1rem', fontSize: '0.85rem', fontFamily: "'Inter',sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }

  return (
    <div>
      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, #0a0005 0%, #02020d 40%, #0d0208 100%)', borderBottom: '1px solid #131323', padding: '5rem 2.5rem 4rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>CONTACT</div>
          <div style={{ width: 36, height: 1, background: '#c8102e', marginBottom: '2.5rem', opacity: 0.4 }} />
          <div className="vx-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
            {/* Left: info */}
            <div>
              <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 400, color: '#fff', margin: '0 0 1.25rem', lineHeight: 1.1 }}>
                Partner With<br />Vaxon Space
              </h2>
              <p style={{ color: '#6b7280', lineHeight: 1.9, fontSize: '0.9rem', margin: '0 0 2.5rem', maxWidth: 420 }}>
                Defense contractors, investors, and commercial partners may submit inquiries below. All communications are handled with appropriate discretion.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { l: 'BRIEFING REQUESTS', v: 'Schedule via Calendly ↓', href: '#calendly' },
                  { l: 'LOCATION', v: 'San Jose, California', href: null },
                ].map((item, i) => (
                  <div key={i} style={{ borderTop: '1px solid #131323', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ fontSize: '0.52rem', letterSpacing: '0.22em', color: '#444', fontFamily: "'Inter',sans-serif" }}>{item.l}</div>
                    {item.href
                      ? <a href={item.href} style={{ fontSize: '0.88rem', color: '#fff', fontFamily: "'Inter',sans-serif", textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#c8102e')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                        >{item.v}</a>
                      : <div style={{ fontSize: '0.88rem', color: '#fff', fontFamily: "'Inter',sans-serif" }}>{item.v}</div>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Right: contact form */}
            <div>
              {sent ? (
                <div style={{ border: '1px solid #1a1a2e', padding: '3rem', textAlign: 'center', background: 'rgba(200,16,46,0.04)' }}>
                  <div style={{ fontSize: '1.15rem', letterSpacing: '0.25em', color: '#c8102e', marginBottom: '1rem', fontFamily: "'Inter',sans-serif" }}>MESSAGE RECEIVED</div>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>We'll be in touch within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={e => {
                  e.preventDefault()
                  const subject = encodeURIComponent(`Vaxon Space inquiry from ${f.name || 'website'}`)
                  const bodyLines = [
                    `Name: ${f.name}`,
                    `Email: ${f.email}`,
                    `Organization: ${f.org}`,
                    '',
                    f.msg,
                  ].join('\n')
                  window.location.href = `mailto:StevenPShepard@vaxonspace.com?subject=${subject}&body=${encodeURIComponent(bodyLines)}`
                  setSent(true)
                }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1.1rem', letterSpacing: '0.2em', color: '#c8102e', fontFamily: "'Inter',sans-serif", marginBottom: '0.25rem' }}>SEND AN INQUIRY</div>
                  <input type="text" placeholder="Full Name" required value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={inp}
                    onFocus={e => (e.currentTarget.style.borderColor = '#c8102e')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1a1a2e')}
                  />
                  <input type="email" placeholder="Email Address" required value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} style={inp}
                    onFocus={e => (e.currentTarget.style.borderColor = '#c8102e')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1a1a2e')}
                  />
                  <input type="text" placeholder="Organization" value={f.org} onChange={e => setF(p => ({ ...p, org: e.target.value }))} style={inp}
                    onFocus={e => (e.currentTarget.style.borderColor = '#c8102e')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1a1a2e')}
                  />
                  <textarea placeholder="Message" rows={4} required value={f.msg} onChange={e => setF(p => ({ ...p, msg: e.target.value }))}
                    style={{ ...inp, resize: 'vertical' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#c8102e')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1a1a2e')}
                  />
                  <button type="submit" style={{ background: '#c8102e', color: '#fff', border: 'none', cursor: 'pointer', padding: '0.9rem 1rem', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", transition: 'background 0.2s', marginTop: '0.25rem' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#a50d26')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#c8102e')}
                  >SEND MESSAGE</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendly embed */}
      <div id="calendly" style={{ background: '#02020d', borderTop: '1px solid #131323' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.75rem' }}>SCHEDULE A BRIEFING</div>
            <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#fff', margin: '0 0 0.5rem' }}>
              Book a Meeting with Vaxon Space
            </h3>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#444', fontFamily: "'Inter',sans-serif" }}>
              30 MIN · VIRTUAL · DR. STEVEN SHEPARD, CEO
            </div>
          </div>
          <div style={{ border: '1px solid #1a1a2e', overflow: 'hidden', background: '#02020d', borderRadius: 2 }}>
            <div className="calendly-inline-widget"
              data-url="https://calendly.com/stevenpshepard-vaxonspace/30-1?background_color=02020d&text_color=ffffff&primary_color=c8102e&hide_gdpr_banner=1"
              style={{ minWidth: 320, height: 780 }} />
            <CalendlyScript />
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#333', fontFamily: "'Inter',sans-serif", textAlign: 'center' }}>
            Powered by Calendly · All meetings handled with appropriate discretion
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   LOGOS SECTION
───────────────────────────────────────────────────────────────*/
export function LogosSection() {
  const all = [
    { src: '/vaxon/logos/nro-color.png',                alt: 'NRO' },
    { src: '/vaxon/logos/army-mark.png',                alt: 'US Army' },
    { src: '/vaxon/logos/disa.svg',                     alt: 'DISA' },
    { src: '/vaxon/logos/space-force.png',              alt: 'Space Force' },
    { src: '/vaxon/logos/naval-research-lab.png',       alt: 'Naval Research Lab' },
    { src: '/vaxon/logos/naval-war-college-color.webp', alt: 'Naval War College' },
    { src: '/vaxon/logos/nasa.svg',                      alt: 'NASA' },
    { src: '/vaxon/logos/dod.svg',                      alt: 'Dept of Defense' },
    { src: '/vaxon/lockheed-martin.jpg',                  alt: 'Lockheed Martin' },
    { src: '/vaxon/logos/michigan-seal.png',            alt: 'University of Michigan' },
    { src: '/vaxon/logos/cu-boulder.svg',               alt: 'CU Boulder' },
    { src: '/vaxon/logos/ut-austin.png',                alt: 'UT Austin' },
    { src: '/vaxon/logos/west-point-logo.png',          alt: 'West Point' },
    { src: '/vaxon/logos/unc.svg',                      alt: 'UNC Chapel Hill' },
    { src: '/vaxon/logos/stanford.svg',                 alt: 'Stanford' },
    { src: '/vaxon/logos/cornell-seal.png',             alt: 'Cornell' },
    { src: '/vaxon/logos/bates.svg',                    alt: 'Bates College' },
  ]

  const Logo = ({ src, alt }: { src: string; alt: string }) => {
    const [hov, setHov] = useState(false)
    const baseFilter = 'none'
    const hovFilter = 'drop-shadow(0 0 12px rgba(200,16,46,0.5))'
    // Lockheed file is a blue disc on a white JPEG square — clip to a circle to hide the white corners.
    const isLockheed = alt === 'Lockheed Martin'
    return (
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '1.8rem 1rem', gap: '0.75rem',
          background: 'transparent',
          transition: 'background 0.3s',
          cursor: 'default',
        }}
      >
        <img
          src={src} alt={alt}
          style={{
            width: 100, height: 100,
            objectFit: 'contain',
            borderRadius: isLockheed ? '50%' : 0,
            opacity: hov ? 1 : 0.85,
            transform: hov ? 'scale(1.2)' : 'scale(1)',
            filter: hov ? hovFilter : baseFilter,
            transition: 'opacity 0.3s, transform 0.4s cubic-bezier(0.22,1,0.36,1), filter 0.3s',
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div style={{
          fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: hov ? '#fff' : 'rgba(255,255,255,0.5)',
          fontFamily: "'Inter',sans-serif", textAlign: 'center', lineHeight: 1.4,
          transition: 'color 0.3s',
        }}>{alt}</div>
      </div>
    )
  }

  return (
    <div style={{ borderTop: '1px solid #131323', padding: '4rem 2.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: '#fff', textAlign: 'center', marginBottom: '3rem' }}>
        Our Team Has Worked At
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {all.map(o => (
          <div key={o.alt}>
            <Logo {...o} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────*/
export const VX_GLOBAL_STYLE = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: #02020d; color: #fff; overflow-x: hidden; font-family: 'Bitter', Georgia, serif; }
  /* Force Bitter across the entire site */
  body, body * { font-family: 'Bitter', Georgia, serif !important; }
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
    .vx-about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .vx-4col { grid-template-columns: 1fr !important; }
    .vx-tech-grid { grid-template-columns: 1fr !important; }
    .vx-team-grid { grid-template-columns: repeat(2,1fr) !important; }
    .vx-contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
    .vx-feat { grid-template-columns: 1fr !important; }
    .vx-news-grid { grid-template-columns: 1fr !important; }
    /* Stats strip: 2x2 instead of a cramped single row */
    .vx-stats { grid-template-columns: 1fr 1fr !important; }
    /* Mission Profiles: image always stacks above the text */
    .vx-mission-img { order: 0 !important; }
    .vx-mission-txt { order: 1 !important; }
    /* Comparison table: tighter cells, contained horizontal scroll with a hint */
    .vx-cmp-table { min-width: 560px !important; }
    .vx-cmp-table th, .vx-cmp-table td { padding: 0.65rem 0.7rem !important; font-size: 0.82rem !important; }
    .vx-table-wrap { border: 1px solid #131323; border-radius: 4px; }
  }
  @media (max-width: 480px) {
    .vx-team-grid { grid-template-columns: 1fr !important; }
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
      <div style={{ paddingTop: 80 }}>
        <Section id="home">
          <HomeSection />
        </Section>

        <StatsStrip />

        <Section id="about">
          <AboutSection />
          <LogosSection />
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

        <Footer />
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   FOOTER — mailing address (consistent across all pages)
───────────────────────────────────────────────────────────────*/
export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #131323', background: '#02020d', padding: '3rem 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 44, width: 'auto' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: '#fff', marginBottom: '0.35rem' }}>Vaxon Space, Inc.</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            2066 N Capitol Ave #5009<br />
            San Jose, CA 95132
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid #0d0d1a', fontFamily: "'Inter',sans-serif", fontSize: '0.62rem', letterSpacing: '0.12em', color: '#444', textTransform: 'uppercase' }}>
        © {2026} Vaxon Space, Inc. · All rights reserved.
      </div>
    </footer>
  )
}
