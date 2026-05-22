import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investors | Vaxon Space',
  description: 'Partner with Vaxon Space — the VLEO satellite company delivering real-time defense-grade ISR and connectivity from 180-250 km altitude.',
}

const METRICS = [
  { label: 'Altitude Advantage',  value: '180–250',  unit: 'km VLEO orbit' },
  { label: 'Imaging Resolution',  value: '<30',       unit: 'cm target' },
  { label: 'Signal Latency',      value: '<15',       unit: 'ms round-trip' },
  { label: 'Market Opportunity',  value: '$40B+',     unit: 'addressable by 2030' },
]

const ADVANTAGES = [
  { title: 'No Propellant Limits', body: 'Air-Breathing Electric Propulsion (ABEP) harvests atmospheric molecules as fuel, eliminating the propellant constraint that grounds conventional satellites.' },
  { title: 'Defense-Grade ISR',    body: 'Sub-30cm resolution imagery from VLEO altitude outperforms LEO competitors on physics alone — closer orbit means sharper images and lower latency.' },
  { title: 'Proven Leadership',    body: 'Our team brings decades of experience from Lockheed Martin, NRO, US Army, DoD, Space Force, and top-tier research universities.' },
  { title: 'Dual-Use Architecture', body: 'The same VLEO platform serves both defense ISR and commercial connectivity markets, maximizing revenue per satellite.' },
]

const TEAM_HIGHLIGHTS = [
  { name: 'Dr. Steven Shepard', role: 'CEO', bg: 'Sr. R&D Program Manager, Lockheed Martin — $30M budget. Advisor to Space Force, NASA, and DoD.' },
  { name: 'Dr. Timothy Lipscomb', role: 'COO', bg: 'Chief of Flight Sciences and Payload Analysis, NRO. 28+ years in national security space.' },
  { name: 'Donivan Williamson', role: 'VP Engineering', bg: 'Retired Deputy Chief of Staff, US Army. Senior systems architect for large-scale defense programs.' },
]

export default function InvestorsPage() {
  const font = `font-family: 'Inter', sans-serif`
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif",
      minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #000 !important; margin: 0; }
        ::selection { background: #c8102e; color: #fff; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #c8102e; }
        @media (max-width: 767px) {
          .inv-two-col { grid-template-columns: 1fr !important; }
          .inv-four-col { grid-template-columns: repeat(2,1fr) !important; }
          .inv-pad { padding: 4rem 1.5rem !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 64, background: 'rgba(0,0,0,0.92)',
        borderBottom: '1px solid #111', backdropFilter: 'blur(16px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 32, width: 'auto' }} />
        </a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: '#777',
            textDecoration: 'none', textTransform: 'uppercase' }}>Back to Site</a>
          <a href="/#contact" style={{
            background: '#c8102e', color: '#fff', padding: '0.5rem 1.25rem',
            fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', textDecoration: 'none',
          }}>Contact IR</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: '2.5rem', paddingRight: '2.5rem',
        borderBottom: '1px solid #0d0d0d' }} className="inv-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.24em', color: '#c8102e',
            textTransform: 'uppercase', marginBottom: '1.5rem' }}>INVESTOR RELATIONS</div>
          <h1 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 'clamp(2.2rem,5vw,4.5rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 2rem', maxWidth: 800 }}>
            The Physics Advantage in Defense Space
          </h1>
          <p style={{ color: '#888', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 620, marginBottom: '3rem' }}>
            Vaxon Space operates air-breathing satellites at 180–250 km VLEO altitude — a regime where
            physics, not engineering trade-offs, delivers superior ISR, lower latency, and persistent
            coverage for defense and commercial customers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/#contact" style={{
              background: '#fff', color: '#000', padding: '0.85rem 2.25rem',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block',
            }}>REQUEST INVESTOR DECK</a>
            <a href="https://calendly.com/vaxonspace" target="_blank" rel="noopener noreferrer" style={{
              background: 'transparent', color: '#fff', border: '1px solid #333',
              padding: '0.85rem 2.25rem', fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block',
            }}>SCHEDULE A CALL</a>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section style={{ borderBottom: '1px solid #0d0d0d' }}>
        <div className="inv-four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1px', background: '#0d0d0d', maxWidth: '100%' }}>
          {METRICS.map(m => (
            <div key={m.label} style={{ background: '#000', padding: '3rem 2.5rem' }}>
              <div style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 'clamp(2rem,3vw,3rem)',
                fontWeight: 900, marginBottom: '0.5rem' }}>{m.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#c8102e', marginBottom: '0.4rem' }}>{m.unit}</div>
              <div style={{ fontSize: '0.62rem', color: '#555', letterSpacing: '0.12em',
                textTransform: 'uppercase' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitive advantages */}
      <section style={{ padding: '6rem 2.5rem', borderBottom: '1px solid #0d0d0d' }} className="inv-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#555',
            textTransform: 'uppercase', marginBottom: '0.75rem' }}>WHY VAXON</div>
          <h2 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)',
            fontWeight: 900, margin: '0 0 3rem', letterSpacing: '-0.01em' }}>Structural Advantages</h2>
          <div className="inv-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#0d0d0d' }}>
            {ADVANTAGES.map(a => (
              <div key={a.title} style={{ background: '#000', padding: '2.5rem' }}>
                <div style={{ fontFamily: "'Bitter', Georgia, serif", fontWeight: 700,
                  fontSize: '1.1rem', marginBottom: '0.75rem' }}>{a.title}</div>
                <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ padding: '6rem 2.5rem', borderBottom: '1px solid #0d0d0d', background: '#020202' }} className="inv-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#555',
            textTransform: 'uppercase', marginBottom: '0.75rem' }}>TEAM</div>
          <h2 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)',
            fontWeight: 900, margin: '0 0 3rem', letterSpacing: '-0.01em' }}>Leadership</h2>
          <div className="inv-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: '#0d0d0d' }}>
            {TEAM_HIGHLIGHTS.map(t => (
              <div key={t.name} style={{ background: '#020202', padding: '2.5rem' }}>
                <div style={{ fontFamily: "'Bitter', Georgia, serif", fontWeight: 700,
                  fontSize: '1rem', marginBottom: '0.3rem' }}>{t.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#c8102e', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: '1rem' }}>{t.role}</div>
                <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.75, margin: 0 }}>{t.bg}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traction / milestones */}
      <section style={{ padding: '6rem 2.5rem', borderBottom: '1px solid #0d0d0d' }} className="inv-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#555',
            textTransform: 'uppercase', marginBottom: '0.75rem' }}>TRACTION</div>
          <h2 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)',
            fontWeight: 900, margin: '0 0 3rem', letterSpacing: '-0.01em' }}>Key Milestones</h2>
          {[
            { date: '2024', event: 'Company founded by Dr. Steven Shepard and core leadership team' },
            { date: 'Q1 2025', event: 'ABEP propulsion concept validated through computational modeling' },
            { date: 'Q2 2025', event: 'Strategic advisory board assembled — DoD, NRO, and Lockheed Martin veterans' },
            { date: 'Q3 2025', event: 'Satellite architecture finalized; payload specifications locked' },
            { date: '2026', event: 'Seed funding round in progress — targeting first orbital demonstration' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '2rem', padding: '1.25rem 0',
              borderBottom: '1px solid #0d0d0d', alignItems: 'flex-start' }}>
              <div style={{ minWidth: 80, fontSize: '0.7rem', color: '#c8102e',
                letterSpacing: '0.1em', fontWeight: 600, paddingTop: '0.15rem' }}>{m.date}</div>
              <div style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: 1.6 }}>{m.event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2.5rem', textAlign: 'center' }} className="inv-pad">
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#555',
            textTransform: 'uppercase', marginBottom: '1rem' }}>GET IN TOUCH</div>
          <h2 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)',
            fontWeight: 900, margin: '0 0 1.5rem' }}>Ready to Learn More?</h2>
          <p style={{ color: '#666', lineHeight: 1.75, marginBottom: '2.5rem', fontSize: '0.9rem' }}>
            We are currently engaged with select strategic investors and defense partners.
            Reach out to request our investor deck or schedule a call with leadership.
          </p>
          <a href="/#contact" style={{
            background: '#c8102e', color: '#fff', padding: '1rem 3rem',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block',
          }}>CONTACT INVESTOR RELATIONS</a>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #0d0d0d', padding: '2rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 24, opacity: 0.6 }} />
        <span style={{ fontSize: '0.62rem', color: '#333', letterSpacing: '0.1em' }}>
          VAXON SPACE &nbsp;|&nbsp; ALL RIGHTS RESERVED &nbsp;|&nbsp; CONFIDENTIAL
        </span>
      </div>
    </div>
  )
}
