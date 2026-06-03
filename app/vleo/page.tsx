'use client'
import { useEffect, useRef, useState } from 'react'
import { Nav, StarField, Footer, VX_GLOBAL_STYLE } from '../page'

/* ── Animated count-up ── */
function CountUp({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1800, 1)
        setN(Math.round((1 - Math.pow(1 - p, 3)) * to))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}

/* ── Fade-in on scroll ── */
function Fade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : 'translateY(22px)',
      transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>{children}</div>
  )
}

const S: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif",
}

export default function VLEOPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="vleo" />

      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1, fontFamily: "'Inter',sans-serif" }}>

        {/* ── HERO ── */}
        <div style={{ position: 'relative', padding: '6rem 2.5rem 5rem', background: 'linear-gradient(to bottom, #02020d 0%, #06020f 100%)', borderBottom: '1px solid #131323', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '1rem' }}>
              VERY LOW EARTH ORBIT — 180–250 KM
            </div>
            <h1 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2.4rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.06, color: '#fff', margin: '0 0 1.5rem', maxWidth: 800, letterSpacing: '-0.02em' }}>
              Why VLEO Changes<br />Everything
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.9rem,1.5vw,1.1rem)', maxWidth: 560, lineHeight: 1.8, margin: 0 }}>
              The 200km altitude difference between VLEO and LEO isn't incremental —
              it's a physics step-change that unlocks capabilities impossible from any higher orbit.
            </p>
          </div>
          {/* Decorative altitude line */}
          <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            {['GEO  35,786 km', 'MEO  8,000 km', 'LEO  400–600 km', 'VLEO  180–250 km'].map((l, i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: i === 3 ? 1 : 0.25 }}>
                <div style={{ fontSize: '0.52rem', letterSpacing: '0.1em', color: i === 3 ? '#c8102e' : '#555', fontFamily: "'Inter',sans-serif", textAlign: 'right' }}>{l}</div>
                <div style={{ width: i === 3 ? 24 : 12, height: 1, background: i === 3 ? '#c8102e' : '#333' }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── THE ALTITUDE GAP ── */}
        <section style={{ padding: '5rem 2.5rem', background: '#02020d', borderBottom: '1px solid #131323' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Fade>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.22em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '0.75rem' }}>THE ALTITUDE GAP</div>
              <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2.2rem,3.6vw,3.2rem)', fontWeight: 400, color: '#fff', margin: '0 0 3.5rem' }}>
                The Physics Behind VLEO Superiority
              </h2>
            </Fade>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1px', background: '#131323' }}>
              {[
                {
                  tag: 'RESOLUTION', metric: '5×', unit: 'sharper imagery',
                  body: 'At 200km vs 600km, the same aperture delivers 3× better ground sampling distance. Sub-30cm GSD — target identification at orbital speed. No heavier optics required.',
                  detail: 'Physics: GSD scales linearly with altitude. 200km ÷ 600km = 0.33× → 3× resolution improvement. Combined with near-nadir geometry: <30cm GSD vs 50–80cm at LEO.',
                },
                {
                  tag: 'LATENCY', metric: '5×', unit: 'shorter signal path',
                  body: 'Signal round-trip at 200km: <15ms. At 600km: ~80ms. For missile defense, directed energy coordination, and AI inference loops — every millisecond is a decision window.',
                  detail: 'Physics: c = 3×10⁸ m/s. Round-trip at 200km ≈ 1.33ms propagation (plus processing). At LEO 600km ≈ 4ms propagation. Total system latency scales accordingly.',
                },
                {
                  tag: 'PERSISTENCE', metric: '2×', unit: 'more revisits per day',
                  body: 'Shorter orbital period at VLEO (~88 min vs ~96 min at LEO) means more passes per day. A 5-satellite constellation delivers <2hr revisit globally.',
                  detail: 'Orbital period at 200km: ~88.5 min. At 550km: ~95.5 min. 5-sat constellation at 45° inclination: mean revisit <2hr for latitudes 0–60°.',
                },
                {
                  tag: 'RESILIENCE', metric: 'Weeks', unit: 'not decades of debris risk',
                  body: 'At 200km, orbital decay from atmospheric drag clears debris in days to weeks. At 600km, debris persists for decades — a growing threat to constellation operations.',
                  detail: 'Atmospheric density at 200km: ~10⁻⁹ kg/m³ (vs ~10⁻¹³ at 600km). Debris deorbit time at 200km: days–weeks. At 400km: months. At 600km: decades.',
                },
              ].map((c, i) => (
                <Fade key={c.tag} delay={i * 80}>
                  <div style={{ background: '#02020d', padding: '2.25rem 2rem' }}>
                    <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.22em', color: '#c8102e', marginBottom: '0.5rem' }}>{c.tag}</div>
                    <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '2.8rem', fontWeight: 400, color: '#fff', lineHeight: 1, marginBottom: '0.25rem' }}>{c.metric}</div>
                    <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.9rem', color: '#fff', marginBottom: '1rem', letterSpacing: '0.04em', fontWeight: 600 }}>{c.unit}</div>
                    <p style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: '#fff', lineHeight: 1.75, margin: '0 0 1rem', fontWeight: 400 }}>{c.body}</p>
                    <details>
                      <summary style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.14em', color: '#c8102e', cursor: 'pointer', textTransform: 'uppercase', outline: 'none' }}>
                        PHYSICS DETAIL →
                      </summary>
                      <p style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: '0.75rem 0 0', borderTop: '1px solid #131323', paddingTop: '0.75rem', fontWeight: 400 }}>{c.detail}</p>
                    </details>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSILE DEFENSE ── */}
        <section style={{ padding: '5rem 2.5rem', background: '#050510', borderBottom: '1px solid #131323' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Fade>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.22em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '0.75rem' }}>MISSION CRITICAL</div>
              <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2.2rem,3.6vw,3.2rem)', fontWeight: 400, color: '#fff', margin: '0 0 1rem' }}>
                Missile Defense: The VLEO Advantage
              </h2>
              <p style={{ color: '#fff', fontFamily: "'Bitter',Georgia,serif", fontSize: '1.05rem', maxWidth: 680, lineHeight: 1.8, marginBottom: '3.5rem', fontWeight: 400 }}>
                Hypersonic boost-phase tracking requires sensor platforms at low altitude, low latency, and persistent coverage.
                No LEO or GEO architecture delivers all three simultaneously. VLEO does.
              </p>
            </Fade>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="vx-about-grid">
              <Fade>
                <div>
                  {[
                    { phase: 'BOOST PHASE', window: '3–5 min', desc: 'Missile still on ballistic arc, large IR signature, most vulnerable. VLEO sensor geometry provides best off-axis tracking angle vs. GEO/MEO.', vleo: '✓ Optimal', leo: '△ Limited', geo: '✗ Poor geometry' },
                    { phase: 'MIDCOURSE', window: '20–25 min', desc: 'Above atmosphere, multiple warhead separation. VLEO persistent ISR confirms RV count and trajectory, feeding Golden Dome intercept solutions.', vleo: '✓ Persistent', leo: '✓ Capable', geo: '△ Latency limited' },
                    { phase: 'TERMINAL', window: '~1 min', desc: 'Final descent. VLEO sub-15ms latency enables real-time handoff to intercept systems — closing the sensor-to-shooter loop before LEO architectures relay the data.', vleo: '✓ <15ms loop', leo: '△ ~80ms loop', geo: '✗ Too slow' },
                  ].map((p, i) => (
                    <Fade key={p.phase} delay={i * 100}>
                      <div style={{ borderLeft: '2px solid #c8102e', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1.4rem', letterSpacing: '0.18em', color: '#c8102e' }}>{p.phase}</div>
                          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.7rem', letterSpacing: '0.08em', color: '#fff' }}>WINDOW: {p.window}</div>
                        </div>
                        <p style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', color: '#fff', lineHeight: 1.7, margin: '0 0 0.75rem', fontWeight: 400 }}>{p.desc}</p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          {[['VLEO', p.vleo, '#c8102e'], ['LEO', p.leo, '#fff'], ['GEO', p.geo, 'rgba(255,255,255,0.6)']].map(([label, val, color]) => (
                            <div key={label as string}>
                              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.6rem', letterSpacing: '0.12em', color: '#fff', marginBottom: '0.2rem' }}>{label}</div>
                              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.82rem', color: color as string, fontWeight: 600 }}>{val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Fade>
                  ))}
                </div>
              </Fade>

              <Fade delay={150}>
                <div style={{ background: '#02020d', border: '1px solid #131323', padding: '2rem' }}>
                  <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.18em', color: '#c8102e', marginBottom: '1.5rem' }}>GOLDEN DOME ARCHITECTURE ALIGNMENT</div>
                  {[
                    { req: 'Persistent hypersonic tracking', vaxon: 'VLEO 45° inclination constellation provides continuous mid-latitude coverage' },
                    { req: 'Boost-phase sensor geometry', vaxon: '180–250km altitude provides optimal off-nadir tracking angles for boost-phase IR' },
                    { req: 'Sub-100ms sensor-to-shooter latency', vaxon: '<15ms signal path enables real-time fire control loop integration' },
                    { req: 'ISR + missile defense dual use', vaxon: 'Same VLEO bus supports sub-30cm imaging and defense sensing simultaneously' },
                    { req: 'Resilient constellation', vaxon: 'Self-cleaning orbit and ABEP unlimited endurance ensure no single point of failure' },
                  ].map((r, i) => (
                    <div key={i} style={{ borderBottom: '1px solid #0d0d1a', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>{r.req}</div>
                      <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontWeight: 400 }}>{r.vaxon}</div>
                    </div>
                  ))}
                </div>
              </Fade>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ padding: '4rem 2.5rem', background: '#02020d', borderBottom: '1px solid #131323' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1px', background: '#131323' }}>
              {[
                { n: 30, suf: 'cm', pre: '<', label: 'Ground Sample Distance', sub: 'vs 50–80cm at LEO' },
                { n: 15, suf: 'ms', pre: '<', label: 'Signal Latency', sub: 'vs ~80ms at LEO' },
                { n: 88, suf: ' min', pre: '', label: 'Orbital Period', sub: 'vs 95+ min at LEO' },
                { n: 2, suf: ' hr', pre: '<', label: 'Global Revisit', sub: '5-satellite constellation' },
                { n: 3, suf: '×', pre: '', label: 'Closer to Earth', sub: 'than Starlink/ISS' },
              ].map((s, i) => (
                <Fade key={s.label} delay={i * 60}>
                  <div style={{ background: '#02020d', padding: '2rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.25rem' }}>
                      {s.pre}<CountUp to={s.n} suffix={s.suf} />
                    </div>
                    <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.7rem', letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 700 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>{s.sub}</div>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPETITIVE COMPARISON ── */}
        <section style={{ padding: '5rem 2.5rem', background: '#02020d', borderBottom: '1px solid #131323' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Fade>
              <div style={{ fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '0.5rem' }}>COMPETITIVE LANDSCAPE</div>
              <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#fff', margin: '0 0 0.75rem' }}>
                How Vaxon Compares
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.88rem', maxWidth: 540, margin: '0 0 3rem', lineHeight: 1.75 }}>
                Technical comparison across altitude, resolution, latency, revisit time, and mission life.
              </p>
            </Fade>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: '#06060f', borderBottom: '1px solid #1a1a2e' }}>
                    {['PLATFORM', 'ALTITUDE', 'RESOLUTION', 'LATENCY', 'REVISIT', 'PROPULSION LIFE'].map((h, i) => (
                      <th key={h} style={{ padding: '0.85rem 1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '0.65rem', letterSpacing: '0.14em', color: i === 0 ? '#c8102e' : '#fff', textTransform: 'uppercase', textAlign: 'left', fontWeight: 700 }}>{h}</th>
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
                    <tr key={r.name} style={{ background: r.vaxon ? 'rgba(200,16,46,0.06)' : (i % 2 === 0 ? '#02020d' : '#030312'), borderBottom: '1px solid #0d0d1a', transition: 'background 0.2s' }}
                      onMouseEnter={e => { if (!r.vaxon) (e.currentTarget as HTMLElement).style.background = '#060620' }}
                      onMouseLeave={e => { if (!r.vaxon) (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#02020d' : '#030312' }}
                    >
                      <td style={{ padding: '1rem', fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', fontWeight: r.vaxon ? 700 : 500, color: '#fff', borderLeft: r.vaxon ? '2px solid #c8102e' : '2px solid transparent' }}>{r.name}</td>
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
        </section>

        {/* ── USE CASES ── */}
        <section style={{ padding: '5rem 2.5rem', background: '#050510' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Fade>
              <div style={{ fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '0.5rem' }}>USE CASES</div>
              <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#fff', margin: '0 0 3.5rem' }}>
                What VLEO Enables
              </h2>
            </Fade>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1px', background: '#0d0d1a' }}>
              {[
                { icon: '⬡', title: 'Golden Dome / Missile Defense', tag: 'DOD PRIORITY', body: 'Persistent boost-phase tracking of hypersonic threats across CONUS, INDOPACOM, and EUCOM. Sub-15ms latency closes the sensor-to-shooter loop at machine speed — the foundational layer of the Golden Dome architecture.' },
                { icon: '⬡', title: 'Persistent ISR', tag: 'ISR', body: 'Sub-30cm resolution with <2hr global revisit from a 5-satellite constellation. Continuous surveillance of high-value targets — not snapshot imagery. Operational at any latitude from 0–60°.' },
                { icon: '⬡', title: 'Directed Energy + C2', tag: 'COMMAND & CONTROL', body: 'Ultra-low latency enables precise beam pointing for directed energy weapons and real-time command networks for distributed forces. No other spaceborne platform matches this latency profile.' },
                { icon: '⬡', title: 'Maritime Domain Awareness', tag: 'MARITIME', body: 'AIS data fusion with sub-30cm optical imagery for vessel identification, dark ship detection, and port activity monitoring. Real-time coverage of contested maritime zones.' },
                { icon: '⬡', title: 'AI Edge Computing', tag: 'AI / SPACE COMPUTE', body: 'On-orbit AI inference at VLEO altitude — raw sensor data processed in orbit before downlink. 10× bandwidth reduction while delivering actionable intelligence to operators in real time.' },
                { icon: '⬡', title: 'Commercial Remote Sensing', tag: 'COMMERCIAL', body: 'Agriculture, energy infrastructure, forestry, and mapping at resolution previously available only from aerial platforms. Commercial revisit economics at satellite scale and coverage.' },
              ].map((u, i) => (
                <Fade key={u.title} delay={i * 70}>
                  <div style={{ background: '#02020d', padding: '2rem' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#060618')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#02020d')}
                  >
                    <div style={{ fontSize: '1.05rem', letterSpacing: '0.22em', color: '#c8102e', marginBottom: '0.6rem' }}>{u.tag}</div>
                    <h3 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.75rem', lineHeight: 1.3 }}>{u.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#4a4a5e', lineHeight: 1.75, margin: 0 }}>{u.body}</p>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '5rem 2.5rem', background: '#02020d', textAlign: 'center', borderTop: '1px solid #131323' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Fade>
              <div style={{ fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '1rem' }}>READY TO ENGAGE</div>
              <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#fff', margin: '0 0 1.25rem' }}>
                Schedule a Technical Briefing
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                We brief qualified government, defense, and investor audiences on VLEO mission architecture,
                ABEP technology, and acquisition pathway.
              </p>
              <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/contact" style={{ background: '#c8102e', color: '#fff', padding: '0.9rem 2.25rem', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#a50d26')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#c8102e')}
                >REQUEST BRIEFING</a>
                <a href="/technology" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.9rem 2.25rem', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#c8102e')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
                >VIEW TECHNOLOGY</a>
              </div>
            </Fade>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
