'use client'
import { useEffect, useRef, useState } from 'react'

/* ───────────────────────────────────────────────────────────
   VISUAL SCALE
   Earth radius = 1.0 in scene units. Real altitudes are tiny
   vs Earth's 6371km radius, so we exaggerate altitude by a
   constant factor to make the VLEO / ISS / Starlink gap legible
   while preserving their true ratios.
─────────────────────────────────────────────────────────────*/
const ALT_EXAG = 4.6
const visRadius = (altKm: number) => 1 + (altKm / 6371) * ALT_EXAG

/* Time acceleration: 1 real second = TIME_SCALE simulated seconds.
   A VLEO orbit (~88 min) then completes in ~14s on screen. */
const TIME_SCALE = 380

/* ───────────────────────────────────────────────────────────
   ORBITAL MECHANICS — real Kepler period, exaggerated radius
─────────────────────────────────────────────────────────────*/
function keplerPosition(incDeg: number, raanDeg: number, altKm: number, phaseOffsetSec = 0): [number, number, number] {
  const MU = 3.986e14
  const r = (6371 + altKm) * 1000
  const T = 2 * Math.PI * Math.sqrt((r * r * r) / MU) // true period (s)
  const t = (Date.now() / 1000) * TIME_SCALE + phaseOffsetSec
  const angle = ((t % T) / T) * 2 * Math.PI
  const inc = (incDeg * Math.PI) / 180
  const raan = (raanDeg * Math.PI) / 180
  const rNorm = visRadius(altKm)
  const xO = rNorm * Math.cos(angle)
  const yO = rNorm * Math.sin(angle)
  const x = xO * Math.cos(raan) - yO * Math.cos(inc) * Math.sin(raan)
  const y = xO * Math.sin(raan) + yO * Math.cos(inc) * Math.cos(raan)
  const z = yO * Math.sin(inc)
  return [x, z, -y]
}

/* ───────────────────────────────────────────────────────────
   COVERAGE FOOTPRINT (physical cone half-angle)
─────────────────────────────────────────────────────────────*/
function footprintPoints(satPos: [number, number, number], altKm: number): [number, number, number][] {
  const halfAngle = Math.acos(6371 / (6371 + altKm))
  const [sx, sy, sz] = satPos
  const len = Math.sqrt(sx * sx + sy * sy + sz * sz)
  const nx = sx / len, ny = sy / len, nz = sz / len
  let px = ny * 0 - nz * 1, py = nz * 0 - nx * 0, pz = nx * 1 - ny * 0
  const pLen = Math.sqrt(px * px + py * py + pz * pz)
  if (pLen > 0.001) { px /= pLen; py /= pLen; pz /= pLen } else { px = 1; py = 0; pz = 0 }
  const p2x = ny * pz - nz * py, p2y = nz * px - nx * pz, p2z = nx * py - ny * px
  const pts: [number, number, number][] = []
  const R = 1.003
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI
    const cosH = Math.cos(halfAngle), sinH = Math.sin(halfAngle)
    const cx = cosH * nx + sinH * (Math.cos(a) * px + Math.sin(a) * p2x)
    const cy = cosH * ny + sinH * (Math.cos(a) * py + Math.sin(a) * p2y)
    const cz = cosH * nz + sinH * (Math.cos(a) * pz + Math.sin(a) * p2z)
    pts.push([cx * R, cy * R, cz * R])
  }
  return pts
}

/* ───────────────────────────────────────────────────────────
   CONSTELLATIONS
─────────────────────────────────────────────────────────────*/
const VAXON_SATS = [
  { inc: 53, raan: 0, alt: 220, phase: 0 },
  { inc: 53, raan: 72, alt: 215, phase: 1200 },
  { inc: 53, raan: 144, alt: 210, phase: 2400 },
  { inc: 53, raan: 216, alt: 225, phase: 3600 },
  { inc: 53, raan: 288, alt: 218, phase: 4800 },
]
const ISS_SATS = [
  { inc: 51.6, raan: 130, alt: 408, phase: 0 },
]
const STARLINK_SATS = [
  { inc: 53, raan: 20, alt: 550, phase: 0 },
  { inc: 53, raan: 95, alt: 552, phase: 1600 },
  { inc: 53, raan: 200, alt: 548, phase: 3200 },
  { inc: 53, raan: 300, alt: 551, phase: 4400 },
]

const COL = {
  vaxon: 0xff2d4b,
  iss: 0x4aa3ff,
  starlink: 0x35d07f,
}

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

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.outputColorSpace = THREE.SRGBColorSpace
      container.appendChild(renderer.domElement)
      const maxAniso = renderer.capabilities.getMaxAnisotropy()

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100)
      camera.position.set(0.2, 0.35, 3.25)
      camera.lookAt(0, 0, 0)

      /* ── Lighting ── */
      const sunDirWorld = new THREE.Vector3(5, 1.6, 3).normalize()
      const sun = new THREE.DirectionalLight(0xfff4e2, 3.0)
      sun.position.copy(sunDirWorld.clone().multiplyScalar(10))
      scene.add(sun)
      scene.add(new THREE.AmbientLight(0x16243f, 1.1))
      // subtle blue fill from the opposite side (earthshine)
      const fill = new THREE.DirectionalLight(0x2a4a7a, 0.5)
      fill.position.set(-4, -1, -3)
      scene.add(fill)

      /* ── Tilted planet group (23.5° axial tilt) ── */
      const planet = new THREE.Group()
      planet.rotation.z = (23.5 * Math.PI) / 180
      scene.add(planet)

      /* ── Earth (solid fallback first) ── */
      const earthGeo = new THREE.SphereGeometry(1, 128, 128)
      const earthMat = new THREE.MeshPhongMaterial({
        color: 0x12365a, emissive: 0x06101f, shininess: 18, specular: 0x1a3a5a,
      })
      const earthMesh = new THREE.Mesh(earthGeo, earthMat)
      planet.add(earthMesh)

      /* ── Cloud layer (separate sphere, upgrades when texture ready) ── */
      const cloudGeo = new THREE.SphereGeometry(1.006, 96, 96)
      const cloudMat = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0, depthWrite: false })
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
      planet.add(cloudMesh)

      /* ── Atmosphere rim (day-side scatter) ── */
      const atmGeo = new THREE.SphereGeometry(1.045, 80, 80)
      const atmMat = new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: sunDirWorld.clone() } },
        vertexShader: `
          varying vec3 vNormal; varying vec3 vWorld;
          void main(){
            vNormal = normalize(mat3(modelMatrix) * normal);
            vWorld  = (modelMatrix * vec4(position,1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }`,
        fragmentShader: `
          varying vec3 vNormal; varying vec3 vWorld; uniform vec3 sunDir;
          void main(){
            vec3 view = normalize(cameraPosition - vWorld);
            float rim = pow(1.0 - abs(dot(vNormal, view)), 3.2);
            float sd  = dot(normalize(vNormal), normalize(sunDir));
            float day = smoothstep(-0.45, 0.55, sd);
            vec3 dayCol  = vec3(0.25, 0.55, 1.0);
            vec3 duskCol = vec3(1.0, 0.45, 0.25);
            float dusk = smoothstep(0.0, 0.25, sd) * (1.0 - smoothstep(0.25, 0.7, sd));
            vec3 col = mix(vec3(0.04,0.07,0.22), dayCol, day) + duskCol * dusk * 0.5;
            gl_FragColor = vec4(col, rim * (0.35 + 0.65*day));
          }`,
        blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true, depthWrite: false,
      })
      scene.add(new THREE.Mesh(atmGeo, atmMat))

      /* ── Outer halo ── */
      const haloMat = new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
        fragmentShader: `varying vec3 vN; void main(){ float r=pow(1.0-abs(dot(vN,vec3(0,0,1))),5.5); gl_FragColor=vec4(0.16,0.42,1.0,r*0.22);} `,
        blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true, depthWrite: false,
      })
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.12, 48, 48), haloMat))

      /* ── Orbit rings (inclined, exaggerated, glowing) ── */
      const addRing = (altKm: number, incDeg: number, raanDeg: number, color: number, opacity: number, glow: number) => {
        const r = visRadius(altKm)
        const pts: any[] = []
        const inc = (incDeg * Math.PI) / 180, raan = (raanDeg * Math.PI) / 180
        for (let i = 0; i <= 256; i++) {
          const a = (i / 256) * Math.PI * 2
          const xO = r * Math.cos(a), yO = r * Math.sin(a)
          const x = xO * Math.cos(raan) - yO * Math.cos(inc) * Math.sin(raan)
          const y = xO * Math.sin(raan) + yO * Math.cos(inc) * Math.cos(raan)
          const z = yO * Math.sin(inc)
          pts.push(new THREE.Vector3(x, z, -y))
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts)
        const core = new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
        scene.add(core)
        // additive glow halo line (slightly larger torus look via second pass)
        const glowLine = new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: glow, blending: THREE.AdditiveBlending }))
        glowLine.scale.setScalar(1.004)
        scene.add(glowLine)
      }
      addRing(220, 53, 0, COL.vaxon, 0.85, 0.4)
      addRing(408, 51.6, 130, COL.iss, 0.45, 0.18)
      addRing(550, 53, 20, COL.starlink, 0.38, 0.15)

      /* ── Stars ── */
      const sv: number[] = []
      for (let i = 0; i < 2600; i++) {
        const r2 = 34 + Math.random() * 22
        const t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1)
        sv.push(r2 * Math.sin(p) * Math.cos(t), r2 * Math.sin(p) * Math.sin(t), r2 * Math.cos(p))
      }
      const sg = new THREE.BufferGeometry()
      sg.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3))
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8, sizeAttenuation: true })))

      /* ── Satellites + comet trails (all tiers) ── */
      type SatDef = { inc: number; raan: number; alt: number; phase: number }
      type SatRec = { mesh: any; def: SatDef; tier: 'vaxon' | 'iss' | 'starlink'; trail: any; pts: [number, number, number][] }
      const sats: SatRec[] = []

      // round camera-facing glow sprite texture
      const makeGlowTex = (hex: number) => {
        const c = document.createElement('canvas'); c.width = c.height = 64
        const ctx = c.getContext('2d')!
        const col = new THREE.Color(hex)
        const r = Math.round(col.r * 255), g = Math.round(col.g * 255), b = Math.round(col.b * 255)
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
        grad.addColorStop(0.3, `rgba(${r},${g},${b},0.7)`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64)
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
      }
      const glowTex = { vaxon: makeGlowTex(COL.vaxon), iss: makeGlowTex(COL.iss), starlink: makeGlowTex(COL.starlink) }

      const addSat = (def: SatDef, tier: 'vaxon' | 'iss' | 'starlink', size: number, trailLen: number) => {
        const color = COL[tier]
        const grp = new THREE.Group()
        // bright core
        const core = new THREE.Mesh(new THREE.SphereGeometry(size, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }))
        grp.add(core)
        // sprite glow
        const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex[tier], transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
        spr.scale.setScalar(size * 7)
        grp.add(spr)
        scene.add(grp)
        // comet trail with fading vertex colors
        const tg = new THREE.BufferGeometry()
        const tm = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
        const trail = new THREE.Line(tg, tm)
        scene.add(trail)
        sats.push({ mesh: grp, def, tier, trail, pts: [] })
        ;(trail as any)._len = trailLen
        ;(trail as any)._color = new THREE.Color(color)
      }

      VAXON_SATS.forEach(s => addSat(s, 'vaxon', 0.02, 90))
      ISS_SATS.forEach(s => addSat(s, 'iss', 0.015, 70))
      STARLINK_SATS.forEach(s => addSat(s, 'starlink', 0.013, 60))

      /* ── Coverage footprint ── */
      const fpLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COL.vaxon, transparent: true, opacity: 0.8 }))
      fpLine.visible = false; scene.add(fpLine)
      const fillMesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: COL.vaxon, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false }))
      fillMesh.visible = false; scene.add(fillMesh)

      /* Render immediately */
      setLoading(false)

      /* ── Load textures in background, upgrade Earth ── */
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = 'anonymous'
      const tryLoad = (urls: string[]): Promise<any> => new Promise(resolve => {
        let settled = false, tried = 0
        for (const url of urls) {
          loader.loadAsync(url)
            .then(tex => { if (!settled) { settled = true; resolve(tex) } })
            .catch(() => { tried++; if (tried === urls.length && !settled) resolve(null) })
        }
      })
      const setColor = (t: any) => { if (t) { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso } return t }
      const setLinear = (t: any) => { if (t) { t.anisotropy = maxAniso } return t }

      const [dayTex, nightTex, cloudTex, specTex] = await Promise.all([
        tryLoad(['https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg']).then(setColor),
        tryLoad(['https://unpkg.com/three-globe/example/img/earth-night.jpg', 'https://threejs.org/examples/textures/planets/earth_lights_2048.png']).then(setColor),
        tryLoad(['https://unpkg.com/three-globe/example/img/earth-clouds.png', 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png']).then(setColor),
        tryLoad(['https://unpkg.com/three-globe/example/img/earth-water.png']).then(setLinear),
      ])
      if (disposed) return

      if (dayTex) {
        const shaderMat = new THREE.ShaderMaterial({
          uniforms: {
            dayTex: { value: dayTex },
            nightTex: { value: nightTex },
            specTex: { value: specTex },
            hasSpec: { value: specTex ? 1 : 0 },
            sunDir: { value: sunDirWorld.clone() },
          },
          vertexShader: `
            varying vec2 vUv; varying vec3 vNormalW; varying vec3 vViewDir;
            void main(){
              vUv = uv;
              vNormalW = normalize(mat3(modelMatrix) * normal);
              vec4 wp = modelMatrix * vec4(position,1.0);
              vViewDir = normalize(cameraPosition - wp.xyz);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }`,
          fragmentShader: `
            uniform sampler2D dayTex; uniform sampler2D nightTex; uniform sampler2D specTex;
            uniform float hasSpec; uniform vec3 sunDir;
            varying vec2 vUv; varying vec3 vNormalW; varying vec3 vViewDir;
            void main(){
              vec3 nrm = normalize(vNormalW);
              vec3 sd  = normalize(sunDir);
              vec3 day   = texture2D(dayTex, vUv).rgb;
              vec3 night = texture2D(nightTex, vUv).rgb;
              float sunDot = dot(nrm, sd);
              float dayBlend = smoothstep(-0.12, 0.30, sunDot);

              // base day/night
              vec3 col = mix(night * 1.7, day, dayBlend);

              // warm terminator band (narrow, subtle — sunset line only)
              float term = smoothstep(0.0, 0.08, sunDot) * (1.0 - smoothstep(0.08, 0.28, sunDot));
              col += vec3(1.0, 0.45, 0.22) * term * 0.10;

              // ocean sun-glint (only on water, only day side)
              float water = hasSpec > 0.5 ? texture2D(specTex, vUv).r : 0.0;
              vec3 H = normalize(sd + vViewDir);
              float glint = pow(max(dot(nrm, H), 0.0), 90.0);
              col += vec3(0.55, 0.72, 1.0) * glint * water * dayBlend * 0.9;

              // subtle ambient lift on night side so it isn't pure black
              col += vec3(0.02, 0.03, 0.06) * (1.0 - dayBlend);

              gl_FragColor = vec4(col, 1.0);
            }`,
        })
        ;(earthMesh as any).material = shaderMat
      }
      if (cloudTex) {
        ;(cloudMesh.material as any).map = cloudTex
        ;(cloudMesh.material as any).opacity = 0.85
        ;(cloudMesh.material as any).needsUpdate = true
      }

      /* Resize */
      const onResize = () => {
        const w = container.clientWidth || 600
        camera.aspect = w / height
        camera.updateProjectionMatrix()
        renderer.setSize(w, height)
      }
      window.addEventListener('resize', onResize)

      /* ── Animation loop ── */
      const animate = () => {
        animId = requestAnimationFrame(animate)
        earthMesh.rotation.y += 0.0009
        cloudMesh.rotation.y += 0.00115 // clouds drift slightly faster

        sats.forEach(({ mesh, def, trail, pts }) => {
          const [x, y, z] = keplerPosition(def.inc, def.raan, def.alt, def.phase)
          mesh.position.set(x, y, z)
          pts.unshift([x, y, z])
          const maxLen = (trail as any)._len
          if (pts.length > maxLen) pts.pop()
          if (pts.length > 2) {
            const posArr: number[] = []
            const colArr: number[] = []
            const base = (trail as any)._color as { r: number; g: number; b: number }
            for (let k = 0; k < pts.length; k++) {
              posArr.push(pts[k][0], pts[k][1], pts[k][2])
              const f = 1 - k / pts.length // head bright -> tail faded
              colArr.push(base.r * f, base.g * f, base.b * f)
            }
            trail.geometry.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3))
            trail.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colArr, 3))
            trail.geometry.attributes.position.needsUpdate = true
          }
        })

        const show = fpRef.current
        fpLine.visible = show
        fillMesh.visible = show
        if (show && sats[0]) {
          const p = sats[0].mesh.position
          const pts = footprintPoints([p.x, p.y, p.z], VAXON_SATS[0].alt)
          fpLine.geometry.setFromPoints(pts.map((pt) => new THREE.Vector3(pt[0], pt[1], pt[2])))
          const nadir = sats[0].mesh.position.clone().normalize().multiplyScalar(1.001)
          const fv: number[] = []
          for (let j = 0; j < pts.length - 1; j++) {
            fv.push(nadir.x, nadir.y, nadir.z, pts[j][0], pts[j][1], pts[j][2], pts[j + 1][0], pts[j + 1][1], pts[j + 1][2])
          }
          fillMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(fv, 3))
          fillMesh.geometry.attributes.position.needsUpdate = true
        }

        renderer.render(scene, camera)
      }
      animate()

      return () => { window.removeEventListener('resize', onResize) }
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
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: 160 - i * 30, height: 5, background: '#0d0d1a', borderRadius: 2, animation: 'vx-skel 1.5s ease infinite', animationDelay: `${i * 0.2}s` }} />
          ))}
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#2a2a3e', fontFamily: "'Inter',sans-serif", marginTop: '0.5rem' }}>INITIALIZING ORBIT MODEL</div>
        </div>
      )}
      {!loading && (
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { col: '#ff2d4b', label: 'VLEO 180–250km (VAXON)' },
            { col: '#4aa3ff', label: 'ISS ~408km' },
            { col: '#35d07f', label: 'Starlink ~550km' },
          ].map(({ col, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 28, height: 3, background: col, boxShadow: `0 0 8px ${col}` }} />
              <span style={{ fontSize: '0.95rem', letterSpacing: '0.08em', color: col, fontFamily: "'Bitter',Georgia,serif", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#888', fontFamily: "'Bitter',Georgia,serif", marginTop: '0.35rem', maxWidth: 280 }}>
            ALTITUDE EXAGGERATED FOR CLARITY · TRUE RATIOS PRESERVED
          </div>
        </div>
      )}
    </div>
  )
}
