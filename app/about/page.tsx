'use client'
import { StarField, Nav, AboutSection, LogosSection, Footer, VX_GLOBAL_STYLE } from '../page'

export default function AboutPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="about" />
      <div style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
        <AboutSection />
        <LogosSection />
        <Footer />
      </div>
    </>
  )
}
