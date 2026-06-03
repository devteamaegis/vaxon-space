'use client'
import { lazy, Suspense } from 'react'
import { StarField, Nav, TechnologySection, Footer, VX_GLOBAL_STYLE } from '../page'

const ABEPDiagram = lazy(() => import('@/components/ABEPDiagram'))

function SatelliteBus() {
  return (
    <section style={{ background: '#02020d', borderTop: '1px solid #131323', padding: '6rem 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Bitter',Georgia,serif", fontWeight: 400, fontSize: '1.15rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '0.5rem' }}>SATELLITE DESIGN</div>
        <div style={{ width: 48, height: 2, background: '#c8102e', marginBottom: '2.5rem' }} />
        <div className="vx-about-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ border: '1px solid #1a1a2e', overflow: 'hidden', background: '#050512' }}>
            <img src="/vaxon/buspicture.jpg" alt="Vaxon Space satellite bus design"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, margin: '0 0 1.5rem' }}>
              The Vaxon Bus
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.85, fontSize: '1rem', margin: '0 0 1.25rem', fontFamily: "'Inter',sans-serif" }}>
              A purpose-built VLEO platform pairing air-breathing electric propulsion with an AO-resistant airframe, high-efficiency inlet, and deployable solar arrays — engineered to operate where no conventional satellite can survive.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, fontSize: '0.92rem', margin: 0, fontFamily: "'Inter',sans-serif" }}>
              The bus supports sub-30cm imaging payloads and defense sensing simultaneously, with unlimited mission duration and no propellant mass penalty.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function TechnologyPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="technology" />
      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>
        <TechnologySection />
        <Suspense fallback={<div style={{ height: 400, background: '#02020d' }} />}>
          <ABEPDiagram />
        </Suspense>
        <SatelliteBus />
        <Footer />
      </div>
    </>
  )
}
