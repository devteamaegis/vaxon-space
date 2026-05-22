'use client'
import { useState } from 'react'

const NAV = [
  { id: 'overview',    label: 'Mission Overview',   icon: '◈' },
  { id: 'satellites',  label: 'Satellite Status',   icon: '◎' },
  { id: 'imagery',     label: 'Imagery & ISR',      icon: '⊡' },
  { id: 'comms',       label: 'Communications',     icon: '≋' },
  { id: 'reports',     label: 'Reports',            icon: '≡' },
  { id: 'alerts',      label: 'Alerts',             icon: '⚡', badge: 2 },
  { id: 'settings',    label: 'Account Settings',   icon: '⊙' },
]

const STATS = [
  { label: 'Active Satellites',  value: '3',       unit: 'of 4',    delta: '+0',    up: true  },
  { label: 'Avg. Latency',       value: '<12',     unit: 'ms',      delta: '-3ms',  up: true  },
  { label: 'Ground Resolution',  value: '0.28',    unit: 'm',       delta: 'target met', up: true },
  { label: 'Uptime This Month',  value: '99.7',    unit: '%',       delta: '+0.2%', up: true  },
]

const ALERTS = [
  { time: '14:32 UTC', level: 'INFO',  msg: 'VS-03 completed southern pass — imagery queued for processing' },
  { time: '11:09 UTC', level: 'WARN',  msg: 'VS-01 thermal margin at 91% — within nominal range' },
  { time: '08:55 UTC', level: 'INFO',  msg: 'Ground station handshake confirmed — Newport uplink nominal' },
  { time: 'Yesterday', level: 'INFO',  msg: 'Imagery delivery completed — 14 frames transmitted to client node' },
  { time: 'Yesterday', level: 'CRIT',  msg: 'VS-02 attitude control anomaly resolved — ops team notified' },
]

const PASSES = [
  { sat: 'VS-01', region: 'Eastern Mediterranean',  start: '15:40 UTC', dur: '4m 12s', res: '0.25m' },
  { sat: 'VS-03', region: 'Arabian Peninsula',       start: '16:18 UTC', dur: '3m 48s', res: '0.28m' },
  { sat: 'VS-04', region: 'Korean Peninsula',        start: '17:02 UTC', dur: '5m 01s', res: '0.30m' },
  { sat: 'VS-01', region: 'Baltic Sea Region',       start: '18:55 UTC', dur: '4m 33s', res: '0.25m' },
]

export default function DashboardPage() {
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex',
      fontFamily: "'Inter', sans-serif", color: '#fff' }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64, flexShrink: 0, background: '#050505',
        borderRight: '1px solid #111', display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #111',
          display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 240 }}>
          <img src="/vaxon/logo.png" alt="Vaxon" style={{ height: 28, flexShrink: 0 }} />
          {sidebarOpen && (
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#444',
              textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Mission Portal</span>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            marginLeft: 'auto', background: 'none', border: 'none', color: '#333',
            cursor: 'pointer', fontSize: '1rem', padding: 0, flexShrink: 0,
          }}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 1rem', background: active === item.id ? '#0d0d0d' : 'none',
              border: 'none', borderLeft: active === item.id ? '2px solid #fff' : '2px solid transparent',
              color: active === item.id ? '#fff' : '#444', cursor: 'pointer',
              textAlign: 'left', fontSize: '0.78rem', transition: 'all 0.15s', minWidth: 240,
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { if (active !== item.id) (e.currentTarget as HTMLButtonElement).style.color = '#888' }}
              onMouseLeave={e => { if (active !== item.id) (e.currentTarget as HTMLButtonElement).style.color = '#444' }}
            >
              <span style={{ fontSize: '0.9rem', flexShrink: 0, width: 20, textAlign: 'center' }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ whiteSpace: 'nowrap', flex: 1 }}>{item.label}</span>
              )}
              {sidebarOpen && item.badge && (
                <span style={{ background: '#c8102e', color: '#fff', fontSize: '0.55rem',
                  padding: '0.15rem 0.4rem', borderRadius: 2, fontWeight: 700 }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '1rem', borderTop: '1px solid #111', minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, background: '#1a1a1a', border: '1px solid #222',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: '#666', flexShrink: 0 }}>VS</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: '0.78rem', color: '#aaa' }}>Authorized User</div>
                <div style={{ fontSize: '0.65rem', color: '#444' }}>DoD Clearance L2</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #111',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#020202', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: '#444',
              textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              {NAV.find(n => n.id === active)?.label ?? 'Dashboard'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>
              Thursday, 22 May 2026 &nbsp;|&nbsp; 14:38 UTC
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.1em' }}>ALL SYSTEMS NOMINAL</span>
            <a href="/login" style={{ fontSize: '0.65rem', letterSpacing: '0.12em',
              color: '#444', textDecoration: 'none', textTransform: 'uppercase',
              border: '1px solid #1a1a1a', padding: '0.4rem 0.75rem', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#888'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#444'}
            >SIGN OUT</a>
          </div>
        </header>

        {/* Page body */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px', background: '#111', marginBottom: '2rem' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: '#000', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#555',
                  textTransform: 'uppercase', marginBottom: '0.75rem' }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: '2.2rem',
                    fontWeight: 900, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: '0.75rem', color: '#555' }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: s.up ? '#22c55e' : '#ef4444' }}>{s.delta}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px',
            background: '#111', marginBottom: '2rem' }}>

            {/* Upcoming passes */}
            <div style={{ background: '#000', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#555',
                textTransform: 'uppercase', marginBottom: '1.25rem' }}>Upcoming Passes — Today</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #111' }}>
                    {['Satellite', 'Region', 'Start', 'Duration', 'Res.'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0 0 0.6rem',
                        fontSize: '0.58rem', color: '#444', letterSpacing: '0.1em',
                        textTransform: 'uppercase', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PASSES.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #0a0a0a' }}>
                      <td style={{ padding: '0.6rem 0', color: '#aaa' }}>{p.sat}</td>
                      <td style={{ padding: '0.6rem 0', color: '#666' }}>{p.region}</td>
                      <td style={{ padding: '0.6rem 0', color: '#888', fontVariantNumeric: 'tabular-nums' }}>{p.start}</td>
                      <td style={{ padding: '0.6rem 0', color: '#666' }}>{p.dur}</td>
                      <td style={{ padding: '0.6rem 0', color: '#555' }}>{p.res}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Satellite health */}
            <div style={{ background: '#000', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#555',
                textTransform: 'uppercase', marginBottom: '1.25rem' }}>Fleet Health</div>
              {[
                { id: 'VS-01', status: 'OPERATIONAL', orbit: '214 km', health: 98, color: '#22c55e' },
                { id: 'VS-02', status: 'STANDBY',     orbit: '219 km', health: 87, color: '#eab308' },
                { id: 'VS-03', status: 'OPERATIONAL', orbit: '211 km', health: 95, color: '#22c55e' },
                { id: 'VS-04', status: 'OPERATIONAL', orbit: '223 km', health: 92, color: '#22c55e' },
              ].map(sat => (
                <div key={sat.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%',
                        background: sat.color, boxShadow: `0 0 4px ${sat.color}` }} />
                      <span style={{ fontSize: '0.82rem', color: '#ccc' }}>{sat.id}</span>
                      <span style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.1em' }}>{sat.orbit}</span>
                    </div>
                    <span style={{ fontSize: '0.62rem', color: sat.color, letterSpacing: '0.1em' }}>{sat.status}</span>
                  </div>
                  <div style={{ height: 3, background: '#111', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${sat.health}%`,
                      background: sat.color, borderRadius: 2, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#444', marginTop: '0.25rem',
                    textAlign: 'right' }}>{sat.health}% health</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity log */}
          <div style={{ background: '#000', border: '1px solid #111', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#555',
              textTransform: 'uppercase', marginBottom: '1.25rem' }}>Recent Activity</div>
            {ALERTS.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0',
                borderBottom: i < ALERTS.length - 1 ? '1px solid #0a0a0a' : 'none',
                alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', flexShrink: 0,
                  color: a.level === 'CRIT' ? '#ef4444' : a.level === 'WARN' ? '#eab308' : '#444',
                  marginTop: '0.1rem', minWidth: 36 }}>{a.level}</span>
                <span style={{ fontSize: '0.65rem', color: '#555', flexShrink: 0,
                  fontVariantNumeric: 'tabular-nums', minWidth: 90 }}>{a.time}</span>
                <span style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.5 }}>{a.msg}</span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}
