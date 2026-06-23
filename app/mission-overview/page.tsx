'use client'
import { useEffect, useRef, useState } from 'react'

export default function MissionOverviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ended, setEnded] = useState(false)
  const [needsTap, setNeedsTap] = useState(false)

  // Attempt autoplay with sound; if the browser blocks it, surface a tap-to-play button.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => setNeedsTap(true))
  }, [])

  const play = () => {
    const v = videoRef.current
    if (!v) return
    setNeedsTap(false)
    v.play().catch(() => {})
  }

  const replay = () => {
    const v = videoRef.current
    if (!v) return
    setEnded(false)
    v.currentTime = 0
    v.play().catch(() => {})
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`body { margin: 0; background: #000; }`}</style>

      <video
        ref={videoRef}
        controls
        playsInline
        onEnded={() => setEnded(true)}
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

      {/* Tap to play (autoplay-blocked fallback) */}
      {needsTap && !ended && (
        <button onClick={play} style={{
          position: 'absolute', inset: 0, zIndex: 9, background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(2,2,13,0.85)', border: '2px solid #c8102e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="#fff" width="34" height="34" style={{ marginLeft: 5 }}><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
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
