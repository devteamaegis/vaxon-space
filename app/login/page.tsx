'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please enter your credentials.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/dashboard')
    }, 1200)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#000', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '2rem',
    }}>
      {/* Logo */}
      <a href="/" style={{ display: 'block', marginBottom: '3rem', textDecoration: 'none' }}>
        <img src="/vaxon/logo.png" alt="Vaxon Space" style={{ height: 40, width: 'auto', opacity: 0.9 }} />
      </a>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420, border: '1px solid #1a1a1a',
        padding: '2.5rem', background: '#050505',
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#555', marginBottom: '0.6rem' }}>SECURE ACCESS</div>
          <h1 style={{ fontFamily: "'Bitter', Georgia, serif", fontSize: '1.5rem',
            fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>Customer Portal</h1>
          <p style={{ color: '#555', fontSize: '0.82rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Sign in to access your Vaxon Space mission dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#666', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@organization.gov"
              style={{
                width: '100%', background: '#0a0a0a', border: '1px solid #222',
                color: '#fff', padding: '0.75rem 1rem', fontSize: '0.875rem',
                outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#444')}
              onBlur={e => (e.currentTarget.style.borderColor = '#222')}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#666', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%', background: '#0a0a0a', border: '1px solid #222',
                color: '#fff', padding: '0.75rem 1rem', fontSize: '0.875rem',
                outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#444')}
              onBlur={e => (e.currentTarget.style.borderColor = '#222')}
            />
          </div>

          {error && (
            <div style={{ fontSize: '0.78rem', color: '#c8102e', marginBottom: '1rem',
              padding: '0.6rem 0.75rem', border: '1px solid #2a0a0a', background: '#110505' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#111' : '#fff', color: loading ? '#555' : '#000',
              border: 'none', padding: '0.85rem', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif", transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#e8e8e8' }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #111',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: '#444' }}>
            Need access?{' '}
            <a href="/#contact" style={{ color: '#888', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#888'}
            >Contact us</a>
          </span>
          <span style={{ fontSize: '0.72rem', color: '#444' }}>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#888'}
            >Forgot password?</a>
          </span>
        </div>
      </div>

      {/* Footer note */}
      <p style={{ marginTop: '2rem', fontSize: '0.65rem', color: '#333', textAlign: 'center',
        letterSpacing: '0.06em' }}>
        VAXON SPACE &nbsp;|&nbsp; CONTROLLED ACCESS &nbsp;|&nbsp; ALL ACTIVITY LOGGED
      </p>
    </div>
  )
}
