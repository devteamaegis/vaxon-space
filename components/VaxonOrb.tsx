'use client'
import { useEffect, useRef } from 'react'

interface VaxonOrbProps {
  isActive: boolean
  isSpeaking?: boolean
  size?: number
}

export default function VaxonOrb({ isActive, isSpeaking = false, size = 200 }: VaxonOrbProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ isActive, isSpeaking })

  useEffect(() => {
    stateRef.current = { isActive, isSpeaking }
  }, [isActive, isSpeaking])

  useEffect(() => {
    if (!mountRef.current) return

    let animId: number
    let renderer: any
    let scene: any
    let camera: any
    let particles: any
    let ring1: any
    let ring2: any
    let ring3: any
    let coreMesh: any
    let glowMesh: any
    let THREE: any

    const init = async () => {
      THREE = await import('three')

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(size, size)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      if (mountRef.current) mountRef.current.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
      camera.position.z = 4

      /* ── PARTICLE SPHERE (fibonacci distribution) ── */
      const COUNT = 1400
      const positions = new Float32Array(COUNT * 3)
      const phi = Math.PI * (3 - Math.sqrt(5))

      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2
        const r = Math.sqrt(1 - y * y)
        const theta = phi * i
        positions[i * 3]     = Math.cos(theta) * r * 1.6
        positions[i * 3 + 1] = y * 1.6
        positions[i * 3 + 2] = Math.sin(theta) * r * 1.6
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.025,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      })

      particles = new THREE.Points(geo, mat)
      scene.add(particles)

      /* ── CORE GLOW ── */
      const coreGeo = new THREE.SphereGeometry(0.35, 32, 32)
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.12,
      })
      coreMesh = new THREE.Mesh(coreGeo, coreMat)
      scene.add(coreMesh)

      const glowGeo = new THREE.SphereGeometry(0.55, 32, 32)
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.04,
      })
      glowMesh = new THREE.Mesh(glowGeo, glowMat)
      scene.add(glowMesh)

      /* ── ORBITAL RINGS ── */
      const mkRing = (rad: number, tube: number, rx: number, ry: number, op: number) => {
        const rg = new THREE.TorusGeometry(rad, tube, 8, 128)
        const rm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: op })
        const mesh = new THREE.Mesh(rg, rm)
        mesh.rotation.x = rx
        mesh.rotation.y = ry
        scene.add(mesh)
        return mesh
      }

      ring1 = mkRing(1.0, 0.008, Math.PI / 4,  0, 0.35)
      ring2 = mkRing(1.3, 0.005, -Math.PI / 3, Math.PI / 4, 0.2)
      ring3 = mkRing(0.75, 0.006, Math.PI / 2, Math.PI / 6, 0.15)

      /* ── CONNECTION LINES ── */
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 })
      const lineGeo = new THREE.BufferGeometry()
      const linePositions: number[] = []
      for (let i = 0; i < 40; i++) {
        const a = i * 3, b = ((i * 7) % COUNT) * 3
        linePositions.push(positions[a], positions[a+1], positions[a+2])
        linePositions.push(positions[b], positions[b+1], positions[b+2])
      }
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
      const lines = new THREE.LineSegments(lineGeo, lineMat)
      particles.add(lines)

      /* ── ANIMATE ── */
      let t = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        t += 0.005

        const { isActive: active, isSpeaking: speaking } = stateRef.current
        const speedMult = speaking ? 2.0 : active ? 1.2 : 0.6
        const pulse = speaking ? 0.08 : active ? 0.03 : 0.015

        particles.rotation.y += 0.003 * speedMult
        particles.rotation.x = Math.sin(t * 0.3) * 0.12

        ring1.rotation.z += 0.008 * speedMult
        ring2.rotation.z -= 0.005 * speedMult
        ring3.rotation.z += 0.006 * speedMult
        ring3.rotation.y += 0.004 * speedMult

        const s = 1 + Math.sin(t * (speaking ? 6 : 2)) * pulse
        particles.scale.setScalar(s)

        coreMesh.material.opacity = 0.08 + Math.sin(t * 3) * 0.04
        glowMesh.material.opacity = 0.03 + Math.sin(t * 2.5 + 1) * 0.02
        mat.opacity = active ? 0.85 : 0.45

        renderer.render(scene, camera)
      }
      animate()
    }

    init()

    return () => {
      cancelAnimationFrame(animId)
      if (renderer) {
        renderer.dispose()
        if (mountRef.current?.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [size])

  return (
    <div
      ref={mountRef}
      style={{
        width: size, height: size,
        opacity: isActive ? 1 : 0.5,
        transition: 'opacity 0.4s ease',
      }}
    />
  )
}
