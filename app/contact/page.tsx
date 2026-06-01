'use client'
import { StarField, Nav, ContactSection, VX_GLOBAL_STYLE } from '../page'

export default function ContactPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="contact" />
      <div style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
        <ContactSection />
      </div>
    </>
  )
}
