'use client'
import { useState } from 'react'

/* ──────────────────────────────────────────────────────────────
   INTERACTIVE ABEP SATELLITE BUS  (blueprint cutaway, brand red/blue)
   Click a layer to highlight that subsystem and read the detail.
─────────────────────────────────────────────────────────────── */

type Layer = { n: string; tag: string; sub?: string; body: string; side: 'L' | 'R' }
const LAYERS: Layer[] = [
  { n: '01', tag: 'Compression-design IP', sub: 'Patent pending', side: 'L',
    body: 'The inlet geometry no-one else is pursuing. A novel air-capture design with AO-resistant materials delivers high collection and capture efficiency across a wide VLEO altitude range.' },
  { n: '02', tag: 'Built to fly low', side: 'L',
    body: "Engineered for the altitude others can't sustain. An aerodynamic bus hosts multiple payload configurations while delivering the power for long-duration ISR, missile defense and connectivity missions." },
  { n: '03', tag: 'Survives where others corrode', side: 'R',
    body: 'Atomic oxygen (AO) at 180-250 km destroys most spacecraft. AO-resistant coatings and a robust propulsion subsystem give Vaxon longevity where conventional satellites erode.' },
  { n: '04', tag: 'Atmosphere as propellant', side: 'R',
    body: 'No propellant tank, no refuel, no end-of-life from running dry. Air-breathing electric propulsion harvests atmospheric molecules as propellant for unlimited mission duration.' },
]

const HULL = '#e7ecf4', WALL = '#aab4c4', CONTOUR = '#7a8596', PANEL = '#d2d9e3', FLOW = '#3f86d8', FLOW2 = '#6fb6f0', RED = '#c8102e'
const lin = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + (b - a) * (i / (n - 1)))

const ANIM = `
  @keyframes sc-flow { to { stroke-dashoffset: -32; } }
  .sc-flow { stroke-dasharray: 9 7; animation: sc-flow 1.1s linear infinite; }
  .sc-flow:nth-child(2n) { animation-duration: 1.4s; }
  .sc-flow:nth-child(3n) { animation-duration: 0.9s; }
  @keyframes sc-spin { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.8); } }
  .sc-comp { transform-box: fill-box; transform-origin: center; animation: sc-spin 1.5s ease-in-out infinite; }
  @keyframes sc-plume { 0%,100% { transform: scaleX(1); opacity: var(--o,.85); } 50% { transform: scaleX(1.18); opacity: 1; } }
  .sc-plume { transform-box: fill-box; transform-origin: left center; animation: sc-plume 1.7s ease-in-out infinite; }
  @keyframes sc-pulse { 0%,100% { r: 5; opacity: 1; } 50% { r: 7.5; opacity: .65; } }
  .sc-dot { animation: sc-pulse 2s ease-in-out infinite; }
  @keyframes sc-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
  .sc-sat { animation: sc-bob 7s ease-in-out infinite; }
  @media (max-width: 900px) { .vx-sat-grid { grid-template-columns: 1fr !important; } .vx-sat-col { text-align: left !important; } }
`

export default function SatelliteCutaway() {
  const [active, setActive] = useState(0)
  const isHull = active === 1, isSkin = active === 2, isInlet = active === 0, isProp = active === 3
  const glow = (on: boolean) => (on ? 'url(#sc-glow)' : undefined)

  const Card = ({ i }: { i: number }) => {
    const L = LAYERS[i], on = active === i
    return (
      <button onClick={() => setActive(i)} className="vx-sat-col"
        style={{ display: 'block', width: '100%', textAlign: L.side === 'L' ? 'right' : 'left', background: on ? 'rgba(200,16,46,0.06)' : 'transparent', border: `1px solid ${on ? '#c8102e' : '#1a1a2e'}`, padding: '1.1rem 1.25rem', cursor: 'pointer', font: 'inherit', transition: 'border-color 0.2s, background 0.2s' }}
        onMouseEnter={e => { setActive(i); if (!on) e.currentTarget.style.borderColor = '#c8102e' }}
        onMouseLeave={e => { if (active !== i) e.currentTarget.style.borderColor = '#1a1a2e' }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.6rem', letterSpacing: '0.24em', color: '#c8102e', marginBottom: '0.4rem' }}>LAYER {L.n}</div>
        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.05rem', fontWeight: 400, color: '#fff', lineHeight: 1.25 }}>{L.tag}</div>
        {L.sub && <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.58rem', letterSpacing: '0.18em', color: '#7aaddd', textTransform: 'uppercase', marginTop: '0.35rem' }}>{L.sub}</div>}
        <div style={{ maxHeight: on ? 220 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
          <p style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', fontWeight: 400, margin: '0.75rem 0 0' }}>{L.body}</p>
        </div>
      </button>
    )
  }

  return (
    <section style={{ background: '#02020d', borderTop: '1px solid #131323', padding: '6rem 2.5rem' }}>
      <style>{ANIM}</style>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.78rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '0.5rem' }}>THE BUS IS THE MOAT</div>
        <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3.2vw,2.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, margin: '0 0 0.75rem' }}>Our ABEP satellite bus</h2>
        <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: 400, margin: '0 0 0.4rem' }}>
          ABEP = air-breathing electric propulsion · the engine uses the thin atmosphere as propellant · 180-250 km band
        </p>
        <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 400, margin: '0' }}>
          Designed for VLEO from the ground up. Each layer is a known problem. Closing all four is not. Tap a layer to explore.
        </p>

        <div className="vx-sat-grid" style={{ display: 'grid', gridTemplateColumns: '0.82fr 2.4fr 0.82fr', gap: '1.75rem', alignItems: 'center', marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}><Card i={0} /><Card i={1} /></div>

          <svg viewBox="0 0 1000 460" style={{ width: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sc-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke={PANEL} strokeWidth="0.7" opacity="0.55" />
              </pattern>
              <linearGradient id="sc-plume-g" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5aa6ff" stopOpacity="0.5" /><stop offset="60%" stopColor="#3f86d8" stopOpacity="0.22" /><stop offset="100%" stopColor="#3f86d8" stopOpacity="0" />
              </linearGradient>
              <filter id="sc-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="sc-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>

            {/* faint blueprint grid */}
            <g opacity="0.1" stroke="#24467a" strokeWidth="0.5">
              {lin(40, 960, 24).map((x, i) => <line key={'gx' + i} x1={x} y1="20" x2={x} y2="440" />)}
              {lin(40, 420, 11).map((y, i) => <line key={'gy' + i} x1="20" y1={y} x2="980" y2={y} />)}
            </g>

            <g className="sc-sat">
              {/* PANELS (Layer 02 body) */}
              <g stroke={isHull ? RED : PANEL} strokeWidth="1.2" filter={glow(isHull)}>
                <line x1="470" y1="186" x2="470" y2="162" /><line x1="690" y1="186" x2="690" y2="150" /><line x1="430" y1="290" x2="430" y2="318" /><line x1="650" y1="290" x2="650" y2="316" />
                <polygon points="360,150 600,140 600,176 360,184" fill="url(#sc-hatch)" /><polygon points="610,139 800,150 800,182 610,176" fill="url(#sc-hatch)" />
                <polygon points="320,316 560,308 560,344 320,352" fill="url(#sc-hatch)" /><polygon points="572,308 740,316 740,348 572,344" fill="url(#sc-hatch)" />
              </g>

              {/* HULL */}
              <path d="M 770 196 C 600 160, 380 158, 292 170 C 222 181, 172 206, 165 230 C 172 254, 222 279, 292 290 C 380 302, 600 300, 770 264 Z"
                fill="rgba(6,14,30,0.9)" stroke={isHull ? RED : HULL} strokeWidth={isHull ? 2.4 : 1.8} filter={glow(isHull)} />
              <path d="M 762 206 C 600 174, 388 172, 302 183 C 238 193, 190 212, 184 230 C 190 248, 238 267, 302 277 C 388 288, 600 286, 762 254 Z"
                fill="none" stroke={WALL} strokeWidth="1" />

              {/* CONTOUR / skin lines (Layer 03) */}
              <g stroke={isSkin ? RED : CONTOUR} strokeWidth={isSkin ? 1.5 : 0.9} opacity={isSkin ? 1 : 0.8} filter={glow(isSkin)}>
                <path d="M 250 184 C 430 173, 620 175, 760 198" fill="none" /><path d="M 235 196 C 430 187, 620 189, 762 210" fill="none" />
                <path d="M 235 264 C 430 273, 620 271, 762 250" fill="none" /><path d="M 250 276 C 430 287, 620 285, 760 262" fill="none" />
              </g>
              <line x1="185" y1="230" x2="762" y2="230" stroke={CONTOUR} strokeWidth="0.7" strokeDasharray="4 5" opacity="0.6" />

              {/* INLET rings (Layer 01) */}
              <g fill="none" stroke={isInlet ? RED : HULL} strokeWidth={isInlet ? 2.2 : 1.4} filter={glow(isInlet)}>
                <ellipse cx="178" cy="230" rx="15" ry="40" /><ellipse cx="190" cy="230" rx="10" ry="29" /><ellipse cx="201" cy="230" rx="6" ry="19" />
              </g>

              {/* STREAMLINES (airflow) */}
              <g fill="none" strokeWidth="1.1">
                {lin(204, 256, 13).map((y0, i) => {
                  const tY = 230 + (y0 - 230) * 0.18, c1y = y0 + (tY - y0) * 0.25, c2y = y0 + (tY - y0) * 0.72, exitY = 230 + (y0 - 230) * 0.16
                  return <path key={'f' + i} className="sc-flow" d={`M 206 ${y0.toFixed(1)} C 360 ${c1y.toFixed(1)}, 560 ${c2y.toFixed(1)}, 700 ${tY.toFixed(1)} L 880 ${exitY.toFixed(1)}`}
                    stroke={isInlet || isProp ? FLOW2 : FLOW} opacity={isInlet || isProp ? 0.95 : 0.6} />
                })}
              </g>

              {/* COMPRESSOR + PLENUM + NOZZLE + VALVE (Layer 04) */}
              <g stroke={isProp ? RED : HULL} filter={glow(isProp)}>
                <g className="sc-comp">{lin(198, 262, 11).map((y, i) => <line key={'v' + i} x1="461" y1={y} x2="479" y2={y - 7} strokeWidth="1.3" />)}</g>
                <ellipse cx="600" cy="230" rx="30" ry="40" fill="rgba(20,60,110,0.35)" strokeWidth="1" />
                <path d="M 700 200 L 735 224 L 770 210" fill="none" strokeWidth="1.6" /><path d="M 700 260 L 735 236 L 770 250" fill="none" strokeWidth="1.6" />
                <ellipse cx="735" cy="230" rx="4" ry="13" fill="none" strokeWidth="1.2" />
              </g>

              {/* PLUME */}
              <polygon className="sc-plume" points="772,210 900,184 900,276 772,250" fill="url(#sc-plume-g)" filter="url(#sc-soft)" opacity={isProp ? 0.7 : 0.5} />
              <polygon className="sc-plume" points="772,216 862,206 862,254 772,244" fill="url(#sc-plume-g)" opacity={isProp ? 1 : 0.85} />

              {/* CALLOUT dots + dotted leaders */}
              {[
                { x: 200, y: 200, lx: 120, ly: 152, p: 0 }, { x: 430, y: 295, lx: 360, ly: 360, p: 1 },
                { x: 690, y: 166, lx: 800, ly: 120, p: 2 }, { x: 775, y: 232, lx: 868, ly: 330, p: 3 },
              ].map(d => (
                <g key={d.p} onClick={() => setActive(d.p)} style={{ cursor: 'pointer' }}>
                  <line x1={d.x} y1={d.y} x2={d.lx} y2={d.ly} stroke={RED} strokeWidth="1" strokeDasharray="2 3" opacity={active === d.p ? 0.95 : 0.55} />
                  <circle cx={d.x} cy={d.y} r="13" fill="transparent" />
                  <circle className={active === d.p ? 'sc-dot' : ''} cx={d.x} cy={d.y} r={active === d.p ? 6.5 : 5} fill={active === d.p ? RED : '#0a0a16'} stroke={RED} strokeWidth="2" />
                </g>
              ))}
            </g>
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}><Card i={2} /><Card i={3} /></div>
        </div>

        <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: 400, textAlign: 'center', marginTop: '2.5rem' }}>
          Out of 12 Space-Based Interceptor awardees, none target persistent sub-250 km operations.
        </p>
      </div>
    </section>
  )
}
