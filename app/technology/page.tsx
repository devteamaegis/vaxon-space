'use client'
import { lazy, Suspense } from 'react'
import { StarField, Nav, Footer, VX_GLOBAL_STYLE } from '../page'

const ABEPDiagram = lazy(() => import('@/components/ABEPDiagram'))

function SatelliteDesign() {
  return (
    <section style={{ background: '#02020d', borderTop: '1px solid #131323', padding: '6rem 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '1.05rem', letterSpacing: '0.3em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '0.5rem' }}>SATELLITE DESIGN</div>
        <div style={{ width: 48, height: 2, background: '#c8102e', marginBottom: '2.5rem' }} />
        <div className="vx-about-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ border: '1px solid #1a1a2e', overflow: 'hidden', background: '#050512' }}>
            <img src="/vaxon/newvaxonsatellitebus.jpg" alt="Vaxon Space satellite bus design"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, margin: '0 0 1.5rem' }}>
              The Vaxon Bus
            </h2>
            <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, fontSize: '1rem', fontWeight: 400, margin: '0 0 1.25rem' }}>
              A purpose-built VLEO platform pairing air-breathing electric propulsion with an AO-resistant airframe, high-efficiency inlet, and deployable solar arrays, engineered to operate where no conventional satellite can survive.
            </p>
            <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, fontSize: '0.92rem', fontWeight: 400, margin: 0 }}>
              The bus supports sub-30cm imaging payloads and defense sensing simultaneously, with unlimited mission duration and no propellant mass penalty.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const SPECS = [
  { tag: 'OXYGEN-RESISTANT THRUSTERS', body: "Vaxon Space has a strategic partnership agreement with a DARPA-backed engine supplier developing an AO-resistant, air-breathing flight thruster. This thruster has best-in-class air-breathing performance numbers to enable Vaxon's VLEO missions." },
  { tag: 'HIGH EFFICIENCY INLET', body: 'A novel air capture design along with AO resistant materials produces an inlet system with increased collection and capture efficiencies that allows Vaxon satellites to operate in a wide VLEO altitude range.' },
  { tag: 'AERODYNAMIC ARCHITECTURE', body: 'An aerodynamic bus will host multiple payload configurations while providing the power required for long-duration missions across ISR, missile defense and connectivity platforms.' },
  { tag: 'ATOMIC OXYGEN (AO) RESISTANT COATINGS', body: 'AO-resistant materials provide longevity for long-duration missions in VLEO. Additionally, a robust propulsion subsystem withstands AO while delivering best-in-class performance to counter the drag environment.' },
]

function SatelliteSpecs() {
  return (
    <section style={{ background: '#02020d', padding: '0 2.5rem 6rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="vx-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: '#131323', border: '1px solid #131323' }}>
          {SPECS.map(s => (
            <div key={s.tag} style={{ background: '#02020d', padding: '2.5rem 2rem' }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.78rem', letterSpacing: '0.2em', color: '#c8102e', textTransform: 'uppercase', marginBottom: '1rem' }}>{s.tag}</div>
              <p style={{ fontFamily: "'Bitter',Georgia,serif", color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, fontSize: '0.95rem', fontWeight: 400, margin: 0 }}>{s.body}</p>
            </div>
          ))}
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
        <SatelliteDesign />
        <SatelliteSpecs />
        <Suspense fallback={<div style={{ height: 400, background: '#02020d' }} />}>
          <ABEPDiagram />
        </Suspense>
        <Footer />
      </div>
    </>
  )
}
