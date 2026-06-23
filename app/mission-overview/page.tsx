'use client'
import { useEffect, useRef, useState } from 'react'

export default function MissionOverviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [pct, setPct] = useState(0)         // % of the video buffered
  const [ready, setReady] = useState(false)  // fully buffered -> lag-free
  const [canThrough, setCanThrough] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)

  // Buffer the whole file before allowing play, so playback never stalls mid-stream.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const update = () => {
      if (!v.duration || !isFinite(v.duration)) return
      let end = 0
      try { if (v.buffered.length) end = v.buffered.end(v.buffered.length - 1) } catch {}
      const p = Math.min(100, Math.round((end / v.duration) * 100))
      setPct(p)
      if (p >= 98) setReady(true)
    }
    const onThrough = () => setCanThrough(true)
    v.addEventListener('progress', update)
    v.addEventListener('loadedmetadata', update)
    v.addEventListener('canplaythrough', onThrough)
    update()
    return () => {
      v.removeEventListener('progress', update)
      v.removeEventListener('loadedmetadata', update)
      v.removeEventListener('canplaythrough', onThrough)
    }
  }, [])

  const play = () => {
    const v = videoRef.current; if (!v) return
    v.play().then(() => setPlaying(true)).catch(() => {})
  }
  const replay = () => {
    const v = videoRef.current; if (!v) return
    setEnded(false); v.currentTime = 0
    v.play().then(() => setPlaying(true)).catch(() => {})
  }

  const PlayCircle = ({ label }: { label: string }) => (
    <button onClick={play} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1rem' }}>
      <span style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(2,2,13,0.85)', border: '2px solid #c8102e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" fill="#fff" width="38" height="38" style={{ marginLeft: 5 }}><path d="M8 5v14l11-7z" /></svg>
      </span>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff' }}>{label}</span>
    </button>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`body { margin: 0; background: #000; }`}</style>

      <video
        ref={videoRef}
        controls
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setEnded(true); setPlaying(false) }}
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
      >
        <source src="/vaxon/explainer.mp4" type="video/mp4" />
      </video>

      {/* Persistent exit -top left */}
      <a href="/" style={{
        position: 'absolute', top: '1.5rem', left: '1.75rem', zIndex: 10, textDecoration: 'none',
        fontFamily: "'Inter',sans-serif", fontSize: '0.62rem', letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c8102e')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      >← Back to site</a>

      {/* Buffering gate — keep the whole video loading until it can play start-to-finish with no lag */}
      {!ready && !ended && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 9, background: 'rgba(0,0,0,0.78)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Preparing Mission Overview</div>
          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(2.4rem,6vw,4rem)', fontWeight: 400, color: '#fff', lineHeight: 1 }}>{pct}%</div>
          <div style={{ width: 'min(420px,70vw)', height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#c8102e', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>buffering for lag-free playback</div>
          {canThrough && (
            <button onClick={play} style={{ marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c8102e')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >Play now anyway ›</button>
          )}
        </div>
      )}

      {/* Ready & buffered -big play button */}
      {ready && !playing && !ended && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 9, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PlayCircle label="Ready · Play" />
        </div>
      )}

      {/* End-of-video overlay -return button */}
      {ended && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 11, background: 'rgba(2,2,13,0.92)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 400, color: '#fff', textAlign: 'center', padding: '0 1.5rem' }}>
            Thank you for watching
          </div>
          <a href="/" style={{
            background: '#c8102e', color: '#fff', textDecoration: 'none',
            padding: '1rem 2.5rem', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: "'Inter',sans-serif", transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#a50d26')}
            onMouseLeave={e => (e.currentTarget.style.background = '#c8102e')}
          >Return to Landing Page</a>
          <button onClick={replay} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Inter',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
          >↻ Replay</button>
        </div>
      )}
    </div>
  )
}
