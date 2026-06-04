# Motion.so Video Prompt — Vaxon Space Brand Film

> **How to use:** Paste the "MASTER PROMPT" block into Motion.so's AI generation field. The shot-by-shot storyboard below it is for the manual timeline editor or to refine each AI-generated scene. Color, type, and asset references are exact to the live site (https://vaxon-space.vercel.app).

---

## BRAND SYSTEM (lock these globally before generating)

- **Primary accent:** Vaxon Red `#C8102E` (CTAs, highlights, orbit ring, data emphasis)
- **Secondary accent:** Signal Blue `#0088FF` / atmospheric cyan `#44AAFF`
- **Backgrounds:** near-black `#02020D`, panel `#050512`, hairline borders `#131323`
- **Plume / propulsion accent:** electric violet `#CC44FF` → `#DD55FF`
- **Headline type:** **Bitter** (serif, weight 900) — used for all big statements
- **Body / label type:** **Inter** (sans, weight 300–600), UPPERCASE with `0.2em` letter-spacing for eyebrow labels
- **Motion language:** cinematic, weighty easing `cubic-bezier(0.22, 1, 0.36, 1)`, slow 2–3s breathes, particle systems, dashed flow-lines, subtle scanlines + film grain at 4% opacity
- **Aspect ratio:** 16:9 master (1920×1080), also export 9:16 and 1:1 cutdowns
- **Duration:** 60 seconds
- **Audio mood:** deep cinematic sub-bass drone, a single rising synth swell into the hero stat reveal, tense military-grade ticking percussion, resolve on a clean ascending pad. No voiceover required (text-driven), but leave room for an optional VO track.

---

## MASTER PROMPT (paste into Motion.so AI)

```
Create a 60-second cinematic brand film for "Vaxon Space," a defense-tech company
building air-breathing satellites that operate in Very Low Earth Orbit (180–250 km),
10x closer to Earth than traditional satellites. Tone: elite, classified, military-grade,
physics-driven. Think Lockheed Martin meets Anduril meets a SpaceX launch film.

Visual identity: near-black space backgrounds (#02020D), Vaxon red accent (#C8102E),
electric-violet ion plume (#CC44FF), signal-blue data (#0088FF). Headlines in a heavy
serif (Bitter, weight 900, white). Labels in uppercase Inter with wide letter-spacing.
Heavy motion: drifting starfields, a slowly rotating photorealistic Earth with a glowing
red VLEO orbit ring, animated particle streams, dashed data flow-lines, pulsing telemetry
HUD elements, kinetic typography that types on and snaps into place, and a pulsing violet
ion-engine plume. Cinematic depth of field, lens flares from the sun's terminator line,
volumetric atmosphere glow on Earth's limb, 4% film grain, subtle horizontal scanlines.
Camera: slow cinematic push-ins, orbital arc moves, and one dramatic pull-back to reveal
the full constellation. Pacing accelerates through the middle, resolves calm at the end on
the logo. End card: Vaxon Space logo, tagline "Real-time missile defense and connectivity
today — and AI tomorrow," and URL vaxonspace.com.
```

---

## SHOT-BY-SHOT STORYBOARD (10 scenes, ~6s each)

### SCENE 1 — COLD OPEN (0:00–0:06)
- **Visual:** Pure black. A single point of light igniting in the center. Faint starfield fades up (1800 drifting white particles, opacity 0.7). A horizontal scanline sweeps once.
- **Type (types on, Bitter 900, white, center):** "180–250 KM ABOVE EARTH"
- **Subtext (Inter, uppercase, `#C8102E`, letter-spacing 0.32em):** "VERY LOW EARTH ORBIT"
- **Motion:** Slow 8% zoom-in on the starfield. Audio: sub-bass drone enters.
- **Asset ref:** starfield style → `public/vaxon/hero-video.mp4` (the live hero background video, cinematic Earth-from-orbit).

### SCENE 2 — THE EARTH REVEAL (0:06–0:14)
- **Visual:** A photorealistic Earth rotates slowly into frame from the lower third — day/night terminator visible, city lights glowing orange on the night side, blue atmospheric rim-glow (BackSide shader). A bright red **VLEO orbit ring** (`#C8102E`) tilts at 45° around the globe, with two dimmer comparison rings: ISS ~408 km (blue `#3366CC`), Starlink ~550 km (green `#22AA55`).
- **Type (lower-left, Inter labels with colored dashes):**
  - "— VLEO 180–250 KM (VAXON)" in red
  - "— ISS ~408 KM" in blue
  - "— STARLINK ~550 KM" in green
- **Motion:** Earth rotates at 0.003 rad/frame. A white satellite marker traces the red VLEO ring. Camera does a slow orbital arc.
- **Asset ref:** `components/EarthGlobe.tsx` and `components/EarthGlobeV2.tsx` (the actual Three.js globe with orbit rings, city lights, coverage cone) — match this exact look. Also `public/vaxon/earth.png`, `public/vaxon/orbit.png`.

### SCENE 3 — THE PROBLEM / PHYSICS HOOK (0:14–0:20)
- **Visual:** Split-screen altitude comparison bars animate in (shorter bar = closer to Earth). Bars labeled GEO (35,786 km), MEO (8,000 km), LEO (400–600 km), and VLEO (180–250 km) — the VLEO bar is short and glowing red with a `0 0 12px rgba(200,16,46,0.5)` glow, marked "VAXON SPACE ★".
- **Type (Bitter 900, white):** "10× CLOSER. PHYSICS CHANGES EVERYTHING."
- **Motion:** Bars sweep out left-to-right with 1.4s staggered easing. Numbers count up.
- **Asset ref:** the AltitudeBars component in `app/page.tsx` (TIERS array) — replicate exact bar proportions: GEO 100%, MEO 68%, LEO 38%, VLEO 10%.

### SCENE 4 — KEY STATS BARRAGE (0:20–0:26)
- **Visual:** Four telemetry cards snap in over a darkened orbital backdrop, each value **types out character-by-character** (typewriter), staggered 200ms:
  - **180–250 km** — ORBITAL ALTITUDE
  - **<15 ms** — SIGNAL LATENCY
  - **10×** — CLOSER THAN LEO
  - **24/7** — PERSISTENT COVERAGE
- **Motion:** Glassmorphic cards (`backdrop-blur`), each value flickers like a HUD readout locking on. Red underline sweeps beneath each.
- **Asset ref:** the StatsStrip / TypeOut component in `app/page.tsx` — same values, same typewriter behavior.

### SCENE 5 — ABEP PROPULSION (THE TECH) (0:26–0:34)
- **Visual:** The hero technical sequence. Animate the air-breathing electric propulsion (ABEP) cutaway: blue air particles stream into an **Intake** (left, 6 rows of blue arrows), through a pulsing **Compressor** (stacked bands compressing in a wave), into a breathing blue **Plenum** sphere (glowing, expanding/contracting), through a **butterfly flow-control valve** (opening/closing), out a **Thruster** that fires a pulsing **electric-violet ion plume** (`#CC44FF` → `#DD55FF`, 3 layered gradient triangles with outer glow).
- **Type (Bitter 900):** "AIR-BREATHING ELECTRIC PROPULSION" → then "THE ATMOSPHERE IS THE FUEL."
- **Motion:** Particles flow continuously left→right along dashed flow-lines. The plume pulses on a 1.8s cycle. Camera pushes in on the violet plume at the end.
- **Asset ref:** `components/ABEPDiagram.tsx` (the exact animated diagram I built — intake particles, compressor bands, plenum breathe, valve rotation, plume gradients). Also `public/vaxon/scene1.png` through `scene4.png` (satellite renders).

### SCENE 6 — CAPABILITIES GRID (0:34–0:40)
- **Visual:** Six mission-capability tiles cascade in (staggered 70ms), each with a red eyebrow tag and white Bitter title over a dark tile that lifts on reveal:
  - **ISR** / Persistent Surveillance
  - **DEFENSE** / Missile Defense (Golden Dome)
  - **CONNECTIVITY** / High-Speed Data Links
  - **RESILIENCE** / Self-Cleaning Orbit
  - **PROPULSION** / ABEP Technology
  - **AI SENSING** / On-Orbit AI Processing
- **Motion:** Tiles translate up + fade, red left-border wipes in on each.
- **Asset ref:** TechnologySection `caps` array in `app/page.tsx`.

### SCENE 7 — DEFENSE / GOLDEN DOME MOMENT (0:40–0:46)
- **Visual:** Tense beat. A hypersonic threat track (red dashed arc) crosses a darkened Earth. A Vaxon satellite in VLEO locks on — a red **coverage footprint cone** projects down to the surface, a "<15ms" latency readout ticks, and a sensor-to-shooter line snaps closed at "machine speed." HUD reticles and lat/long coordinates flicker.
- **Type (Inter uppercase, red):** "GOLDEN DOME READY" + "SENSOR-TO-SHOOTER IN <15 MS"
- **Motion:** Aggressive percussion hit on lock-on. Reticle snaps. Screen-shake micro-pulse.
- **Asset ref:** the coverage-footprint toggle in `EarthGlobe.tsx` (red cone + ground circle). Mood ref: `public/vaxon/scene2.png`.

### SCENE 8 — CONSTELLATION SCALE (0:46–0:52)
- **Visual:** Dramatic pull-back. One satellite becomes a 5-satellite VLEO constellation, then a proliferated mesh — glowing red orbital tracks weaving a net around Earth, inter-satellite laser links flickering between nodes. Self-cleaning orbit: debris dots fall and burn up in the atmosphere within "weeks, not decades."
- **Type (Bitter 900):** "A PROLIFERATED, RESILIENT, SELF-CLEANING ARCHITECTURE"
- **Motion:** Camera pulls back continuously; nodes multiply; mesh lines draw on.
- **Asset ref:** the SatelliteGlobe / constellation simulation component referenced in `app/page.tsx` (LIVE CONSTELLATION SIMULATION). Also `public/vaxon/scene3.png`, `scene4.png`.

### SCENE 9 — CREDIBILITY / PEDIGREE (0:52–0:57)
- **Visual:** A grid of institutional logos fades up on black (no boxes, clean float), each subtly glowing on entrance: **NRO, US Army, DISA, US Space Force, Naval Research Lab, Naval War College, NASA, DoD, Lockheed Martin**, plus universities **Michigan, CU Boulder, UT Austin, West Point, UNC, Stanford, Cornell, Bates**. Then a quick montage of team credentials: "Lockheed Martin · DoD · Space Force · NRO · Stanford · DARPA-backed."
- **Type (Bitter 900):** "BUILT BY THE PEOPLE WHO'VE DONE IT"
- **Subtext:** "Backed by a DARPA-funded ABEP engine partner. IAI / Starburst Catalyst cohort."
- **Asset ref:** `public/vaxon/logos/` folder — use `nro-color.png`, `army-mark.png`, `disa.svg`, `space-force.png`, `naval-research-lab.png`, `naval-war-college-color.webp`, `nasa.svg`, `dod.svg`, `lockheedmartin.jpg`, `michigan-seal.png`, `cu-boulder.svg`, `ut-austin.png`, `west-point-logo.png`, `unc.svg`, `stanford.svg`, `cornell-seal.png`, `bates.svg`. Team photos: `team-shepard.png` (CEO Dr. Steven P. Shepard), `team-lipscomb.png`, `team-williamson.jpg`.

### SCENE 10 — LOGO / END CARD (0:57–1:00)
- **Visual:** Everything dissolves to black. The Vaxon Space logo (winged "V" mark) draws/fades in center with a soft red glow pulse. A single red VLEO orbit arc sweeps behind it.
- **Type (Bitter 900, white, types on):** "Real-time missile defense and connectivity today — and AI tomorrow."
- **Footer (Inter, uppercase):** "VAXONSPACE.COM" + "EST. 2021 · BOULDER, COLORADO"
- **Motion:** Logo settles, orbit arc completes, audio resolves on ascending pad, fade to black.
- **Asset ref:** `public/vaxon/logo.png` (the official Vaxon Space logo).

---

## MOTION DIRECTION CHEAT-SHEET (apply per scene)

| Element | Animation |
|---|---|
| Headlines | Type-on then snap; or mask-reveal upward with 0.8s ease |
| Eyebrow labels | Fade + 8px translate-up, 1s ease, 0.3s delay |
| Earth globe | Continuous 0.003 rad/frame Y-rotation, atmospheric rim glow pulse 2s |
| Orbit rings | Static tilt, satellite markers trace them continuously |
| Particles (intake) | Stream left→right, 6 staggered rows, opacity fade in/out at ends |
| Plenum sphere | Breathe: radius 62→67px + glow opacity 0.3→0.7, 2s ease-in-out |
| Ion plume | 3 layered violet triangles, scale + opacity pulse, 1.8s, outer Gaussian glow |
| Flow-lines | Dashed stroke (7 5), animate stroke-dashoffset 28→0, 1.1s linear |
| Stat values | Typewriter character reveal, 60ms/char, staggered 200ms per card |
| Data cards | Glassmorphic, backdrop-blur 12px, red underline sweep |
| Transitions | Cross-dissolve through black, or red orbit-arc wipe |
| Throughout | 4% film grain, 1px scanline sweep every 10s, sun lens flares on Earth limb |

---

## ASSET LINKS QUICK REFERENCE

**Live site (pull any visual/screen-grab from here):** https://vaxon-space.vercel.app
- Hero / Earth: https://vaxon-space.vercel.app/#home
- ABEP diagram + tech: https://vaxon-space.vercel.app/#technology
- Why VLEO comparison table: https://vaxon-space.vercel.app/vleo
- Team + logos: https://vaxon-space.vercel.app/#team

**Local source assets** (in repo `public/vaxon/`):
- `hero-video.mp4` — cinematic Earth-from-orbit background (use as Scene 1–2 base plate)
- `logo.png` — official logo (Scene 10)
- `scene1.png`–`scene4.png` — satellite product renders
- `earth.png`, `orbit.png` — globe + orbit stills
- `team-shepard.png`, `team-lipscomb.png`, `team-williamson.png` — leadership photos
- `logos/` — all institutional credibility logos (see Scene 9 list)

**Components to mirror for exact motion** (in repo):
- `components/ABEPDiagram.tsx` — the propulsion animation (Scene 5)
- `components/EarthGlobe.tsx` / `EarthGlobeV2.tsx` — Earth + orbit rings (Scene 2, 7)
- `app/page.tsx` → StatsStrip/TypeOut (Scene 4), AltitudeBars (Scene 3), TechnologySection caps (Scene 6)

**External stock references for look-and-feel** (search on motion.so / Pexels / Storyblocks):
- "Earth from space VLEO terminator city lights cinematic"
- "ion thruster electric propulsion plume blue purple"
- "satellite constellation mesh network orbital tracks"
- "hypersonic missile defense tracking HUD military"
- "data telemetry HUD interface dark red blue"

---

## VOICEOVER SCRIPT (optional, ~55s — if you add VO)

> "Above the world we know — too low for any satellite to survive — there is an advantage.
> One hundred and eighty kilometers up. Ten times closer than anything else in orbit.
> Vaxon Space builds satellites that breathe the atmosphere itself — turning the very drag
> that destroys others into limitless fuel. Sub-thirty-centimeter imagery. Sub-fifteen-millisecond
> latency. Persistent, real-time awareness over any target on Earth. Missile defense at machine
> speed. A self-cleaning, resilient constellation. Built by the people who've done it — from
> Lockheed Martin, the Space Force, the NRO, and DARPA. Vaxon Space. Real-time missile defense
> and connectivity today — and AI tomorrow."
