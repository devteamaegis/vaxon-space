'use client'
import { StarField, Nav, ContactSection, Footer, VX_GLOBAL_STYLE } from '../page'

export default function ContactPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="contact" />
      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>
        <ContactSection />
        <Footer />
      </div>
    </>
  )
}
