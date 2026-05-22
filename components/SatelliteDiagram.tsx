'use client'
import { useEffect, useRef, useState } from 'react'

/* ─── PART DATA ───────────────────────────────────────── */
type PartId = 'bus' | 'panels' | 'inlet' | 'thruster'

interface PartInfo {
  name: string
  tag: string
  body: string
  accentColor: number
}

const PARTS: Record<PartId, PartInfo> = {
  bus: {
    name: 'AERODYNAMIC ARCHITECTURE',
    tag: '01 / PRIMARY BUS',
    body: 'An aerodynamic bus hosts multiple payload configurations while providing the power required for long-duration missions across ISR, missile defense and connectivity platforms. The bus minimizes atmospheric drag while maximizing structural integrity in the extreme VLEO environment at 180-250 km altitude.',
    accentColor: 0xffffff,
  },
  panels: {
    name: 'AO RESISTANT COATINGS',
    tag: '02 / SURFACE PROTECTION',
    body: 'AO-resistant materials provide longevity for long-duration missions in VLEO. A robust propulsion subsystem withstands atomic oxygen while delivering best-in-class performance to counter the drag environment. Without these coatings, materials degrade within weeks at VLEO altitudes.',
    accentColor: 0x6688cc,
  },
  inlet: {
    name: 'HIGH EFFICIENCY INLET',
    tag: '03 / AIR CAPTURE SYSTEM',
    body: 'A novel air capture design along with AO-resistant materials produces an intake system with increased collection and capture efficiencies. This allows Vaxon satellites to operate across a wide VLEO altitude range, converting atmospheric molecules directly into propellant at no consumable cost.',
    accentColor: 0xc8102e,
  },
  thruster: {
    name: 'OXYGEN-RESISTANT THRUSTERS',
    tag: '04 / ABEP PROPULSION',
    body: 'Vaxon Space has a strategic partnership with a DARPA-backed engine supplier developing an AO-resistant, air-breathing flight thruster. This thruster has best-in-class air-breathing performance numbers to enable Vaxon\'s VLEO missions with unlimited mission duration and no propellant tank required.',
    accentColor: 0xc8102e,
  },
}

/* ─── COMPONENT ───────────────────────────────────────── */
export default function SatelliteDiagram() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<PartId | null>(null)
  const [hovered, setHovered] = useState<PartId | null>(null)

  // Use refs for real-time state access inside animation loop
  const selectedRef = useRef<PartId | null>(null)
  const hoveredRef  = useRef<PartId | null>(null)
  selectedRef.current = selected
  hoveredRef.current  = hovered

  useEffect(() => {
    if (!mountRef.current) return

    let animId: number
    let renderer: any

    const init = async () => {
      const THREE = await import('three')

      const container = mountRef.current!
      const W = container.clientWidth
      const H = 520

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
      camera.position.set(4.5, 2.2, 5)
      camera.lookAt(0, 0, 0)

      /* ── LIGHTS ── */
      scene.add(new THREE.AmbientLight(0xffffff, 0.35))

      const sun = new THREE.DirectionalLight(0xffffff, 1.2)
      sun.position.set(6, 8, 4)
      sun.castShadow = true
      scene.add(sun)

      const fill = new THREE.DirectionalLight(0x4466ff, 0.25)
      fill.position.set(-5, -3, -4)
      scene.add(fill)

      const rim = new THREE.DirectionalLight(0xffffff, 0.3)
      rim.position.set(0, -4, -6)
      scene.add(rim)

      /* ── GRID ── */
      const grid = new THREE.GridHelper(30, 60, 0x0d0d0d, 0x0d0d0d)
      grid.position.y = -2.2
      scene.add(grid)

      /* ── SATELLITE GROUP ── */
      const sat = new THREE.Group()
      scene.add(sat)

      // Helper to make standard material
      const mkMat = (color: number, metal = 0.6, rough = 0.3, emissive = 0x000000, emissiveInt = 0) => {
        return new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough, emissive, emissiveIntensity: emissiveInt })
      }

      /* ── MAIN BUS BODY ── */
      const busGeo = new THREE.BoxGeometry(0.95, 0.58, 2.2)
      // Metallic white/silver body with slight warm tint
      const busMat = mkMat(0xdde0e5, 0.75, 0.2)
      const busMesh = new THREE.Mesh(busGeo, busMat)
      busMesh.castShadow = true
      busMesh.userData.partId = 'bus'
      sat.add(busMesh)

      // Gold-tinted thermal blanket panels on sides of bus
      const blanketMat = mkMat(0xc8a84b, 0.3, 0.6) // gold MLI (multi-layer insulation)
      const mkBlanket = (x: number) => {
        const bg = new THREE.BoxGeometry(0.025, 0.52, 1.9)
        const bm = new THREE.Mesh(bg, blanketMat.clone())
        bm.position.set(x, 0, 0)
        bm.userData.partId = 'coating'
        sat.add(bm)
      }
      mkBlanket(0.49); mkBlanket(-0.49)

      // Edge wireframe on bus
      const edgeGeo = new THREE.EdgesGeometry(busGeo)
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.3 })
      const edges = new THREE.LineSegments(edgeGeo, edgeMat)
      sat.add(edges)

      /* ── SOLAR PANELS ── */
      const mkPanel = (xPos: number) => {
        const panelGeo = new THREE.BoxGeometry(1.7, 0.025, 0.72)
        // Deep blue solar cells
        const panelMat = mkMat(0x1a3a6e, 0.1, 0.85)

        const panel = new THREE.Mesh(panelGeo, panelMat)
        panel.position.set(xPos, 0, 0.15)
        panel.castShadow = true
        panel.userData.partId = 'panels'

        // Cell grid lines (lighter blue)
        const cellEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.7, 0.026, 0.72))
        const cellLines = new THREE.LineSegments(cellEdges, new THREE.LineBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.6 }))
        cellLines.position.copy(panel.position)
        cellLines.userData.partId = 'panels'
        sat.add(cellLines)

        // Aluminum panel frame (silver)
        const frameGeo = new THREE.BoxGeometry(1.72, 0.045, 0.74)
        const frame = new THREE.Mesh(frameGeo, mkMat(0xcccccc, 0.85, 0.15))
        frame.position.set(xPos, 0, 0.15)
        frame.userData.partId = 'panels'
        sat.add(frame)

        return panel
      }
      const panelL = mkPanel(-1.38)
      const panelR = mkPanel(1.38)
      sat.add(panelL, panelR)

      // Panel struts (aluminum)
      const strutGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.9, 8)
      const strutMat = mkMat(0xbbbbbb, 0.8, 0.2)
      const strutL = new THREE.Mesh(strutGeo, strutMat)
      const strutR = new THREE.Mesh(strutGeo, strutMat.clone())
      strutL.rotation.z = Math.PI / 2; strutL.position.set(-0.89, 0, 0.15)
      strutR.rotation.z = Math.PI / 2; strutR.position.set(0.89, 0, 0.15)
      sat.add(strutL, strutR)

      /* ── INLET (front) — polished titanium + orange glow ── */
      const inletFunnelGeo = new THREE.CylinderGeometry(0.06, 0.28, 0.55, 20)
      const inletMat = mkMat(0xe0c090, 0.95, 0.05) // warm titanium
      const inletFunnel = new THREE.Mesh(inletFunnelGeo, inletMat)
      inletFunnel.rotation.x = Math.PI / 2
      inletFunnel.position.set(0, 0.02, 1.37)
      inletFunnel.castShadow = true
      inletFunnel.userData.partId = 'inlet'
      sat.add(inletFunnel)

      // Inlet ring (glowing ring)
      const inletRingGeo = new THREE.TorusGeometry(0.28, 0.024, 12, 48)
      const inletRingMat = mkMat(0xff8c00, 0.4, 0.1, 0xff6600, 0.5) // orange emissive
      const inletRing = new THREE.Mesh(inletRingGeo, inletRingMat)
      inletRing.position.set(0, 0.02, 1.1)
      inletRing.userData.partId = 'inlet'
      sat.add(inletRing)

      // Inner tube (dark aperture)
      const inletTubeGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.32, 12)
      const inletTube = new THREE.Mesh(inletTubeGeo, mkMat(0x1a1a1a, 0.3, 0.9))
      inletTube.rotation.x = Math.PI / 2
      inletTube.position.set(0, 0.02, 1.28)
      inletTube.userData.partId = 'inlet'
      sat.add(inletTube)

      // Second intake ring
      const inletRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.012, 8, 32),
        mkMat(0xffa040, 0.5, 0.2, 0xff6600, 0.3)
      )
      inletRing2.position.set(0, 0.02, 1.32)
      inletRing2.userData.partId = 'inlet'
      sat.add(inletRing2)

      /* ── THRUSTER (rear) — ion blue glow ── */
      const thrusterGeo = new THREE.CylinderGeometry(0.18, 0.12, 0.42, 16)
      const thrusterMat = mkMat(0x9999aa, 0.85, 0.12, 0x4488ff, 0.15) // subtle blue emissive
      const thrusterMesh = new THREE.Mesh(thrusterGeo, thrusterMat)
      thrusterMesh.rotation.x = Math.PI / 2
      thrusterMesh.position.set(0, 0, -1.23)
      thrusterMesh.castShadow = true
      thrusterMesh.userData.partId = 'thruster'
      sat.add(thrusterMesh)

      // Nozzle (glowing ion blue)
      const nozzleGeo = new THREE.CylinderGeometry(0.12, 0.21, 0.18, 16)
      const nozzleMat = mkMat(0x6699cc, 0.6, 0.3, 0x2255ff, 0.4)
      const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat)
      nozzle.rotation.x = Math.PI / 2
      nozzle.position.set(0, 0, -1.56)
      nozzle.userData.partId = 'thruster'
      sat.add(nozzle)

      // Thruster grill rings
      for (let ti = 0; ti < 3; ti++) {
        const tRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.14 - ti * 0.025, 0.008, 6, 24),
          mkMat(0x7799dd, 0.5, 0.4, 0x3366ff, 0.2)
        )
        tRing.position.set(0, 0, -1.47 + ti * 0.04)
        tRing.userData.partId = 'thruster'
        sat.add(tRing)
      }

      /* ── SENSOR / PAYLOAD (ISR camera) ── */
      const sensorGeo = new THREE.BoxGeometry(0.32, 0.22, 0.45)
      const sensor = new THREE.Mesh(sensorGeo, mkMat(0x3a3a3a, 0.4, 0.6))
      sensor.position.set(0, 0.4, 0.25)
      sensor.userData.partId = 'bus'
      sat.add(sensor)

      // Camera aperture (dark glass)
      const lensGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.18, 16)
      const lens = new THREE.Mesh(lensGeo, mkMat(0x0a0a14, 0.1, 0.05))
      lens.position.set(0, 0.53, 0.25)
      lens.userData.partId = 'bus'
      sat.add(lens)

      // Camera lens ring
      const lensRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.1, 0.01, 8, 24),
        mkMat(0x999999, 0.9, 0.1)
      )
      lensRing.position.set(0, 0.53, 0.25)
      lensRing.userData.partId = 'bus'
      sat.add(lensRing)

      // Attitude control thrusters (small corner nozzles)
      const actGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.1, 8)
      const actMat = mkMat(0xaaaaaa, 0.8, 0.2)
      ;[[-0.45, 0.32, 1.0], [0.45, 0.32, 1.0], [-0.45, 0.32, -1.0], [0.45, 0.32, -1.0]].forEach(([x, y, z]) => {
        const act = new THREE.Mesh(actGeo, actMat.clone())
        act.position.set(x, y, z)
        act.rotation.x = Math.PI / 2
        act.userData.partId = 'thruster'
        sat.add(act)
      })

      /* ── ALL MESHES FOR RAYCASTING ── */
      const allMeshes: any[] = []
      sat.traverse((obj: any) => { if (obj.isMesh) allMeshes.push(obj) })

      /* ── ION EXHAUST PARTICLES ── */
      const EX_COUNT = 120
      const exPos = new Float32Array(EX_COUNT * 3)
      const exLife = Array.from({ length: EX_COUNT }, () => Math.random())
      const exSpeed = Array.from({ length: EX_COUNT }, () => 0.025 + Math.random() * 0.025)
      const exSpread = Array.from({ length: EX_COUNT }, () => ({
        x: (Math.random() - 0.5) * 0.025,
        y: (Math.random() - 0.5) * 0.025,
      }))

      for (let i = 0; i < EX_COUNT; i++) {
        exPos[i * 3]     = (Math.random() - 0.5) * 0.08
        exPos[i * 3 + 1] = (Math.random() - 0.5) * 0.08
        exPos[i * 3 + 2] = -1.65 - Math.random() * 1.8
      }

      const exGeo = new THREE.BufferGeometry()
      exGeo.setAttribute('position', new THREE.BufferAttribute(exPos, 3))

      const exMat = new THREE.PointsMaterial({
        color: 0x88bbff, size: 0.04, transparent: true,
        opacity: 0.75, sizeAttenuation: true, depthWrite: false,
      })
      const exhaust = new THREE.Points(exGeo, exMat)
      sat.add(exhaust)

      /* ── MOUSE INTERACTION ── */
      const raycaster = new THREE.Raycaster()
      const mouse2d = new THREE.Vector2()

      const updateMouse = (e: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse2d.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouse2d.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      }

      const onMove = (e: MouseEvent) => {
        updateMouse(e)
        raycaster.setFromCamera(mouse2d, camera)
        const hits = raycaster.intersectObjects(allMeshes, false)
        const id = (hits[0]?.object.userData.partId as PartId) ?? null
        setHovered(id)
        renderer.domElement.style.cursor = id ? 'pointer' : 'default'
      }

      const onClick = (e: MouseEvent) => {
        updateMouse(e)
        raycaster.setFromCamera(mouse2d, camera)
        const hits = raycaster.intersectObjects(allMeshes, false)
        const id = (hits[0]?.object.userData.partId as PartId) ?? null
        setSelected(prev => prev === id ? null : id)
      }

      renderer.domElement.addEventListener('mousemove', onMove)
      renderer.domElement.addEventListener('click', onClick)

      /* ── MATERIAL MAP for emissive control ── */
      const partMeshes: Record<PartId, any[]> = { bus: [], panels: [], inlet: [], thruster: [] }
      sat.traverse((obj: any) => {
        if (obj.isMesh && obj.userData.partId) {
          const pid = obj.userData.partId as PartId
          if (partMeshes[pid]) partMeshes[pid].push(obj)
        }
      })

      /* ── ANIMATION LOOP ── */
      let t = 0

      const animate = () => {
        animId = requestAnimationFrame(animate)
        t += 0.004

        const curSelected = selectedRef.current
        const curHovered  = hoveredRef.current

        // Rotate satellite (slow down when something hovered)
        const rotSpeed = curHovered ? 0.001 : 0.004
        sat.rotation.y += rotSpeed
        // Subtle pitch oscillation
        sat.rotation.x = Math.sin(t * 0.4) * 0.06

        // Update emissive on all parts
        ;(['bus', 'panels', 'inlet', 'thruster'] as PartId[]).forEach(pid => {
          const isSelected = curSelected === pid
          const isHovered  = curHovered  === pid
          const accentHex  = PARTS[pid].accentColor

          partMeshes[pid].forEach((mesh: any) => {
            if (!mesh.material?.emissive) return
            if (isSelected) {
              mesh.material.emissive.setHex(accentHex)
              mesh.material.emissiveIntensity = 0.4
            } else if (isHovered) {
              mesh.material.emissive.setHex(accentHex)
              mesh.material.emissiveIntensity = 0.2
            } else {
              mesh.material.emissive.setHex(0x000000)
              mesh.material.emissiveIntensity = 0
            }
          })
        })

        // Update exhaust particles (they are in sat's local space)
        const pos = exGeo.attributes.position.array as Float32Array
        for (let i = 0; i < EX_COUNT; i++) {
          exLife[i] += 0.018
          if (exLife[i] > 1) {
            exLife[i] = 0
            pos[i * 3]     = (Math.random() - 0.5) * 0.08
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08
            pos[i * 3 + 2] = -1.65
          }
          pos[i * 3]     += exSpread[i].x
          pos[i * 3 + 1] += exSpread[i].y
          pos[i * 3 + 2] -= exSpeed[i]
        }
        exGeo.attributes.position.needsUpdate = true

        // Exhaust opacity pulse
        exMat.opacity = 0.5 + Math.sin(t * 8) * 0.15

        renderer.render(scene, camera)
      }
      animate()

      const cleanup = () => {
        renderer.domElement.removeEventListener('mousemove', onMove)
        renderer.domElement.removeEventListener('click', onClick)
      }
      return cleanup
    }

    let cleanupFn: (() => void) | undefined
    const initPromise = init().then(fn => { cleanupFn = fn })

    return () => {
      initPromise.then(() => cleanupFn?.())
      cancelAnimationFrame(animId)
      if (renderer) {
        renderer.dispose()
        if (mountRef.current?.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  const info = selected ? PARTS[selected] : hovered ? PARTS[hovered] : null
  const showInfo = !!(selected || hovered)

  return (
    <div style={{ position: 'relative', border: '1px solid #111', overflow: 'hidden', background: '#020202' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #111',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#c8102e', marginBottom: '0.2rem' }}>INTERACTIVE 3D MODEL</div>
          <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1rem', fontWeight: 700 }}>
            ABEP Satellite Design — VLEO Configuration
          </div>
        </div>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: '#444',
          textTransform: 'uppercase', textAlign: 'right', lineHeight: 1.8 }}>
          <span style={{ display: 'block' }}>HOVER TO HIGHLIGHT</span>
          <span style={{ display: 'block', color: '#c8102e' }}>CLICK TO INSPECT</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ position: 'relative' }}>
        <div ref={mountRef} style={{ width: '100%', height: 520 }} />

        {/* Part labels overlay */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem',
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(Object.entries(PARTS) as [PartId, PartInfo][]).map(([id, part]) => (
            <button
              key={id}
              onClick={() => setSelected(prev => prev === id ? null : id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: selected === id ? '#c8102e' : hovered === id ? '#1a1a1a' : '#0a0a0a',
                border: `1px solid ${selected === id ? '#c8102e' : '#333'}`,
                color: selected === id ? '#fff' : '#ccc',
                padding: '0.55rem 1.2rem', cursor: 'pointer',
                fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                fontFamily: "'Inter',sans-serif", transition: 'all 0.2s', fontWeight: 600,
              }}
            >
              {part.tag.split(' / ')[0]} {part.tag.split(' / ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Info panel */}
      <div style={{
        borderTop: '1px solid #111',
        maxHeight: showInfo ? 260 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {info && (
          <div style={{ padding: '1.75rem', display: 'grid',
            gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#c8102e',
                textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {info.tag}
              </div>
              <div style={{ fontFamily: "'Bitter',Georgia,serif", fontSize: '1.15rem',
                fontWeight: 700, marginBottom: '0.75rem' }}>{info.name}</div>
              <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.75, margin: 0 }}>
                {info.body}
              </p>
            </div>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: '1px solid #222', color: '#555',
                  cursor: 'pointer', padding: '0.3rem 0.75rem',
                  fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontFamily: "'Inter',sans-serif", flexShrink: 0, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8102e'; (e.currentTarget as HTMLButtonElement).style.color = '#c8102e' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#222'; (e.currentTarget as HTMLButtonElement).style.color = '#555' }}
              >CLOSE</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
