'use client'
import { StarField, Nav, CareersSection, Footer, VX_GLOBAL_STYLE } from '../page'

export default function CareersPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="careers" />
      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>
        <CareersSection />
        <Footer />
      </div>
    </>
  )
}
