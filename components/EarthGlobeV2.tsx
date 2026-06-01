'use client'
import { useEffect, useRef, useState } from 'react'

/* ─── ORBITAL MECHANICS ──────────────────────────────────── */
function keplerPosition(incDeg: number, raanDeg: number, altKm: number, phaseOffsetSec = 0): [number, number, number] {
  const MU = 3.986e14
  const r = (6371 + altKm) * 1000
  const T = 2 * Math.PI * Math.sqrt(r * r * r / MU)
  const now = Date.now() / 1000 + phaseOffsetSec
  const angle = ((now % T) / T) * 2 * Math.PI
  const inc = incDeg * Math.PI / 180
  const raan = raanDeg * Math.PI / 180
  const rNorm = (6371 + altKm) / 6371
  const xO = rNorm * Math.cos(angle)
  const yO = rNorm * Math.sin(angle)
  const x = xO * Math.cos(raan) - yO * Math.cos(inc) * Math.sin(raan)
  const y = xO * Math.sin(raan) + yO * Math.cos(inc) * Math.cos(raan)
  const z = yO * Math.sin(inc)
  return [x, z, -y]
}

/* ─── COVERAGE FOOTPRINT ─────────────────────────────────── */
function footprintPoints(satPos: [number,number,number], altKm: number): [number,number,number][] {
  const halfAngle = Math.acos(6371 / (6371 + altKm))
  const [sx, sy, sz] = satPos
  const len = Math.sqrt(sx*sx + sy*sy + sz*sz)
  const nx = sx/len, ny = sy/len, nz = sz/len
  let px = ny*0 - nz*1, py = nz*0 - nx*0, pz = nx*1 - ny*0
  const pLen = Math.sqrt(px*px+py*py+pz*pz)
  if (pLen > 0.001) { px/=pLen; py/=pLen; pz/=pLen } else { px=1;py=0;pz=0 }
  const p2x = ny*pz-nz*py, p2y = nz*px-nx*pz, p2z = nx*py-ny*px
  const pts: [number,number,number][] = []
  const R = 1.002
  for (let i = 0; i <= 64; i++) {
    const a = (i/64)*2*Math.PI
    const cosH = Math.cos(halfAngle), sinH = Math.sin(halfAngle)
    const cx = cosH*nx + sinH*(Math.cos(a)*px + Math.sin(a)*p2x)
    const cy = cosH*ny + sinH*(Math.cos(a)*py + Math.sin(a)*p2y)
    const cz = cosH*nz + sinH*(Math.cos(a)*pz + Math.sin(a)*p2z)
    pts.push([cx*R, cy*R, cz*R])
  }
  return pts
}

/* ─── CONSTELLATION ──────────────────────────────────────── */
const VAXON_SATS = [
  { inc:53, raan:0,   alt:220, phase:0 },
  { inc:53, raan:72,  alt:215, phase:1200 },
  { inc:53, raan:144, alt:210, phase:2400 },
  { inc:53, raan:216, alt:225, phase:3600 },
  { inc:53, raan:288, alt:218, phase:4800 },
]
const REF_SATS = [
  { inc:51.6, raan:45, alt:408, phase:0 },
  { inc:53,   raan:20, alt:550, phase:800 },
]

export default function EarthGlobeV2({ showFootprint = false, height = 500 }: { showFootprint?: boolean; height?: number }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const fpRef = useRef(showFootprint)
  fpRef.current = showFootprint
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return
    let animId: number
    let renderer: any
    let disposed = false

    ;(async () => {
      const THREE = await import('three')
      if (disposed) return

      const container = mountRef.current!
      const W = container.clientWidth || 600
      const H = height

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 100)
      camera.position.set(0, 0.5, 3.2)
      camera.lookAt(0, 0, 0)

      /* Lights */
      const sun = new THREE.DirectionalLight(0xfff5e0, 3.2)
      sun.position.set(5, 2, 3)
      scene.add(sun)
      scene.add(new THREE.AmbientLight(0x0d1a33, 1.5))

      /* ── Earth — solid fallback, upgrades to textured ── */
      const earthGeo = new THREE.SphereGeometry(1, 96, 96)

      // Start with a solid blue-green Earth immediately
      const earthMat = new THREE.MeshPhongMaterial({
        color: 0x1a4a6e,
        emissive: 0x0a1a2e,
        shininess: 25,
        specular: 0x224466,
      })
      const earthMesh = new THREE.Mesh(earthGeo, earthMat)
      scene.add(earthMesh)

      /* Atmosphere (renders immediately, no textures needed) */
      const atmGeo = new THREE.SphereGeometry(1.055, 64, 64)
      const atmMat = new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: sun.position.clone().normalize() } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          void main(){
            vNormal = normalize(normalMatrix * normal);
            vPos = (modelMatrix * vec4(position,1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform vec3 sunDir;
          void main(){
            vec3 view = normalize(cameraPosition - vPos);
            float rim = 1.0 - abs(dot(vNormal, view));
            float intensity = pow(rim, 3.0);
            float sun = dot(normalize(vNormal), normalize(sunDir));
            float day = smoothstep(-0.3, 0.5, sun);
            vec3 col = mix(vec3(0.05,0.08,0.3), vec3(0.2,0.5,1.0), day);
            gl_FragColor = vec4(col, intensity * 0.88);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      })
      scene.add(new THREE.Mesh(atmGeo, atmMat))

      /* Outer halo */
      const haloGeo = new THREE.SphereGeometry(1.12, 32, 32)
      const haloMat = new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vN; void main(){ float r=pow(1.0-abs(dot(vN,vec3(0,0,1))),5.0); gl_FragColor=vec4(0.15,0.45,1.0,r*0.3); }`,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      })
      scene.add(new THREE.Mesh(haloGeo, haloMat))

      /* Orbit rings */
      const addRing = (altKm: number, color: number, opacity: number) => {
        const r = (6371 + altKm) / 6371
        const g = new THREE.TorusGeometry(r, 0.002, 8, 300)
        const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
        const mesh = new THREE.Mesh(g, m)
        mesh.rotation.x = Math.PI / 2
        scene.add(mesh)
      }
      addRing(220, 0xc8102e, 0.55)
      addRing(408, 0x4488cc, 0.25)
      addRing(550, 0x336644, 0.18)

      /* Stars */
      const sv: number[] = []
      for (let i = 0; i < 2000; i++) {
        const r2 = 30 + Math.random() * 20
        const t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1)
        sv.push(r2*Math.sin(p)*Math.cos(t), r2*Math.sin(p)*Math.sin(t), r2*Math.cos(p))
      }
      const sg = new THREE.BufferGeometry()
      sg.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3))
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.055, transparent: true, opacity: 0.75 })))

      /* Satellites */
      const satMeshes: { mesh: any; sat: typeof VAXON_SATS[0]; isVaxon: boolean }[] = []
      const trails: { line: any; pts: [number,number,number][] }[] = []

      for (const sat of VAXON_SATS) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), new THREE.MeshBasicMaterial({ color: 0xc8102e }))
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 8), new THREE.MeshBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.2 }))
        m.add(glow)
        scene.add(m)
        const lineGeo = new THREE.BufferGeometry()
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.35 }))
        scene.add(line)
        satMeshes.push({ mesh: m, sat, isVaxon: true })
        trails.push({ line, pts: [] })
      }
      for (const sat of REF_SATS) {
        const col = sat.alt < 500 ? 0x4488cc : 0x336644
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), new THREE.MeshBasicMaterial({ color: col }))
        scene.add(m)
        satMeshes.push({ mesh: m, sat, isVaxon: false })
        trails.push({ line: null, pts: [] })
      }

      /* Coverage footprint */
      const fpGeo = new THREE.BufferGeometry()
      const fpLine = new THREE.Line(fpGeo, new THREE.LineBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.7 }))
      fpLine.visible = false
      scene.add(fpLine)
      const fillGeo = new THREE.BufferGeometry()
      const fillMesh = new THREE.Mesh(fillGeo, new THREE.MeshBasicMaterial({ color: 0xc8102e, transparent: true, opacity: 0.07, side: THREE.FrontSide, depthWrite: false }))
      fillMesh.visible = false
      scene.add(fillMesh)

      /* Start rendering IMMEDIATELY — before textures load */
      setLoading(false)

      /* Load textures in background, upgrade Earth when ready */
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = 'anonymous'

      // Try multiple CDN sources in parallel, use first to resolve
      const tryLoad = (urls: string[]): Promise<any> => {
        return new Promise(resolve => {
          let settled = false
          let tried = 0
          for (const url of urls) {
            loader.loadAsync(url)
              .then(tex => { if (!settled) { settled = true; resolve(tex) } })
              .catch(() => { tried++; if (tried === urls.length && !settled) resolve(null) })
          }
        })
      }

      const [dayTex, nightTex, cloudTex] = await Promise.all([
        tryLoad([
          'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
          'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
        ]),
        tryLoad([
          'https://unpkg.com/three-globe/example/img/earth-night.jpg',
          'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
        ]),
        tryLoad([
          'https://unpkg.com/three-globe/example/img/earth-clouds.png',
          'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
        ]),
      ])

      if (disposed) return

      if (dayTex) {
        // Upgrade to shader-based day/night Earth
        const shaderMat = new THREE.ShaderMaterial({
          uniforms: {
            dayTex: { value: dayTex },
            nightTex: { value: nightTex },
            cloudTex: { value: cloudTex },
            sunDir: { value: sun.position.clone().normalize() },
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main(){
              vUv = uv;
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D dayTex;
            uniform sampler2D nightTex;
            uniform sampler2D cloudTex;
            uniform vec3 sunDir;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main(){
              vec4 day   = texture2D(dayTex,   vUv);
              vec4 night = texture2D(nightTex, vUv);
              float sunDot = dot(normalize(vNormal), normalize(sunDir));
              float blend  = smoothstep(-0.18, 0.32, sunDot);
              vec3 earth   = mix(night.rgb * 2.0, day.rgb, blend);
              // specular on ocean
              earth += vec3(0.4,0.6,1.0) * pow(max(0.0,sunDot), 52.0) * 0.2 * blend;
              // clouds
              ${cloudTex ? `
              vec4 cloud = texture2D(cloudTex, vUv);
              vec3 cloudCol = mix(vec3(0.05), vec3(1.0), blend) * cloud.r;
              earth = mix(earth, cloudCol, cloud.r * 0.7);
              ` : ''}
              gl_FragColor = vec4(earth, 1.0);
            }
          `,
        })
        ;(earthMesh as any).material = shaderMat
      }

      /* Resize */
      const onResize = () => {
        const w = container.clientWidth || 600
        camera.aspect = w / height
        camera.updateProjectionMatrix()
        renderer.setSize(w, height)
      }
      window.addEventListener('resize', onResize)

      /* Animation loop */
      let frame = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        frame++
        earthMesh.rotation.y += 0.0007

        if (frame % 2 === 0) {
          satMeshes.forEach(({ mesh, sat, isVaxon }, i) => {
            const [x, y, z] = keplerPosition(sat.inc, sat.raan, sat.alt, sat.phase || 0)
            mesh.position.set(x, y, z)
            if (isVaxon) {
              const trail = trails[i]
              trail.pts.unshift([x, y, z])
              if (trail.pts.length > 80) trail.pts.pop()
              if (trail.line && trail.pts.length > 2) {
                trail.line.geometry.setFromPoints(trail.pts.map((p: [number,number,number]) => new THREE.Vector3(p[0], p[1], p[2])))
              }
            }
          })

          const show = fpRef.current
          fpLine.visible = show
          fillMesh.visible = show
          if (show && satMeshes[0]) {
            const p = satMeshes[0].mesh.position
            const pts = footprintPoints([p.x, p.y, p.z], VAXON_SATS[0].alt)
            fpGeo.setFromPoints(pts.map((pt: [number,number,number]) => new THREE.Vector3(pt[0], pt[1], pt[2])))
            const nadir = satMeshes[0].mesh.position.clone().normalize().multiplyScalar(1.001)
            const fv: number[] = []
            for (let j = 0; j < pts.length - 1; j++) {
              fv.push(nadir.x, nadir.y, nadir.z, pts[j][0], pts[j][1], pts[j][2], pts[j+1][0], pts[j+1][1], pts[j+1][2])
            }
            fillGeo.setAttribute('position', new THREE.Float32BufferAttribute(fv, 3))
          }
        }
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('resize', onResize)
      }
    })().catch(console.error)

    return () => {
      disposed = true
      cancelAnimationFrame(animId)
      if (renderer) {
        renderer.dispose()
        const el = renderer.domElement
        if (el?.parentNode) el.parentNode.removeChild(el)
      }
    }
  }, [height])

  return (
    <div ref={mountRef} style={{ width: '100%', height, position: 'relative', background: 'transparent' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 160-i*30, height: 5, background: '#0d0d1a', borderRadius: 2, animation: 'vx-skel 1.5s ease infinite', animationDelay: `${i*0.2}s` }} />
          ))}
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#2a2a3e', fontFamily: "'Inter',sans-serif", marginTop: '0.5rem' }}>INITIALIZING ORBIT MODEL</div>
        </div>
      )}
      {!loading && (
        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { col: '#c8102e', label: 'VLEO 180–250km (VAXON)' },
            { col: '#4488cc', label: 'ISS ~408km' },
            { col: '#336644', label: 'Starlink ~550km' },
          ].map(({ col, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 16, height: 2, background: col }} />
              <span style={{ fontSize: '0.5rem', letterSpacing: '0.13em', color: col, fontFamily: "'Inter',sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
