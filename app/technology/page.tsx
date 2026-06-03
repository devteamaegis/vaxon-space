'use client'
import { lazy, Suspense } from 'react'
import { StarField, Nav, TechnologySection, VX_GLOBAL_STYLE } from '../page'

const ABEPDiagram = lazy(() => import('@/components/ABEPDiagram'))

export default function TechnologyPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="technology" />
      <div style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
        <TechnologySection />
        <Suspense fallback={<div style={{ height: 400, background: '#02020d' }} />}>
          <ABEPDiagram />
        </Suspense>
      </div>
    </>
  )
}
