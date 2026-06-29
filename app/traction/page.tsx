'use client'
import { StarField, Nav, TractionSection, Footer, VX_GLOBAL_STYLE } from '../page'

export default function TractionPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="traction" />
      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>
        <TractionSection />
        <Footer />
      </div>
    </>
  )
}
