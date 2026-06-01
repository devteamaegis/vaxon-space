'use client'
import { useEffect, useRef, useState } from 'react'

/* ─────────────────────────────────────────────────────────────
   SATELLITE ORBITAL MECHANICS (Keplerian, no external deps)
   All positions computed analytically from current UTC time.
───────────────────────────────────────────────────────────────*/
function keplerPosition(
  incDeg: number,    // inclination degrees
  raanDeg: number,   // right ascension of ascending node degrees
  altKm: number,     // orbital altitude km
  phaseOffsetSec: number = 0
): [number, number, number] {
  const R_EARTH = 6371
  const MU = 3.986e14  // Earth gravitational parameter m³/s²
  const r = (R_EARTH + altKm) * 1000  // orbit radius in meters
  const T = 2 * Math.PI * Math.sqrt(r * r * r / MU)  // period in seconds
  const now = Date.now() / 1000 + phaseOffsetSec
  const angle = ((now % T) / T) * 2 * Math.PI

  const inc = incDeg * Math.PI / 180
  const raan = raanDeg * Math.PI / 180
  const rNorm = (R_EARTH + altKm) / R_EARTH  // normalized to Earth radius

  const xOrb = rNorm * Math.cos(angle)
  const yOrb = rNorm * Math.sin(angle)

  const x = xOrb * Math.cos(raan) - yOrb * Math.cos(inc) * Math.sin(raan)
  const y = xOrb * Math.sin(raan) + yOrb * Math.cos(inc) * Math.cos(raan)
  const z = yOrb * Math.sin(inc)

  return [x, z, -y]  // convert to Three.js coordinate system (Y-up)
}

/* ─────────────────────────────────────────────────────────────
   CONSTELLATION DEFINITION
   5 Vaxon VLEO satellites in different orbital planes
   2 reference satellites (ISS-like, Starlink-like)
───────────────────────────────────────────────────────────────*/
const VAXON_SATS = [
  { inc: 53, raan: 0,   alt: 220, phase: 0,      color: 0xc8102e, label: 'VS-01' },
  { inc: 53, raan: 72,  alt: 215, phase: 1200,   color: 0xc8102e, label: 'VS-02' },
  { inc: 53, raan: 144, alt: 210, phase: 2400,   color: 0xc8102e, label: 'VS-03' },
  { inc: 53, raan: 216, alt: 225, phase: 3600,   color: 0xc8102e, label: 'VS-04' },
  { inc: 53, raan: 288, alt: 218, phase: 4800,   color: 0xc8102e, label: 'VS-05' },
]

const REF_SATS = [
  { inc: 51.6, raan: 45,  alt: 408, phase: 0,    color: 0x4488cc, label: 'ISS' },
  { inc: 53,   raan: 20,  alt: 550, phase: 800,  color: 0x336644, label: 'LEO' },
]

/* ─────────────────────────────────────────────────────────────
   COVERAGE FOOTPRINT GEOMETRY
   Creates a circle on Earth's surface below a satellite
───────────────────────────────────────────────────────────────*/
function coverageFootprintPoints(satPos: [number,number,number], altKm: number): [number,number,number][] {
  const R = 6371
  const halfAngle = Math.acos(R / (R + altKm))  // Earth-center half-angle of coverage
  const satVec = [satPos[0], satPos[1], satPos[2]]
  const len = Math.sqrt(satVec[0]**2 + satVec[1]**2 + satVec[2]**2)
  const nadirX = satVec[0]/len, nadirY = satVec[1]/len, nadirZ = satVec[2]/len

  // Build orthonormal basis perpendicular to nadir
  const up = [0,1,0]
  let perpX = up[1]*nadirZ - up[2]*nadirY, perpY = up[2]*nadirX - up[0]*nadirZ, perpZ = up[0]*nadirY - up[1]*nadirX
  const pLen = Math.sqrt(perpX**2+perpY**2+perpZ**2)
  if (pLen < 0.001) { perpX=1; perpY=0; perpZ=0 } else { perpX/=pLen; perpY/=pLen; perpZ/=pLen }
  const perpX2 = nadirY*perpZ-nadirZ*perpY, perpY2 = nadirZ*perpX-nadirX*perpZ, perpZ2 = nadirX*perpY-nadirY*perpX

  const SEGMENTS = 64
  const R_NORM = 1.002  // slightly above Earth surface
  const points: [number,number,number][] = []
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * 2 * Math.PI
    const sinA = Math.sin(halfAngle), cosA = Math.cos(halfAngle)
    const cx = cosA * nadirX + sinA * (Math.cos(angle) * perpX + Math.sin(angle) * perpX2)
    const cy = cosA * nadirY + sinA * (Math.cos(angle) * perpY + Math.sin(angle) * perpY2)
    const cz = cosA * nadirZ + sinA * (Math.cos(angle) * perpZ + Math.sin(angle) * perpZ2)
    points.push([cx * R_NORM, cy * R_NORM, cz * R_NORM])
  }
  return points
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────*/
interface Props {
  showFootprint?: boolean
  height?: number
}

export default function EarthGlobeV2({ showFootprint = false, height = 500 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const showFootprintRef = useRef(showFootprint)
  showFootprintRef.current = showFootprint
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return
    let animId: number
    let renderer: any
    let cleanup: (() => void) | undefined

    const init = async () => {
      const THREE = await import('three')
      const container = mountRef.current!
      const W = container.clientWidth || 600
      const H = height

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 100)
      camera.position.set(0, 0.4, 3.0)
      camera.lookAt(0, 0, 0)

      /* ── LIGHTS ── */
      const sunLight = new THREE.DirectionalLight(0xfff4e0, 3.5)
      sunLight.position.set(5, 2, 3)
      scene.add(sunLight)
      scene.add(new THREE.AmbientLight(0x112244, 0.8))

      /* ── LOAD TEXTURES ── */
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = 'anonymous'

      const [dayTex, nightTex, cloudTex] = await Promise.all([
        loader.loadAsync('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
        loader.loadAsync('https://unpkg.com/three-globe/example/img/earth-night.jpg'),
        loader.loadAsync('https://unpkg.com/three-globe/example/img/earth-clouds.png'),
      ])

      setLoading(false)

      /* ── EARTH WITH DAY/NIGHT SHADER ── */
      const earthGeo = new THREE.SphereGeometry(1, 128, 128)
      const earthMat = new THREE.ShaderMaterial({
        uniforms: {
          dayTexture:   { value: dayTex },
          nightTexture: { value: nightTex },
          cloudTexture: { value: cloudTex },
          sunDirection: { value: sunLight.position.clone().normalize() },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform sampler2D cloudTexture;
          uniform vec3 sunDirection;
          varying vec2 vUv;
          varying vec3 vNormal;

          void main() {
            vec4 day   = texture2D(dayTexture,   vUv);
            vec4 night = texture2D(nightTexture, vUv);
            vec4 cloud = texture2D(cloudTexture, vUv);

            float sunDot = dot(normalize(vNormal), normalize(sunDirection));
            float blend  = smoothstep(-0.2, 0.35, sunDot);

            // Night: city lights boosted; day: normal color
            vec3 nightColor = night.rgb * 2.2;
            vec3 earth = mix(nightColor, day.rgb, blend);

            // Atmospheric diffuse on day side
            float diff = max(0.0, sunDot);
            earth += vec3(0.04, 0.06, 0.08) * diff;

            // Cloud layer — white on day, dim on night
            float cloudAlpha = cloud.r * 0.75;
            vec3 cloudColor = mix(vec3(0.05, 0.05, 0.1), vec3(1.0), blend) * cloud.r;
            earth = mix(earth, cloudColor, cloudAlpha);

            // Specular highlight on water (day side only)
            float spec = pow(max(0.0, sunDot), 48.0) * 0.25 * blend;
            earth += vec3(0.5, 0.7, 1.0) * spec;

            gl_FragColor = vec4(earth, 1.0);
          }
        `,
      })
      const earthMesh = new THREE.Mesh(earthGeo, earthMat)
      scene.add(earthMesh)

      /* ── ATMOSPHERE (Rayleigh rim glow) ── */
      const atmGeo = new THREE.SphereGeometry(1.055, 64, 64)
      const atmMat = new THREE.ShaderMaterial({
        uniforms: { sunDirection: { value: sunLight.position.clone().normalize() } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          uniform vec3 sunDirection;

          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float rim = 1.0 - abs(dot(vNormal, viewDir));
            float intensity = pow(rim, 3.2);

            float sunAngle = dot(normalize(vNormal), normalize(sunDirection));
            float dayFactor = smoothstep(-0.3, 0.5, sunAngle);

            // Blue-cyan atmosphere on day, deep blue on night terminator
            vec3 dayAtm   = vec3(0.25, 0.55, 1.0);
            vec3 nightAtm = vec3(0.05, 0.08, 0.25);
            vec3 color = mix(nightAtm, dayAtm, dayFactor);

            gl_FragColor = vec4(color, intensity * 0.9);
          }
        `,
        blending: (typeof THREE !== 'undefined') ? THREE.AdditiveBlending : undefined,
        side: (typeof THREE !== 'undefined') ? THREE.BackSide : undefined,
        transparent: true,
        depthWrite: false,
      } as any)
      const atmosphere = new THREE.Mesh(atmGeo, atmMat)
      scene.add(atmosphere)

      /* ── OUTER GLOW HALO ── */
      const haloGeo = new THREE.SphereGeometry(1.12, 32, 32)
      const haloMat = new THREE.ShaderMaterial({
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
            vec3 viewDir = normalize(cameraPosition - vNormal);
            float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 5.0);
            gl_FragColor = vec4(0.15, 0.45, 1.0, rim * 0.35);
          }
        `,
        blending: (typeof THREE !== 'undefined') ? THREE.AdditiveBlending : undefined,
        side: (typeof THREE !== 'undefined') ? THREE.BackSide : undefined,
        transparent: true,
        depthWrite: false,
      } as any)
      scene.add(new THREE.Mesh(haloGeo, haloMat))

      /* ── ORBIT RINGS ── */
      const makeRing = (altKm: number, color: number, opacity: number) => {
        const r = (6371 + altKm) / 6371
        const geo = new THREE.TorusGeometry(r, 0.002, 8, 300)
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.x = Math.PI / 2
        return mesh
      }
      scene.add(makeRing(220, 0xc8102e, 0.55))   // Vaxon VLEO
      scene.add(makeRing(408, 0x4488cc, 0.3))    // ISS altitude
      scene.add(makeRing(550, 0x336644, 0.2))    // Starlink altitude

      /* ── STARS ── */
      const starVerts: number[] = []
      for (let i = 0; i < 2000; i++) {
        const r2 = 30 + Math.random() * 20
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        starVerts.push(r2 * Math.sin(phi) * Math.cos(theta), r2 * Math.sin(phi) * Math.sin(theta), r2 * Math.cos(phi))
      }
      const starGeo = new THREE.BufferGeometry()
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3))
      scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8 })))

      /* ── VAXON SATELLITE DOTS + TRAILS ── */
      const satMeshes: any[] = []
      const trailLines: { line: any; points: [number,number,number][] }[] = []

      for (const sat of VAXON_SATS) {
        // Dot
        const geo = new THREE.SphereGeometry(0.018, 8, 8)
        const mat = new THREE.MeshBasicMaterial({ color: sat.color })
        const mesh = new THREE.Mesh(geo, mat)
        scene.add(mesh)
        satMeshes.push({ mesh, sat })

        // Glow halo around satellite
        const glowGeo = new THREE.SphereGeometry(0.035, 8, 8)
        const glowMat = new THREE.MeshBasicMaterial({ color: sat.color, transparent: true, opacity: 0.25 })
        const glow = new THREE.Mesh(glowGeo, glowMat)
        mesh.add(glow)

        // Trail
        const trailPts: [number,number,number][] = []
        const trailGeo = new THREE.BufferGeometry()
        const trailMat = new THREE.LineBasicMaterial({ color: sat.color, transparent: true, opacity: 0.4 })
        const line = new THREE.Line(trailGeo, trailMat)
        scene.add(line)
        trailLines.push({ line, points: trailPts })
      }

      // ISS + reference sats
      for (const sat of REF_SATS) {
        const geo = new THREE.SphereGeometry(0.012, 8, 8)
        const mat = new THREE.MeshBasicMaterial({ color: sat.color })
        const mesh = new THREE.Mesh(geo, mat)
        scene.add(mesh)
        satMeshes.push({ mesh, sat })
        trailLines.push({ line: null, points: [] })
      }

      /* ── COVERAGE FOOTPRINT ── */
      const footprintMat = new THREE.LineBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.6 })
      const footprintGeo = new THREE.BufferGeometry()
      const footprintLine = new THREE.Line(footprintGeo, footprintMat)
      footprintLine.visible = false
      scene.add(footprintLine)

      // Coverage fill disc
      const fillMat = new THREE.MeshBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.06, side: (typeof THREE !== 'undefined') ? THREE.FrontSide : undefined, depthWrite: false })
      const fillGeo = new THREE.BufferGeometry()
      const fillMesh = new THREE.Mesh(fillGeo, fillMat as any)
      fillMesh.visible = false
      scene.add(fillMesh)

      /* ── RESIZE ── */
      const onResize = () => {
        const w = container.clientWidth || 600
        const h = height
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      /* ── ANIMATION LOOP ── */
      let frame = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        frame++

        // Slow earth rotation
        earthMesh.rotation.y += 0.0008
        // atmosphere stays fixed relative to earth
        atmosphere.rotation.y = earthMesh.rotation.y

        // Update satellite positions every 2 frames
        if (frame % 2 === 0) {
          satMeshes.forEach(({ mesh, sat }, i) => {
            const [x, y, z] = keplerPosition(sat.inc, sat.raan, sat.alt, sat.phase || 0)
            mesh.position.set(x, y, z)

            // Update trail for Vaxon sats
            if (i < VAXON_SATS.length) {
              const trail = trailLines[i]
              trail.points.unshift([x, y, z])
              if (trail.points.length > 80) trail.points.pop()

              if (trail.line && trail.points.length > 2) {
                const pts = trail.points.map(p => new THREE.Vector3(p[0], p[1], p[2]))
                trail.line.geometry.setFromPoints(pts)
              }
            }
          })

          // Update footprint for VS-01
          const show = showFootprintRef.current
          footprintLine.visible = show
          fillMesh.visible = show
          if (show && satMeshes[0]) {
            const p = satMeshes[0].mesh.position
            const pts = coverageFootprintPoints([p.x, p.y, p.z], VAXON_SATS[0].alt)
            const verts = pts.map(pt => new THREE.Vector3(pt[0], pt[1], pt[2]))
            footprintGeo.setFromPoints(verts)

            // Fan fill from nadir
            const nadirNorm = p.clone().normalize().multiplyScalar(1.001)
            const fillVerts: number[] = []
            for (let j = 0; j < pts.length - 1; j++) {
              fillVerts.push(nadirNorm.x, nadirNorm.y, nadirNorm.z)
              fillVerts.push(pts[j][0], pts[j][1], pts[j][2])
              fillVerts.push(pts[j+1][0], pts[j+1][1], pts[j+1][2])
            }
            fillGeo.setAttribute('position', new THREE.Float32BufferAttribute(fillVerts, 3))
          }
        }

        renderer.render(scene, camera)
      }
      animate()

      cleanup = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      }
    }

    init().catch(console.error)
    return () => cleanup?.()
  }, [height])

  return (
    <div ref={mountRef} style={{ width: '100%', height, position: 'relative', background: 'transparent' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 160 - i*30, height: 5, background: '#0d0d1a', borderRadius: 2, animation: 'vx-skel 1.5s ease infinite', animationDelay: `${i*0.2}s` }} />
          ))}
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#2a2a3e', fontFamily: "'Inter',sans-serif", marginTop: '0.5rem' }}>LOADING EARTH MODEL</div>
        </div>
      )}

      {/* Orbit legend */}
      {!loading && (
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { color: '#c8102e', label: 'VLEO 180–250km (VAXON)' },
            { color: '#4488cc', label: 'ISS ~408km' },
            { color: '#336644', label: 'Starlink ~550km' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 18, height: 2, background: color }} />
              <span style={{ fontSize: '0.5rem', letterSpacing: '0.14em', color, fontFamily: "'Inter',sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
