'use client'
import { useEffect, useRef } from 'react'

export default function EarthGlobe() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    let animId: number
    let renderer: any

    const init = async () => {
      const THREE = await import('three')
      const container = mountRef.current!
      const W = container.clientWidth
      const H = container.clientHeight || 440

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
      camera.position.set(0, 0, 3.2)

      // Ambient + directional light (simulate sun)
      scene.add(new THREE.AmbientLight(0x112244, 1.2))
      const sun = new THREE.DirectionalLight(0xffeedd, 2.2)
      sun.position.set(5, 3, 5)
      scene.add(sun)

      const loader = new THREE.TextureLoader()

      // Earth geometry
      const earthGeo = new THREE.SphereGeometry(1, 64, 64)

      // Load textures — NASA Blue Marble + night lights via reliable CDN
      const [dayTex, nightTex, cloudTex] = await Promise.all([
        loader.loadAsync('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
        loader.loadAsync('https://unpkg.com/three-globe/example/img/earth-night.jpg'),
        loader.loadAsync('https://unpkg.com/three-globe/example/img/earth-clouds.png'),
      ])

      // Earth material — day texture with some spec
      const earthMat = new THREE.MeshPhongMaterial({
        map: dayTex,
        specular: new THREE.Color(0x224466),
        shininess: 18,
      })
      const earth = new THREE.Mesh(earthGeo, earthMat)
      scene.add(earth)

      // Cloud layer
      const cloudGeo = new THREE.SphereGeometry(1.012, 64, 64)
      const cloudMat = new THREE.MeshPhongMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      })
      const clouds = new THREE.Mesh(cloudGeo, cloudMat)
      scene.add(clouds)

      // Atmosphere glow (rim light effect)
      const atmGeo = new THREE.SphereGeometry(1.08, 64, 64)
      const atmMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
            gl_FragColor = vec4(0.18, 0.52, 1.0, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      })
      const atmosphere = new THREE.Mesh(atmGeo, atmMat)
      scene.add(atmosphere)

      // VLEO orbit ring — at ~200km altitude
      // Earth radius = 6371km, VLEO = 180-250km → ratio ≈ 1.03
      const orbitGeo = new THREE.TorusGeometry(1.032, 0.0015, 8, 200)
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.7 })
      const orbitRing = new THREE.Mesh(orbitGeo, orbitMat)
      orbitRing.rotation.x = Math.PI / 2.2 // slight tilt for VLEO inclination
      scene.add(orbitRing)

      // LEO comparison ring — greyed out
      const leoGeo = new THREE.TorusGeometry(1.08, 0.0012, 8, 200)
      const leoMat = new THREE.MeshBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.4 })
      const leoRing = new THREE.Mesh(leoGeo, leoMat)
      leoRing.rotation.x = Math.PI / 2.1
      scene.add(leoRing)

      // Satellite dot on VLEO orbit
      const satGeo = new THREE.SphereGeometry(0.012, 8, 8)
      const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const sat = new THREE.Mesh(satGeo, satMat)
      scene.add(sat)

      // Satellite trail
      const trailPoints: THREE.Vector3[] = []
      for (let i = 0; i < 30; i++) {
        const a = (i / 30) * Math.PI * 0.5
        trailPoints.push(new THREE.Vector3(Math.cos(a) * 1.032, 0, Math.sin(a) * 1.032))
      }
      const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints)
      const trailMat = new THREE.LineBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.5 })
      const trail = new THREE.Line(trailGeo, trailMat)
      scene.add(trail)

      // Subtle star field in background
      const starVerts = []
      for (let i = 0; i < 1200; i++) {
        const r = 40 + Math.random() * 20
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        starVerts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
      }
      const starGeo = new THREE.BufferGeometry()
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3))
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.6 })
      scene.add(new THREE.Points(starGeo, starMat))

      // Resize handler
      const onResize = () => {
        const w = container.clientWidth
        const h = container.clientHeight || 440
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      let satAngle = 0
      const tiltQuat = new THREE.Quaternion()
      tiltQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2.2)

      const animate = () => {
        animId = requestAnimationFrame(animate)

        // Slow earth rotation
        earth.rotation.y += 0.0015
        clouds.rotation.y += 0.0018

        // Satellite orbit
        satAngle += 0.008
        const sx = Math.cos(satAngle) * 1.032
        const sz = Math.sin(satAngle) * 1.032
        // Apply the ring tilt to satellite position
        const raw = new THREE.Vector3(sx, 0, sz)
        raw.applyQuaternion(tiltQuat)
        sat.position.copy(raw)

        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animId)
        renderer.dispose()
        container.removeChild(renderer.domElement)
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', minHeight: 440, position: 'relative' }}>
      {/* Labels */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 16, height: 2, background: '#c8102e' }} />
          <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: '#c8102e', fontFamily: "'Inter',sans-serif" }}>VLEO — 180-250km (VAXON)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 16, height: 2, background: '#334466' }} />
          <span style={{ fontSize: '0.52rem', letterSpacing: '0.15em', color: '#334466', fontFamily: "'Inter',sans-serif" }}>LEO — 400-600km</span>
        </div>
      </div>
    </div>
  )
}
