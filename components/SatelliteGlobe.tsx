'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface GlobeFeatures {
  trails: boolean
  cities: boolean
  debris: boolean
  downlinks: boolean
  isl: boolean
  swath: boolean
  goldenDome: boolean
}

export default function SatelliteGlobe() {
  const mountRef = useRef<HTMLDivElement>(null)
  const featRef = useRef<GlobeFeatures>({
    trails: true, cities: true, debris: false,
    downlinks: false, isl: false, swath: false, goldenDome: false,
  })
  const [features, setFeatures] = useState<GlobeFeatures>(featRef.current)
  const [overflight, setOverflight] = useState<{ city: string; sec: number } | null>(null)

  const toggle = (key: keyof GlobeFeatures) => {
    setFeatures(prev => {
      const next = { ...prev, [key]: !prev[key] }
      featRef.current = next
      return next
    })
  }

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const W = el.clientWidth || 900
    const H = Math.max(500, Math.min(640, W * 0.55))

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x02020d)

    const camera = new THREE.PerspectiveCamera(46, W / H, 0.01, 500)
    camera.position.set(0, 0.28, 3.15)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    /* ── Stars ── */
    const sp = new Float32Array(3000 * 3)
    for (let i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 300
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 })))

    /* ── Earth texture ── */
    const texCanvas = document.createElement('canvas')
    texCanvas.width = 2048; texCanvas.height = 1024
    const ctx = texCanvas.getContext('2d')!
    ctx.fillStyle = '#06111e'; ctx.fillRect(0, 0, 2048, 1024)
    ctx.strokeStyle = 'rgba(80,120,180,0.06)'; ctx.lineWidth = 1
    for (let lat = -80; lat <= 80; lat += 20) { const y = (90-lat)/180*1024; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(2048,y); ctx.stroke() }
    for (let lon = -180; lon <= 180; lon += 30) { const x = (lon+180)/360*2048; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,1024); ctx.stroke() }
    const ll = (lon: number, lat: number): [number,number] => [(lon+180)/360*2048, (90-lat)/180*1024]
    const poly = (pts: [number,number][], c='#0e1e0e') => { ctx.fillStyle=c; ctx.beginPath(); ctx.moveTo(...pts[0]); for(let i=1;i<pts.length;i++) ctx.lineTo(...pts[i]); ctx.closePath(); ctx.fill() }
    poly([ll(-165,60),ll(-140,60),ll(-125,50),ll(-115,35),ll(-117,28),ll(-95,15),ll(-85,10),ll(-78,8),ll(-70,10),ll(-60,5),ll(-53,3),ll(-43,20),ll(-38,10),ll(-50,-5),ll(-35,-8),ll(-38,15),ll(-58,8),ll(-67,20),ll(-72,40),ll(-65,47),ll(-52,46),ll(-54,54),ll(-63,60),ll(-70,60),ll(-75,65),ll(-90,70),ll(-120,70),ll(-140,68),ll(-163,68)])
    poly([ll(-82,10),ll(-65,12),ll(-58,4),ll(-50,-1),ll(-35,-8),ll(-38,-15),ll(-40,-22),ll(-48,-28),ll(-53,-34),ll(-65,-55),ll(-72,-50),ll(-70,-40),ll(-65,-35),ll(-68,-20),ll(-70,-10),ll(-80,0)])
    poly([ll(-9,40),ll(2,44),ll(8,44),ll(14,42),ll(18,40),ll(28,42),ll(30,46),ll(28,54),ll(22,58),ll(14,58),ll(5,56),ll(-3,58),ll(-5,48),ll(-8,44)])
    poly([ll(-18,16),ll(-15,5),ll(-15,-2),ll(-2,-5),ll(5,-2),ll(10,-8),ll(15,-20),ll(18,-35),ll(24,-34),ll(30,-32),ll(36,-22),ll(40,-12),ll(44,10),ll(50,12),ll(44,18),ll(36,20),ll(30,22),ll(28,32),ll(22,36),ll(12,36),ll(2,36),ll(-4,32),ll(-8,28),ll(-17,20)])
    poly([ll(28,32),ll(38,36),ll(48,30),ll(60,22),ll(56,22),ll(44,14),ll(36,20),ll(28,32)])
    poly([ll(20,68),ll(40,72),ll(70,72),ll(100,68),ll(140,68),ll(160,58),ll(140,50),ll(130,44),ll(120,38),ll(108,32),ll(100,22),ll(92,28),ll(80,32),ll(70,22),ll(62,22),ll(56,26),ll(48,30),ll(38,36),ll(28,44),ll(22,54),ll(18,60)])
    poly([ll(68,24),ll(78,28),ll(82,24),ll(90,22),ll(92,22),ll(92,26),ll(88,24),ll(82,28),ll(78,32),ll(72,28)])
    poly([ll(96,28),ll(102,22),ll(108,18),ll(108,4),ll(104,1),ll(100,2),ll(100,6),ll(98,8),ll(96,16),ll(94,24)])
    poly([ll(114,-22),ll(122,-18),ll(130,-12),ll(136,-12),ll(140,-18),ll(148,-22),ll(152,-28),ll(150,-38),ll(140,-40),ll(130,-32),ll(120,-34),ll(114,-30)])
    ctx.fillStyle='#081208'; ctx.fillRect(0, 1024*0.88, 2048, 1024*0.12)
    const earthTex = new THREE.CanvasTexture(texCanvas)

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ map: earthTex, specular: new THREE.Color(0x0a2233), shininess: 10, emissive: new THREE.Color(0x020508), emissiveIntensity: 1 })
    )
    scene.add(earth)
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.024,32,32), new THREE.MeshBasicMaterial({ color: 0x1a55cc, transparent:true, opacity:0.1, side:THREE.BackSide })))

    const sunLight = new THREE.DirectionalLight(0xddeeff, 1.4)
    sunLight.position.set(3,1,2); scene.add(sunLight)
    scene.add(new THREE.AmbientLight(0x060a14, 1.4))

    /* ── Orbital mechanics ── */
    const R_SAT = 1.07, R_LEO = 1.24
    const OMEGA = (2*Math.PI)/55
    const INC = 45*Math.PI/180
    const SATS = [{raan:0,phase:0},{raan:72,phase:1.256},{raan:144,phase:2.513},{raan:216,phase:3.770},{raan:288,phase:5.026}]

    const getSatPos = (cfg:{raan:number;phase:number}, t:number) => {
      const nu = OMEGA*t+cfg.phase
      const O = cfg.raan*Math.PI/180
      const cO=Math.cos(O), sO=Math.sin(O), cI=Math.cos(INC), sI=Math.sin(INC), cN=Math.cos(nu), sN=Math.sin(nu)
      return new THREE.Vector3(R_SAT*(cN*cO-sN*sI*sO), R_SAT*sN*cI, -R_SAT*(cN*sO+sN*sI*cO))
    }

    const latLon = (lat:number, lon:number, r=1.0) => new THREE.Vector3(
      r*Math.cos(lat*Math.PI/180)*Math.cos(lon*Math.PI/180),
      r*Math.sin(lat*Math.PI/180),
      -r*Math.cos(lat*Math.PI/180)*Math.sin(lon*Math.PI/180)
    )

    /* ── Satellite meshes ── */
    const satMeshes = SATS.map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.013,8,8), new THREE.MeshBasicMaterial({color:0xffffff})); scene.add(m); return m })

    /* ── Orbit rings ── */
    SATS.forEach(cfg => {
      const pts = Array.from({length:81},(_,i)=>getSatPos(cfg,(i/80)*(55/OMEGA)))
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color:0x1a1a2e})))
    })

    /* ── Trails ── */
    const TRAIL_LEN = 100
    const trailHist = SATS.map(()=>[] as THREE.Vector3[])
    const trailLines = SATS.map(()=>{
      const pos=new Float32Array(TRAIL_LEN*3)
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setDrawRange(0,0)
      const l=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x4a4a6e,transparent:true,opacity:0.6})); scene.add(l); return l
    })

    /* ── ISR Swath ── */
    const SWATH_ANGLE = 0.09
    const swathMeshes = SATS.map(()=>{
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(4*3),3)); geo.setIndex([0,1,2,0,2,3])
      const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0xffcc00,transparent:true,opacity:0.14,side:THREE.DoubleSide})); scene.add(m); return m
    })

    /* ── Cities (children of earth — rotate with it) ── */
    const CITIES = [{name:'Washington D.C.',lat:38.9,lon:-77.0},{name:'Tehran',lat:35.7,lon:51.4},{name:'Beijing',lat:39.9,lon:116.4},{name:'Pyongyang',lat:39.0,lon:125.8}]
    const cityGroup = new THREE.Group(); earth.add(cityGroup)
    const cityDots = CITIES.map(c=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(0.009,8,8),new THREE.MeshBasicMaterial({color:0xc8102e})); m.position.copy(latLon(c.lat,c.lon,1.008)); cityGroup.add(m); return m })
    const cityRings = CITIES.map(c=>{
      const pos=latLon(c.lat,c.lon,1.008); const pts=Array.from({length:33},(_,i)=>{const a=i/32*Math.PI*2; return pos.clone().add(new THREE.Vector3(Math.cos(a)*0.019,0,Math.sin(a)*0.019))})
      const r=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xc8102e,transparent:true,opacity:0})); cityGroup.add(r); return r
    })

    /* ── Ground stations ── */
    const STATIONS = [{lat:38.9,lon:-77},{lat:51.5,lon:0},{lat:-33.9,lon:18.4},{lat:35.7,lon:139.7}]
    const stGroup = new THREE.Group(); earth.add(stGroup)
    STATIONS.forEach(s=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(0.006,6,6),new THREE.MeshBasicMaterial({color:0x22dd88})); m.position.copy(latLon(s.lat,s.lon,1.004)); stGroup.add(m) })

    /* ── Debris ── */
    const debrisPos = new Float32Array(500*3)
    for(let i=0;i<500;i++){const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=R_LEO-0.04+Math.random()*0.08; debrisPos[i*3]=r*Math.sin(ph)*Math.cos(th); debrisPos[i*3+1]=r*Math.cos(ph); debrisPos[i*3+2]=r*Math.sin(ph)*Math.sin(th)}
    const debrisGeo=new THREE.BufferGeometry(); debrisGeo.setAttribute('position',new THREE.BufferAttribute(debrisPos,3))
    const debris=new THREE.Points(debrisGeo,new THREE.PointsMaterial({color:0x666688,size:0.007,transparent:true,opacity:0.7})); debris.visible=false; scene.add(debris)

    /* ── Downlinks ── */
    const dlPos=new Float32Array(SATS.length*STATIONS.length*6)
    const dlGeo=new THREE.BufferGeometry(); dlGeo.setAttribute('position',new THREE.BufferAttribute(dlPos,3)); dlGeo.setDrawRange(0,0)
    const dlLines=new THREE.LineSegments(dlGeo,new THREE.LineBasicMaterial({color:0x22dd88,transparent:true,opacity:0.4})); scene.add(dlLines)

    /* ── ISL ── */
    const islPos=new Float32Array(SATS.length*(SATS.length-1)*3)
    const islGeo=new THREE.BufferGeometry(); islGeo.setAttribute('position',new THREE.BufferAttribute(islPos,3)); islGeo.setDrawRange(0,0)
    const islLines=new THREE.LineSegments(islGeo,new THREE.LineBasicMaterial({color:0x4488ff,transparent:true,opacity:0.35})); scene.add(islLines)

    /* ── Golden Dome ── */
    const tehran=latLon(35.7,51.4), dc=latLon(38.9,-77)
    const arcPts=Array.from({length:41},(_,i)=>{const t=i/40; const p=new THREE.Vector3().lerpVectors(tehran,dc,t); p.normalize().multiplyScalar(1+0.35*Math.sin(t*Math.PI)); return p})
    const gdGeo=new THREE.BufferGeometry().setFromPoints(arcPts)
    const gdLine=new THREE.Line(gdGeo,new THREE.LineBasicMaterial({color:0xff2233,transparent:true,opacity:0.85}))
    const flashMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0})
    const flashMesh=new THREE.Mesh(new THREE.SphereGeometry(0.028,8,8),flashMat); flashMesh.position.copy(arcPts[20])
    const gdGroup=new THREE.Group(); gdGroup.add(gdLine,flashMesh); gdGroup.visible=false; scene.add(gdGroup)

    /* ── Resize ── */
    const onResize=()=>{ if(!el) return; const nW=el.clientWidth,nH=Math.max(500,Math.min(640,nW*0.55)); camera.aspect=nW/nH; camera.updateProjectionMatrix(); renderer.setSize(nW,nH) }
    window.addEventListener('resize',onResize)

    /* ── Mouse orbit ── */
    let isDrag=false, pMx=0, autoAngle=0
    const onDown=(e:MouseEvent)=>{isDrag=true; pMx=e.clientX}
    const onMove=(e:MouseEvent)=>{if(!isDrag) return; camera.position.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),(e.clientX-pMx)*0.006)); camera.lookAt(0,0,0); pMx=e.clientX}
    const onUp=()=>{isDrag=false}
    renderer.domElement.addEventListener('mousedown',onDown); window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp)

    /* ── Animate ── */
    let animId=0, simTime=0, lastTs=0, gdT=0
    const overflightCb={fn:(d:{city:string;sec:number}|null)=>{}}
    overflightCb.fn = setOverflight

    const animate=(ts:number)=>{
      animId=requestAnimationFrame(animate)
      const dt=Math.min((ts-lastTs)/1000,0.05); lastTs=ts; simTime+=dt
      const feat=featRef.current

      earth.rotation.y+=dt*0.018
      sunLight.position.set(Math.cos(simTime*0.015)*4,1.2,Math.sin(simTime*0.015)*4)

      const satPos=SATS.map(cfg=>getSatPos(cfg,simTime))
      satMeshes.forEach((m,i)=>m.position.copy(satPos[i]))

      // Trails
      trailHist.forEach((h,i)=>{
        h.push(satPos[i].clone()); if(h.length>TRAIL_LEN) h.shift()
        const arr=trailLines[i].geometry.attributes.position.array as Float32Array
        h.forEach((p,j)=>{arr[j*3]=p.x;arr[j*3+1]=p.y;arr[j*3+2]=p.z})
        trailLines[i].geometry.attributes.position.needsUpdate=true; trailLines[i].geometry.setDrawRange(0,h.length)
        trailLines[i].visible=feat.trails
      })

      // Swath
      swathMeshes.forEach((m,i)=>{
        m.visible=feat.swath
        if(!feat.swath) return
        const sp=satPos[i].clone(), dn=sp.clone().negate().normalize()
        const fwd=dn.clone().cross(new THREE.Vector3(0,1,0)).normalize()
        const right=dn.clone().cross(fwd).normalize()
        const gp=dn.clone().multiplyScalar(-R_SAT)
        const f=fwd.clone().multiplyScalar(SWATH_ANGLE*0.8), r=right.clone().multiplyScalar(SWATH_ANGLE*1.2)
        const cs=[gp.clone().add(f).add(r),gp.clone().add(f).sub(r),gp.clone().sub(f).sub(r),gp.clone().sub(f).add(r)]
        const arr=m.geometry.attributes.position.array as Float32Array
        cs.forEach((c,ci)=>{arr[ci*3]=c.x;arr[ci*3+1]=c.y;arr[ci*3+2]=c.z})
        m.geometry.attributes.position.needsUpdate=true
      })

      // Downlinks
      dlLines.visible=feat.downlinks
      if(feat.downlinks){
        const arr=dlGeo.attributes.position.array as Float32Array; let idx=0
        satPos.forEach(sp=>STATIONS.forEach(st=>{const wp=earth.localToWorld(latLon(st.lat,st.lon,1.004).clone()); arr[idx++]=sp.x;arr[idx++]=sp.y;arr[idx++]=sp.z;arr[idx++]=wp.x;arr[idx++]=wp.y;arr[idx++]=wp.z}))
        dlGeo.attributes.position.needsUpdate=true; dlGeo.setDrawRange(0,SATS.length*STATIONS.length*2)
      }

      // ISL
      islLines.visible=feat.isl
      if(feat.isl){
        const arr=islGeo.attributes.position.array as Float32Array; let idx=0
        for(let i=0;i<SATS.length;i++) for(let j=i+1;j<SATS.length;j++){arr[idx++]=satPos[i].x;arr[idx++]=satPos[i].y;arr[idx++]=satPos[i].z;arr[idx++]=satPos[j].x;arr[idx++]=satPos[j].y;arr[idx++]=satPos[j].z}
        islGeo.attributes.position.needsUpdate=true; islGeo.setDrawRange(0,SATS.length*(SATS.length-1))
      }

      debris.visible=feat.debris

      // Cities + overflight
      cityGroup.visible=feat.cities
      if(feat.cities){
        let nearC=-1, minD=Infinity
        CITIES.forEach((c,ci)=>{
          const wp=earth.localToWorld(latLon(c.lat,c.lon,1.008).clone())
          let d=Infinity; satPos.forEach(sp=>{d=Math.min(d,sp.distanceTo(wp))})
          const pulse=Math.max(0,1-d*6);(cityRings[ci].material as THREE.LineBasicMaterial).opacity=pulse*0.9
          if(d<minD){minD=d;nearC=ci}
        })
        if(nearC>=0&&minD<0.35){
          const wp=earth.localToWorld(latLon(CITIES[nearC].lat,CITIES[nearC].lon,1.008).clone()); let cd=Infinity; satPos.forEach(sp=>{cd=Math.min(cd,sp.distanceTo(wp))})
          overflightCb.fn({city:CITIES[nearC].name,sec:Math.round(cd*60)})
        } else overflightCb.fn(null)
      }

      // Golden Dome
      gdGroup.visible=feat.goldenDome
      if(feat.goldenDome){ gdT=(gdT+dt*0.8)%1; flashMat.opacity=Math.abs(Math.sin(gdT*Math.PI))*0.9 }

      // Auto-rotate camera
      if(!isDrag){ autoAngle+=dt*0.012; camera.position.x=3.15*Math.sin(autoAngle); camera.position.z=3.15*Math.cos(autoAngle); camera.lookAt(0,0,0) }

      renderer.render(scene,camera)
    }
    animId=requestAnimationFrame((ts)=>{lastTs=ts;animate(ts)})

    return ()=>{
      cancelAnimationFrame(animId)
      window.removeEventListener('resize',onResize); renderer.domElement.removeEventListener('mousedown',onDown)
      window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp)
      renderer.dispose(); if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  const BTNS: {key:keyof GlobeFeatures;label:string;color?:string}[] = [
    {key:'trails',label:'ORBITAL TRAILS'},
    {key:'cities',label:'TARGET CITIES',color:'#c8102e'},
    {key:'debris',label:'DEBRIS CLOUD'},
    {key:'downlinks',label:'DATA DOWNLINKS',color:'#22dd88'},
    {key:'isl',label:'ISL MESH',color:'#4488ff'},
    {key:'swath',label:'ISR SWATH',color:'#ffcc00'},
    {key:'goldenDome',label:'GOLDEN DOME',color:'#ff2233'},
  ]

  return (
    <div style={{position:'relative',width:'100%',background:'#02020d',borderTop:'1px solid #131323',borderBottom:'1px solid #131323'}}>
      <div ref={mountRef} style={{width:'100%',cursor:'grab',userSelect:'none'}} />

      {/* Overflight alert */}
      {overflight && features.cities && (
        <div style={{position:'absolute',top:14,left:14,background:'rgba(2,2,13,0.95)',border:'1px solid #c8102e',padding:'0.6rem 1rem'}}>
          <div style={{fontSize:'0.52rem',letterSpacing:'0.18em',color:'#c8102e',textTransform:'uppercase',marginBottom:2,fontFamily:"'Inter',sans-serif"}}>OVERFLIGHT</div>
          <div style={{fontFamily:"'Bitter',Georgia,serif",fontSize:'1rem',fontWeight:900,color:'#fff'}}>{overflight.city}</div>
          <div style={{fontSize:'0.7rem',color:'#888',marginTop:2,fontFamily:"'Inter',sans-serif"}}>{overflight.sec<5?'OVERHEAD NOW':`~${overflight.sec}s`}</div>
        </div>
      )}

      <div style={{position:'absolute',top:14,right:14,fontSize:'0.52rem',letterSpacing:'0.14em',color:'#333',textTransform:'uppercase',fontFamily:"'Inter',sans-serif"}}>DRAG TO ROTATE</div>

      {/* Feature toggles */}
      <div style={{position:'absolute',bottom:12,left:12,display:'flex',flexWrap:'wrap',gap:5}}>
        {BTNS.map(b=>(
          <button key={b.key} onClick={()=>toggle(b.key)} style={{
            background:features[b.key]?(b.color?`${b.color}22`:'#131323'):'transparent',
            color:features[b.key]?(b.color||'#fff'):'#333',
            border:`1px solid ${features[b.key]?(b.color||'#444'):'#1a1a2e'}`,
            padding:'0.28rem 0.7rem',fontSize:'0.52rem',letterSpacing:'0.1em',
            textTransform:'uppercase',cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all 0.2s',
          }}>{b.label}</button>
        ))}
      </div>
    </div>
  )
}
