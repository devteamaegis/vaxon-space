'use client'
import { StarField, Nav, TechnologySection, VX_GLOBAL_STYLE } from '../page'

export default function TechnologyPage() {
  return (
    <>
      <style>{VX_GLOBAL_STYLE}</style>
      <StarField />
      <Nav active="technology" />
      <div style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
        <TechnologySection />
      </div>
    </>
  )
}
