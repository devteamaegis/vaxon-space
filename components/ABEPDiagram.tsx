'use client'

const ANIM = `
  /* Intake particle stream */
  @keyframes abep-intake {
    0%   { transform: translateX(0px);  opacity: 0; }
    8%   { opacity: 1; }
    88%  { opacity: 1; }
    100% { transform: translateX(130px); opacity: 0; }
  }
  .abep-p { animation: abep-intake 2.2s linear infinite; opacity: 0; }
  .abep-p:nth-child(1)  { animation-delay: 0s; }
  .abep-p:nth-child(2)  { animation-delay: 0.37s; }
  .abep-p:nth-child(3)  { animation-delay: 0.74s; }
  .abep-p:nth-child(4)  { animation-delay: 1.11s; }
  .abep-p:nth-child(5)  { animation-delay: 1.48s; }
  .abep-p:nth-child(6)  { animation-delay: 1.85s; }

  /* Internal flow particles (compressor → plenum → valve → thruster) */
  @keyframes abep-internal {
    0%   { transform: translateX(0px);  opacity: 0; }
    6%   { opacity: 0.85; }
    92%  { opacity: 0.85; }
    100% { transform: translateX(440px); opacity: 0; }
  }
  .abep-fp { animation: abep-internal 3s linear infinite; opacity: 0; }
  .abep-fp:nth-child(1)  { animation-delay: 0s; }
  .abep-fp:nth-child(2)  { animation-delay: 0.5s; }
  .abep-fp:nth-child(3)  { animation-delay: 1s; }
  .abep-fp:nth-child(4)  { animation-delay: 1.5s; }
  .abep-fp:nth-child(5)  { animation-delay: 2s; }
  .abep-fp:nth-child(6)  { animation-delay: 2.5s; }

  /* Compressor band pulse */
  @keyframes abep-compress {
    0%,100% { transform: scaleY(1);    opacity: 0.55; }
    50%      { transform: scaleY(0.82); opacity: 0.9;  }
  }
  .abep-band { transform-box: fill-box; transform-origin: center; }
  .abep-band:nth-child(1) { animation: abep-compress 1.6s ease-in-out infinite; animation-delay: 0s; }
  .abep-band:nth-child(2) { animation: abep-compress 1.6s ease-in-out infinite; animation-delay: 0.13s; }
  .abep-band:nth-child(3) { animation: abep-compress 1.6s ease-in-out infinite; animation-delay: 0.26s; }
  .abep-band:nth-child(4) { animation: abep-compress 1.6s ease-in-out infinite; animation-delay: 0.39s; }
  .abep-band:nth-child(5) { animation: abep-compress 1.6s ease-in-out infinite; animation-delay: 0.52s; }
  .abep-band:nth-child(6) { animation: abep-compress 1.6s ease-in-out infinite; animation-delay: 0.65s; }

  /* Plenum breathe */
  @keyframes abep-plenum {
    0%,100% { r: 62; opacity: 0.75; }
    50%      { r: 67; opacity: 1;    }
  }
  @keyframes abep-plenum-glow {
    0%,100% { opacity: 0.3; }
    50%      { opacity: 0.7; }
  }
  .abep-plenum-fill { animation: abep-plenum 2s ease-in-out infinite; }
  .abep-plenum-glow { animation: abep-plenum-glow 2s ease-in-out infinite; }

  /* Valve open/close */
  @keyframes abep-valve {
    0%,100% { transform: rotate(0deg);  }
    50%      { transform: rotate(18deg); }
  }
  .abep-valve-blade {
    transform-box: fill-box;
    transform-origin: center;
    animation: abep-valve 2s ease-in-out infinite;
  }

  /* Thruster plume pulse */
  @keyframes abep-plume-inner {
    0%,100% { transform: scaleX(1)    scaleY(1);    opacity: 0.9;  }
    50%      { transform: scaleX(1.14) scaleY(1.1);  opacity: 1;    }
  }
  @keyframes abep-plume-mid {
    0%,100% { transform: scaleX(1)    scaleY(1);    opacity: 0.5; }
    50%      { transform: scaleX(1.2)  scaleY(1.15); opacity: 0.75; }
  }
  @keyframes abep-plume-outer {
    0%,100% { transform: scaleX(1)    scaleY(1);    opacity: 0.2; }
    50%      { transform: scaleX(1.28) scaleY(1.22); opacity: 0.4; }
  }
  .abep-plume-i { transform-box: fill-box; transform-origin: left center; animation: abep-plume-inner 1.8s ease-in-out infinite; }
  .abep-plume-m { transform-box: fill-box; transform-origin: left center; animation: abep-plume-mid   1.8s ease-in-out infinite; }
  .abep-plume-o { transform-box: fill-box; transform-origin: left center; animation: abep-plume-outer 1.8s ease-in-out infinite; }

  /* Flow-line dash animation */
  @keyframes abep-dash {
    from { stroke-dashoffset: 28; }
    to   { stroke-dashoffset: 0; }
  }
  .abep-flowline { stroke-dasharray: 7 5; animation: abep-dash 1.1s linear infinite; }

  /* Subsystem box subtle pulse */
  @keyframes abep-sub {
    0%,100% { opacity: 0.55; }
    50%      { opacity: 0.85; }
  }
  .abep-sub-1 { animation: abep-sub 3.1s ease-in-out infinite; }
  .abep-sub-2 { animation: abep-sub 3.1s ease-in-out infinite; animation-delay: 0.5s; }
  .abep-sub-3 { animation: abep-sub 3.1s ease-in-out infinite; animation-delay: 1s; }
  .abep-sub-4 { animation: abep-sub 3.1s ease-in-out infinite; animation-delay: 1.5s; }
  .abep-sub-5 { animation: abep-sub 3.1s ease-in-out infinite; animation-delay: 2s; }
`

export default function ABEPDiagram() {
  return (
    <div style={{ background: '#02020d', padding: '4rem 2.5rem' }}>
      <style>{ANIM}</style>

      {/* ── Section label ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.28em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", marginBottom: '0.5rem' }}>
          ABEP PROPULSION SYSTEM
        </div>
        <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 900, color: '#fff', margin: 0 }}>
          Air-Breathing Electric Propulsion
        </h2>
      </div>

      {/* ── Animated Diagram ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: '3.5rem' }}>
        <svg
          viewBox="0 0 920 440"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Plume gradients */}
            <linearGradient id="plume-i" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%"   stopColor="#dd55ff" stopOpacity="1"   />
              <stop offset="70%"  stopColor="#aa22ee" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#7700cc" stopOpacity="0"   />
            </linearGradient>
            <linearGradient id="plume-m" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%"   stopColor="#cc44ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#8800cc" stopOpacity="0"    />
            </linearGradient>
            <linearGradient id="plume-o" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%"   stopColor="#bb33ff" stopOpacity="0.3"  />
              <stop offset="100%" stopColor="#6600aa" stopOpacity="0"    />
            </linearGradient>

            {/* Plenum fill gradient */}
            <radialGradient id="plenum-fill" cx="38%" cy="32%" r="68%" fx="38%" fy="32%">
              <stop offset="0%"   stopColor="#55aaff" stopOpacity="0.9" />
              <stop offset="55%"  stopColor="#1155cc" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#041428" stopOpacity="1"   />
            </radialGradient>
            <radialGradient id="plenum-glow-g" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#44aaff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0066dd" stopOpacity="0"   />
            </radialGradient>

            {/* Compressor gradient */}
            <linearGradient id="comp-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#1a3a5c" />
              <stop offset="100%" stopColor="#0d2236" />
            </linearGradient>

            {/* Internal particle color */}
            <radialGradient id="fp-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#66ccff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2288dd" stopOpacity="0"   />
            </radialGradient>

            {/* Glow filters */}
            <filter id="fglow-blue" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="fglow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="fglow-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ══ SATELLITE BODY (extended left to encompass the inlet) ══ */}
          <rect x="22" y="44" width="872" height="356" rx="26" ry="26"
            fill="rgba(5,10,28,0.6)" stroke="#1a2a4a" strokeWidth="2" />

          {/* ══ TOP SUBSYSTEMS ══ */}
          {([
            { label: 'EPS',   x: 295, cls: 'abep-sub-1' },
            { label: 'ADCS',  x: 475, cls: 'abep-sub-2' },
            { label: 'C&DH',  x: 655, cls: 'abep-sub-3' },
          ] as { label: string; x: number; cls: string }[]).map(s => (
            <g key={s.label} className={s.cls}>
              <rect x={s.x - 48} y="58" width="96" height="36" rx="7" ry="7"
                fill="#060f1e" stroke="#1e3355" strokeWidth="1.5" />
              <text x={s.x} y="81" textAnchor="middle"
                fill="#7aaddd" fontSize="13" fontFamily="'Inter',sans-serif" letterSpacing="1.5" fontWeight="500">
                {s.label}
              </text>
            </g>
          ))}

          {/* ══ BOTTOM SUBSYSTEMS ══ */}
          <g className="abep-sub-4">
            <rect x="247" y="350" width="96" height="36" rx="7" ry="7"
              fill="#060f1e" stroke="#1e3355" strokeWidth="1.5" />
            <text x="295" y="373" textAnchor="middle"
              fill="#7aaddd" fontSize="13" fontFamily="'Inter',sans-serif" letterSpacing="1.5" fontWeight="500">
              TCS
            </text>
          </g>

          <g className="abep-sub-5">
            <rect x="607" y="350" width="96" height="36" rx="7" ry="7"
              fill="#060f1e" stroke="#1e3355" strokeWidth="1.5" />
            <text x="655" y="373" textAnchor="middle"
              fill="#7aaddd" fontSize="13" fontFamily="'Inter',sans-serif" letterSpacing="1.5" fontWeight="500">
              COMM
            </text>
          </g>

          {/* Payload Bay — dashed blue */}
          <rect x="427" y="346" width="136" height="44" rx="7" ry="7"
            fill="rgba(0,80,180,0.08)" stroke="#2255aa" strokeWidth="2" strokeDasharray="7 4" />
          <text x="495" y="364" textAnchor="middle"
            fill="#4488cc" fontSize="12" fontFamily="'Inter',sans-serif" letterSpacing="0.5">
            Payload
          </text>
          <text x="495" y="381" textAnchor="middle"
            fill="#4488cc" fontSize="12" fontFamily="'Inter',sans-serif" letterSpacing="0.5">
            Bay
          </text>

          {/* ══ INTAKE ARROWS / PARTICLES ══ */}
          <text x="40" y="218" fill="#cce8ff" fontSize="14" fontFamily="'Bitter',Georgia,serif" fontWeight="600">
            Inlet
          </text>

          {/* Static intake stream lines */}
          {[155, 180, 205, 230, 255, 280].map((y, i) => (
            <line key={i} x1="52" y1={y} x2="158" y2={y}
              stroke="#1a3a5c" strokeWidth="1.2" />
          ))}

          {/* Animated intake particles — 6 rows × 6 particles each */}
          {[155, 180, 205, 230, 255, 280].map((y, row) => (
            <g key={row} transform={`translate(28, ${y})`}>
              {[0,1,2,3,4,5].map(n => (
                <g key={n} className="abep-p" style={{ animationDelay: `${(n * 0.37 + row * 0.07).toFixed(2)}s` }}>
                  {/* Arrow shaft */}
                  <line x1="0" y1="0" x2="18" y2="0"
                    stroke="#00aaff" strokeWidth="1.6" />
                  {/* Arrow head */}
                  <polygon points="18,0 12,-3.5 12,3.5"
                    fill="#00aaff" />
                </g>
              ))}
            </g>
          ))}

          {/* ══ COMPRESSOR ══ */}
          <text x="212" y="142" fill="#aaccee" fontSize="13" fontFamily="'Bitter',Georgia,serif" fontWeight="600">
            Compressor
          </text>
          {/* Body */}
          <rect x="205" y="152" width="120" height="140" rx="4" ry="4"
            fill="url(#comp-grad)" stroke="#1e3a5c" strokeWidth="1.5" />
          {/* Animated compression bands */}
          <g>
            {[0,1,2,3,4,5].map(i => (
              <rect key={i} className="abep-band"
                x="208" y={157 + i * 21} width="114" height="14"
                rx="2" fill="#1a4a7a" stroke="#2a6aaa" strokeWidth="0.8"
              />
            ))}
          </g>
          {/* Input/output lines */}
          <line x1="158" y1="222" x2="205" y2="222"
            stroke="#1a3a5c" strokeWidth="1.5" />
          <line x1="325" y1="222" x2="368" y2="222"
            stroke="#1a3a5c" strokeWidth="1.5" />

          {/* ══ INTERNAL FLOW PARTICLES (compressor → thruster) ══ */}
          <g transform="translate(325, 219)">
            {[0,1,2,3,4,5].map(n => (
              <g key={n} className="abep-fp" style={{ animationDelay: `${(n * 0.5).toFixed(2)}s` }}>
                <circle cx="0" cy="0" r="4"
                  fill="url(#fp-grad)" filter="url(#fglow-soft)" />
              </g>
            ))}
          </g>

          {/* Flow line dashes compressor → plenum */}
          <line x1="325" y1="222" x2="368" y2="222"
            className="abep-flowline"
            stroke="#2266aa" strokeWidth="1.8" fill="none" />

          {/* ══ PLENUM ══ */}
          <text x="460" y="142" fill="#aaccee" fontSize="13" fontFamily="'Bitter',Georgia,serif" fontWeight="600" textAnchor="middle">
            Plenum
          </text>
          {/* Outer glow */}
          <circle className="abep-plenum-glow"
            cx="460" cy="222" r="82"
            fill="url(#plenum-glow-g)" filter="url(#fglow-blue)" />
          {/* Fill */}
          <circle className="abep-plenum-fill"
            cx="460" cy="222" r="62"
            fill="url(#plenum-fill)" stroke="#2266aa" strokeWidth="1.5" />
          {/* Highlight */}
          <circle cx="442" cy="204" r="12"
            fill="rgba(120,200,255,0.12)" />

          {/* Flow line: plenum → flow control */}
          <line x1="522" y1="222" x2="568" y2="222"
            className="abep-flowline"
            stroke="#2266aa" strokeWidth="1.8" fill="none" />

          {/* ══ FLOW CONTROL (butterfly valve) ══ */}
          <text x="598" y="142" fill="#aaccee" fontSize="12" fontFamily="'Bitter',Georgia,serif" fontWeight="600" textAnchor="middle">
            Flow
          </text>
          <text x="598" y="158" fill="#aaccee" fontSize="12" fontFamily="'Bitter',Georgia,serif" fontWeight="600" textAnchor="middle">
            control
          </text>
          {/* Valve body (pipe) */}
          <line x1="568" y1="222" x2="630" y2="222"
            stroke="#1a3a5c" strokeWidth="8" strokeLinecap="round" />
          {/* Valve center pin */}
          <circle cx="599" cy="222" r="5" fill="#2a4a6a" stroke="#3a6a9a" strokeWidth="1.2" />
          {/* Valve blades */}
          <g className="abep-valve-blade">
            <ellipse cx="599" cy="222" rx="18" ry="7"
              fill="#1a3a5c" stroke="#3a6aaa" strokeWidth="1.4" />
          </g>

          {/* Flow line: valve → thruster */}
          <line x1="630" y1="222" x2="668" y2="222"
            className="abep-flowline"
            stroke="#2266aa" strokeWidth="1.8" fill="none" />

          {/* ══ THRUSTER ══ */}
          <text x="724" y="142" fill="#aaccee" fontSize="13" fontFamily="'Bitter',Georgia,serif" fontWeight="600" textAnchor="middle">
            Thruster
          </text>
          {/* Thruster body */}
          <rect x="668" y="172" width="52" height="100" rx="4" ry="4"
            fill="#0d1e30" stroke="#1e3a5c" strokeWidth="1.5" />
          {/* Nozzle detail lines */}
          {[0,1,2].map(i => (
            <line key={i}
              x1="668" y1={185 + i * 24} x2="720" y2={185 + i * 24}
              stroke="#1e3a5c" strokeWidth="1" />
          ))}

          {/* ══ EXHAUST PLUME ══ */}
          {/* Outer glow */}
          <polygon className="abep-plume-o"
            points="720,188 880,164 880,280 720,256"
            fill="url(#plume-o)" filter="url(#fglow-purple)" />
          {/* Mid plume */}
          <polygon className="abep-plume-m"
            points="720,196 848,178 848,266 720,248"
            fill="url(#plume-m)" />
          {/* Inner plume (brightest) */}
          <polygon className="abep-plume-i"
            points="720,204 816,195 816,249 720,240"
            fill="url(#plume-i)" filter="url(#fglow-soft)" />
          {/* Nozzle exit glow */}
          <line x1="720" y1="172" x2="720" y2="272"
            stroke="#cc44ff" strokeWidth="2" strokeOpacity="0.5"
            filter="url(#fglow-purple)" />

          {/* ══ LABELS: intake arrows on diagram ══ */}
          {[155, 180, 205, 230, 255, 280].map((y, i) => (
            <polygon key={i}
              points={`24,${y} 8,${y-5} 8,${y+5}`}
              fill="#006699" opacity="0.6" />
          ))}

        </svg>
      </div>

      {/* ── Info cards ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#0d0d1a' }}>
        {/* Card 1 — Thrusters */}
        <div style={{ background: '#02020d', padding: '2.5rem 2rem', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#060618')}
          onMouseLeave={e => (e.currentTarget.style.background = '#02020d')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#c8102e', boxShadow: '0 0 8px rgba(200,16,46,0.6)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#c8102e', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
              OXYGEN-RESISTANT THRUSTERS
            </div>
          </div>
          <div style={{ width: 32, height: 1, background: '#c8102e22', marginBottom: '1.25rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.8, margin: 0, fontFamily: "'Inter',sans-serif" }}>
            Vaxon Space has a strategic partnership agreement with a DARPA-backed engine supplier developing an AO-resistant, air-breathing flight thruster. This thruster has best-in-class air-breathing performance numbers to enable Vaxon's VLEO missions.
          </p>
        </div>

        {/* Card 2 — Inlet */}
        <div style={{ background: '#02020d', padding: '2.5rem 2rem', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#060618')}
          onMouseLeave={e => (e.currentTarget.style.background = '#02020d')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0088ff', boxShadow: '0 0 8px rgba(0,136,255,0.6)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#0088ff', textTransform: 'uppercase', fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
              HIGH EFFICIENCY INLET
            </div>
          </div>
          <div style={{ width: 32, height: 1, background: '#0088ff22', marginBottom: '1.25rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.8, margin: 0, fontFamily: "'Inter',sans-serif" }}>
            A novel air capture design along with AO resistant materials produces an inlet system with increased collection and capture efficiencies that allows Vaxon satellites to operate in a wide VLEO altitude range.
          </p>
        </div>
      </div>
    </div>
  )
}
