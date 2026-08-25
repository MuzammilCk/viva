import { Group, Mesh, BoxGeometry, CylinderGeometry, PlaneGeometry, InstancedMesh, Vector3, Color, Object3D, CatmullRomCurve3, InstancedBufferAttribute } from "three"
import { MeshStandardMaterial, MeshPhysicalMaterial, CanvasTexture } from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import * as THREE from "three"

// ============================================================================
// Material construction helper
// ----------------------------------------------------------------------------
// The `materials` presets below may carry physical properties (clearcoat,
// transmission, ior, anisotropy, emissive, …) that MeshStandardMaterial
// silently ignores. `buildMaterial` selects the right material class and
// forwards every recognized property, so the cybernetic lacquer / anodized /
// emissive finishes defined in `materials` actually render. Instances are
// memoized per-preset-key so a model shares materials across identical parts.
// ============================================================================

export type MaterialPreset = Record<string, unknown> & {
  color?: number | string | Color
  emissive?: number | string | Color
  emissiveIntensity?: number
  metalness?: number
  roughness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  transmission?: number
  thickness?: number
  ior?: number
  anisotropy?: number
  anisotropyRotation?: number
  transparent?: boolean
  opacity?: number
  side?: number
  map?: THREE.Texture | null
}

const PHYSICAL_ONLY_KEYS = new Set([
  "clearcoat", "clearcoatRoughness", "clearcoatMap", "clearcoatNormalMap",
  "transmission", "thickness", "attenuationDistance", "attenuationColor",
  "ior", "iridescence", "sheen", "sheenColor", "sheenRoughness",
  "anisotropy", "anisotropyRotation", "anisotropyMap",
])
const EMISSIVE_KEY = "emissive"

const _materialCache = new Map<string, THREE.Material>()

export function buildMaterial(preset: MaterialPreset): THREE.Material {
  const cacheKey = (preset as any).__cyberKey
  if (cacheKey && _materialCache.has(cacheKey)) return _materialCache.get(cacheKey)!

  const needsPhysical =
    Object.keys(preset).some((k) => PHYSICAL_ONLY_KEYS.has(k)) ||
    EMISSIVE_KEY in preset

  const ctor = needsPhysical ? MeshPhysicalMaterial : MeshStandardMaterial
  const mat = new ctor()
  for (const [k, v] of Object.entries(preset)) {
    if (k.startsWith("__")) continue
    if (k === "emissive") (mat as MeshPhysicalMaterial).emissive = new Color(v as any)
    else if ((mat as any)[k] !== undefined) (mat as any)[k] = v
  }
  if (cacheKey) _materialCache.set(cacheKey, mat)
  return mat
}

// ============================================================================
// Scanline HUD screen texture (shared, generated once)
// ----------------------------------------------------------------------------
// A small CanvasTexture: horizontal scanlines + faint grid + a couple of
// brighter scan bands. Applied additively to display "glow" planes so screens
// read as cybernetic HUDs rather than blank glass. Memoized at module scope.
// ============================================================================

let _scanlineTexture: CanvasTexture | null = null
export function getScanlineTexture(): CanvasTexture {
  if (_scanlineTexture) return _scanlineTexture
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  // base near-black
  ctx.fillStyle = "#000814"
  ctx.fillRect(0, 0, size, size)
  // scanlines
  ctx.strokeStyle = "rgba(0,212,255,0.18)"
  ctx.lineWidth = 1
  for (let y = 0; y < size; y += 3) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }
  // faint grid
  ctx.strokeStyle = "rgba(0,212,255,0.07)"
  for (let x = 0; x < size; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)
    ctx.stroke()
  }
  // brighter moving-band impression (two bands)
  ctx.fillStyle = "rgba(0,212,255,0.10)"
  ctx.fillRect(0, size * 0.4, size, 6)
  ctx.fillRect(0, size * 0.78, size, 3)
  _scanlineTexture = new CanvasTexture(canvas)
  _scanlineTexture.wrapS = THREE.RepeatWrapping
  _scanlineTexture.wrapT = THREE.RepeatWrapping
  _scanlineTexture.needsUpdate = true
  return _scanlineTexture
}

// ============================================================================
// Base Geometry Primitives
// ============================================================================

export interface SynthBodyParams {
  width: number
  height: number
  depth: number
  cornerRadius: number
  panelDepth: number
  bezelWidth: number
  color: string | number | Color
  metalness: number
  roughness: number
}

export function createSynthBody(params: SynthBodyParams) {
  const group = new Group()

  // Main chassis — lacquered cybernetic finish (clearcoat sheen)
  const chassisGeometry = new RoundedBoxGeometry(
    params.width,
    params.height,
    params.depth,
    params.cornerRadius,
    8
  )
  const chassisMaterial = buildMaterial({
    ...materials.lacqueredPanel,
    color: params.color,
    metalness: params.metalness,
    roughness: params.roughness,
  })
  const chassis = new Mesh(chassisGeometry, chassisMaterial)
  chassis.castShadow = true
  chassis.receiveShadow = true
  chassis.name = "chassis"
  group.add(chassis)

  // Front panel (slightly recessed) — darker lacquer, a touch more gloss
  const panelGeometry = new RoundedBoxGeometry(
    params.width - params.bezelWidth * 2,
    params.height - params.bezelWidth * 2,
    params.panelDepth,
    params.cornerRadius - params.bezelWidth,
    4
  )
  const panelMaterial = buildMaterial({
    ...materials.lacqueredPanelDark,
    color: new Color(params.color).multiplyScalar(0.7),
  })
  const panel = new Mesh(panelGeometry, panelMaterial)
  panel.position.z = params.depth / 2 - params.panelDepth / 2 + 0.001
  panel.castShadow = true
  panel.receiveShadow = true
  panel.name = "panel"
  group.add(panel)

  return group
}

export interface KeyboardParams {
  octaves: number
  keyWidth: number
  keyDepth: number
  keyHeight: number
  blackKeyWidthRatio: number
  blackKeyDepthRatio: number
  blackKeyHeightRatio: number
  whiteKeyColor: string | number | Color
  blackKeyColor: string | number | Color
  gap: number
}

export function createKeyboard(params: KeyboardParams) {
  const group = new Group()
  const totalKeys = params.octaves * 12
  const whiteKeysPerOctave = 7
  const blackKeyPositions = [1, 3, 6, 8, 10] // C#, D#, F#, G#, A#

  // White keys
  const whiteKeyGeometry = new RoundedBoxGeometry(
    params.keyWidth,
    params.keyHeight,
    params.keyDepth,
    0.005,
    2
  )
  const whiteKeyMaterial = buildMaterial({
    ...materials.keycapWhite,
    color: params.whiteKeyColor,
    metalness: 0.1,
    roughness: 0.9,
  })

  let whiteKeyIndex = 0
  for (let octave = 0; octave < params.octaves; octave++) {
    for (let i = 0; i < whiteKeysPerOctave; i++) {
      const x = (whiteKeyIndex * (params.keyWidth + params.gap)) - (totalKeys * params.keyWidth) / 2
      const key = new Mesh(whiteKeyGeometry, whiteKeyMaterial)
      key.position.set(x, -params.keyHeight / 2, params.keyDepth / 2)
      key.castShadow = true
      key.receiveShadow = true
      key.name = `white-key-${whiteKeyIndex}`
      group.add(key)
      whiteKeyIndex++
    }
  }

  // Black keys
  const blackKeyGeometry = new RoundedBoxGeometry(
    params.keyWidth * params.blackKeyWidthRatio,
    params.keyHeight * params.blackKeyHeightRatio,
    params.keyDepth * params.blackKeyDepthRatio,
    0.003,
    2
  )
  const blackKeyMaterial = buildMaterial({
    ...materials.keycapBlack,
    color: params.blackKeyColor,
    metalness: 0.1,
    roughness: 0.8,
  })

  let blackKeyIndex = 0
  for (let octave = 0; octave < params.octaves; octave++) {
    for (const pos of blackKeyPositions) {
      const whiteKeyOffset = Math.floor(pos * 7 / 12) + octave * 7
      const x = (whiteKeyOffset * (params.keyWidth + params.gap)) - (totalKeys * params.keyWidth) / 2
      const key = new Mesh(blackKeyGeometry, blackKeyMaterial)
      key.position.set(
        x,
        -params.keyHeight / 2 + params.keyHeight * (1 - params.blackKeyHeightRatio) / 2,
        params.keyDepth * 0.6
      )
      key.castShadow = true
      key.receiveShadow = true
      key.name = `black-key-${blackKeyIndex}`
      group.add(key)
      blackKeyIndex++
    }
  }

  return group
}

export interface KnobParams {
  radius: number
  height: number
  indicatorWidth: number
  indicatorHeight: number
  indicatorDepth: number
  baseColor: string | number | Color
  indicatorColor: string | number | Color
  segments: number
}

export function createKnob(params: KnobParams) {
  const group = new Group()

  // Knob base — anodized dark metal
  const baseGeometry = new CylinderGeometry(
    params.radius,
    params.radius * 1.1,
    params.height,
    params.segments
  )
  const baseMaterial = buildMaterial({
    ...materials.anodizedBlack,
    color: params.baseColor,
    metalness: 0.5,
    roughness: 0.45,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  })
  const base = new Mesh(baseGeometry, baseMaterial)
  base.position.y = params.height / 2
  base.castShadow = true
  base.receiveShadow = true
  base.name = "knob-base"
  group.add(base)

  // Indicator line
  const indicatorGeometry = new BoxGeometry(
    params.indicatorWidth,
    params.indicatorHeight,
    params.indicatorDepth
  )
  // Indicator — emissive glowing line (cybernetic readout ring)
  const indicatorMaterial = buildMaterial({
    ...materials.indicatorCyan,
    color: params.indicatorColor,
    emissive: params.indicatorColor,
    emissiveIntensity: 2.0,
  })
  const indicator = new Mesh(indicatorGeometry, indicatorMaterial)
  indicator.position.set(0, params.height + params.indicatorHeight / 2, params.radius + params.indicatorDepth / 2)
  indicator.name = "knob-indicator"
  group.add(indicator)

  // Grip texture (subtle ridges)
  const gripGeometry = new CylinderGeometry(
    params.radius * 1.1,
    params.radius * 1.1,
    params.height * 0.8,
    params.segments * 2
  )
  const gripPositions = gripGeometry.attributes.position
  for (let i = 0; i < gripPositions.count; i++) {
    const y = gripPositions.getY(i)
    const angle = Math.atan2(gripPositions.getX(i), gripPositions.getZ(i))
    const ridges = 16
    const displacement = Math.sin(angle * ridges) * 0.002
    const x = gripPositions.getX(i)
    const z = gripPositions.getZ(i)
    const len = Math.sqrt(x * x + z * z)
    if (len > 0) {
      gripPositions.setXYZ(i, x + (x / len) * displacement, y, z + (z / len) * displacement)
    }
  }
  gripGeometry.computeVertexNormals()

  const gripMaterial = buildMaterial({
    ...materials.anodizedBlack,
    color: new Color(params.baseColor).multiplyScalar(0.8),
    metalness: 0.3,
    roughness: 0.7,
  })
  const grip = new Mesh(gripGeometry, gripMaterial)
  grip.position.y = params.height / 2
  grip.name = "knob-grip"
  group.add(grip)

  return group
}

export interface FaderParams {
  width: number
  height: number
  trackWidth: number
  trackDepth: number
  knobWidth: number
  knobHeight: number
  knobDepth: number
  trackColor: string | number | Color
  knobColor: string | number | Color
  cornerRadius: number
}

export function createFader(params: FaderParams) {
  const group = new Group()

  // Track
  const trackGeometry = new RoundedBoxGeometry(
    params.trackWidth,
    params.height,
    params.trackDepth,
    params.cornerRadius,
    4
  )
  const trackMaterial = buildMaterial({
    ...materials.brushedSteel,
    color: params.trackColor,
    metalness: 0.85,
    roughness: 0.25,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
  })
  const track = new Mesh(trackGeometry, trackMaterial)
  track.position.y = params.height / 2
  track.castShadow = true
  track.receiveShadow = true
  track.name = "fader-track"
  group.add(track)

  // Knob
  const knobGeometry = new RoundedBoxGeometry(
    params.knobWidth,
    params.knobHeight,
    params.knobDepth,
    params.cornerRadius,
    4
  )
  const knobMaterial = buildMaterial({
    ...materials.anodizedBlack,
    color: params.knobColor,
    metalness: 0.5,
    roughness: 0.45,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  })
  const knob = new Mesh(knobGeometry, knobMaterial)
  knob.position.y = params.height / 2
  knob.castShadow = true
  knob.receiveShadow = true
  knob.name = "fader-knob"
  group.add(knob)

  // Track indicator line — emissive cybernetic strip
  const indicatorGeometry = new PlaneGeometry(params.trackWidth * 0.1, params.height * 0.8)
  const indicatorMaterial = buildMaterial({
    ...materials.indicatorCyan,
    color: new Color(params.knobColor).multiplyScalar(1.5),
    emissive: new Color(params.knobColor).multiplyScalar(1.5),
    emissiveIntensity: 1.4,
    transparent: true,
    opacity: 0.6,
    side: 2,
  })
  const indicator = new Mesh(indicatorGeometry, indicatorMaterial)
  indicator.position.set(0, params.height / 2, params.trackDepth / 2 + 0.001)
  indicator.rotation.x = -Math.PI / 2
  indicator.name = "fader-indicator"
  group.add(indicator)

  return group
}

export interface JackParams {
  type: "ts" | "trs" | "xlr" | "midi" | "usb" | "power"
  diameter: number
  depth: number
  color: string | Color
  segments: number
}

export function createJack(params: JackParams) {
  const group = new Group()

  switch (params.type) {
    case "ts":
    case "trs": {
      // 1/4" jack
      const jackGeometry = new CylinderGeometry(params.diameter / 2, params.diameter / 2, params.depth, params.segments)
      const jackMaterial = buildMaterial({
        ...materials.chrome,
        color: params.color,
        metalness: 0.9,
        roughness: 0.1,
      })
      const jack = new Mesh(jackGeometry, jackMaterial)
      jack.rotation.x = -Math.PI / 2
      jack.castShadow = true
      jack.name = `jack-${params.type}`
      group.add(jack)

      // Tip ring for TRS
      if (params.type === "trs") {
        const ringGeometry = new CylinderGeometry(params.diameter / 2 * 0.9, params.diameter / 2 * 0.9, params.depth * 0.1, params.segments)
        const ringMaterial = buildMaterial({
          ...materials.brushedSteel,
          color: new Color(params.color).multiplyScalar(0.5),
          metalness: 0.9,
          roughness: 0.1,
        })
        const ring = new Mesh(ringGeometry, ringMaterial)
        ring.rotation.x = -Math.PI / 2
        ring.position.y = params.depth * 0.45
        ring.name = "trs-ring"
        group.add(ring)
      }
      break
    }

    case "xlr": {
      // XLR connector (3-pin)
      const bodyGeometry = new CylinderGeometry(params.diameter / 2, params.diameter / 2, params.depth, params.segments)
      const bodyMaterial = buildMaterial({
        ...materials.chrome,
        color: params.color,
        metalness: 0.9,
        roughness: 0.1,
      })
      const body = new Mesh(bodyGeometry, bodyMaterial)
      body.rotation.x = -Math.PI / 2
      body.castShadow = true
      body.name = "xlr-body"
      group.add(body)

      // Pins
      const pinGeometry = new CylinderGeometry(0.002, 0.002, 0.015, 6)
      const pinMaterial = new MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1,
      })
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2
        const pin = new Mesh(pinGeometry, pinMaterial)
        pin.rotation.x = -Math.PI / 2
        pin.position.set(Math.cos(angle) * 0.006, Math.sin(angle) * 0.006, params.depth / 2 + 0.0075)
        pin.name = `xlr-pin-${i}`
        group.add(pin)
      }
      break
    }

    case "midi": {
      // 5-pin DIN
      const bodyGeometry = new CylinderGeometry(params.diameter / 2, params.diameter / 2, params.depth, params.segments)
      const bodyMaterial = buildMaterial({
        ...materials.chrome,
        color: params.color,
        metalness: 0.9,
        roughness: 0.1,
      })
      const body = new Mesh(bodyGeometry, bodyMaterial)
      body.rotation.x = -Math.PI / 2
      body.castShadow = true
      body.name = "midi-body"
      group.add(body)

      // 5 pins in arc
      const pinGeometry = new CylinderGeometry(0.0015, 0.0015, 0.01, 6)
      const pinMaterial = new MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1,
      })
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i / 4) * Math.PI / 2
        const pin = new Mesh(pinGeometry, pinMaterial)
        pin.rotation.x = -Math.PI / 2
        pin.position.set(Math.cos(angle) * 0.008, Math.sin(angle) * 0.008, params.depth / 2 + 0.005)
        pin.name = `midi-pin-${i}`
        group.add(pin)
      }
      break
    }

    case "usb": {
      // USB-B style
      const bodyGeometry = new BoxGeometry(params.diameter * 1.5, params.diameter * 0.8, params.depth)
      const bodyMaterial = new MeshStandardMaterial({
        color: params.color,
        metalness: 0.3,
        roughness: 0.7,
      })
      const body = new Mesh(bodyGeometry, bodyMaterial)
      body.castShadow = true
      body.name = "usb-body"
      group.add(body)
      break
    }

    case "power": {
      // DC barrel jack
      const outerGeometry = new CylinderGeometry(params.diameter / 2, params.diameter / 2, params.depth, params.segments)
      const outerMaterial = buildMaterial({
        ...materials.chrome,
        color: params.color,
        metalness: 0.9,
        roughness: 0.1,
      })
      const outer = new Mesh(outerGeometry, outerMaterial)
      outer.rotation.x = -Math.PI / 2
      outer.castShadow = true
      outer.name = "power-outer"
      group.add(outer)

      // Inner pin
      const innerGeometry = new CylinderGeometry(0.0015, 0.0015, params.depth * 0.8, 8)
      const innerMaterial = new MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1,
      })
      const inner = new Mesh(innerGeometry, innerMaterial)
      inner.rotation.x = -Math.PI / 2
      inner.position.z = params.depth * 0.4
      inner.name = "power-inner"
      group.add(inner)
      break
    }
  }

  return group
}

export interface DisplayParams {
  width: number
  height: number
  depth: number
  bezelWidth: number
  cornerRadius: number
  screenColor: string | Color
  bezelColor: string | Color
  glowColor?: string | Color
  glowIntensity?: number
}

export function createDisplay(params: DisplayParams) {
  const group = new Group()

  // Bezel
  const bezelGeometry = new RoundedBoxGeometry(
    params.width,
    params.height,
    params.depth,
    params.cornerRadius,
    4
  )
  const bezelMaterial = new MeshStandardMaterial({
    color: params.bezelColor,
    metalness: 0.5,
    roughness: 0.3,
  })
  const bezel = new Mesh(bezelGeometry, bezelMaterial)
  bezel.castShadow = true
  bezel.receiveShadow = true
  bezel.name = "display-bezel"
  group.add(bezel)

  // Screen
  const screenGeometry = new RoundedBoxGeometry(
    params.width - params.bezelWidth * 2,
    params.height - params.bezelWidth * 2,
    params.depth * 0.1,
    params.cornerRadius - params.bezelWidth,
    2
  )
  const screenMaterial = new MeshPhysicalMaterial({
    color: params.screenColor,
    metalness: 0,
    roughness: 0,
    transmission: 0.95,
    thickness: 0.01,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  })
  const screen = new Mesh(screenGeometry, screenMaterial)
  screen.position.z = params.depth / 2 * 0.9
  screen.name = "display-screen"
  group.add(screen)

  // Glow effect (emissive) — carries a scanline HUD overlay
  if (params.glowColor && params.glowIntensity && params.glowIntensity > 0) {
    const glowGeometry = new PlaneGeometry(
      params.width - params.bezelWidth * 2.5,
      params.height - params.bezelWidth * 2.5
    )
    const scanline = getScanlineTexture()
    const glowMaterial = new MeshStandardMaterial({
      color: params.glowColor,
      emissive: params.glowColor,
      emissiveIntensity: params.glowIntensity,
      emissiveMap: scanline,
      map: scanline,
      transparent: true,
      opacity: 0.85,
      side: 2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const glow = new Mesh(glowGeometry, glowMaterial)
    glow.position.z = params.depth / 2 + 0.002
    glow.name = "display-glow"
    group.add(glow)
  }

  return group
}

export interface EurorackCaseParams {
  hp: number // Horizontal pitch (1 HP = 5.08mm)
  rows: number
  height: number // Usually 3U = 133.35mm
  depth: number
  railHeight: number
  railWidth: number
  screwSpacing: number
  color: string | Color
  metalness: number
  roughness: number
}

export function createEurorackCase(params: EurorackCaseParams) {
  const group = new Group()
  const hpWidth = params.hp * 0.00508 // Convert HP to meters

  // Main case body
  const caseGeometry = new RoundedBoxGeometry(
    hpWidth + params.railWidth * 2,
    params.height * params.rows + params.railHeight * 2,
    params.depth,
    0.005,
    4
  )
  const caseMaterial = buildMaterial({
    ...materials.lacqueredPanelDark,
    color: params.color,
    metalness: params.metalness,
    roughness: params.roughness,
  })
  const caseBody = new Mesh(caseGeometry, caseMaterial)
  caseBody.castShadow = true
  caseBody.receiveShadow = true
  caseBody.name = "eurorack-case"
  group.add(caseBody)

  // Top and bottom rails
  const railGeometry = new BoxGeometry(
    hpWidth + params.railWidth * 2,
    params.railHeight,
    params.depth
  )
  const railMaterial = buildMaterial({
    ...materials.chrome,
    color: new Color(params.color).multiplyScalar(0.5),
    metalness: 0.9,
    roughness: 0.1,
  })

  const topRail = new Mesh(railGeometry, railMaterial)
  topRail.position.y = (params.height * params.rows + params.railHeight) / 2
  topRail.castShadow = true
  topRail.name = "eurorack-top-rail"
  group.add(topRail)

  const bottomRail = new Mesh(railGeometry, railMaterial)
  bottomRail.position.y = -(params.height * params.rows + params.railHeight) / 2
  bottomRail.castShadow = true
  bottomRail.name = "eurorack-bottom-rail"
  group.add(bottomRail)

  // Screw holes on rails
  const screwGeometry = new CylinderGeometry(0.002, 0.002, params.railHeight * 0.5, 8)
  const screwMaterial = new MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.9,
    roughness: 0.1,
  })

  const numScrews = Math.floor(hpWidth / params.screwSpacing)
  for (let i = 0; i <= numScrews; i++) {
    const x = (i * params.screwSpacing) - hpWidth / 2

    const topScrew = new Mesh(screwGeometry, screwMaterial)
    topScrew.position.set(x, (params.height * params.rows + params.railHeight) / 2, params.depth / 2 * 0.8)
    topScrew.name = `eurorack-screw-top-${i}`
    group.add(topScrew)

    const bottomScrew = new Mesh(screwGeometry, screwMaterial)
    bottomScrew.position.set(x, -(params.height * params.rows + params.railHeight) / 2, params.depth / 2 * 0.8)
    bottomScrew.name = `eurorack-screw-bottom-${i}`
    group.add(bottomScrew)
  }

  // Power supply area (rear)
  const psuWidth = 0.08 // 8cm
  const psuGeometry = new BoxGeometry(psuWidth, params.height * params.rows * 0.8, params.depth * 0.3)
  const psuMaterial = new MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.7,
    roughness: 0.4,
  })
  const psu = new Mesh(psuGeometry, psuMaterial)
  psu.position.set(hpWidth / 2 + psuWidth / 2, 0, -params.depth / 2 + params.depth * 0.15)
  psu.castShadow = true
  psu.name = "eurorack-psu"
  group.add(psu)

  // Bus board slots
  const slotGeometry = new BoxGeometry(0.002, params.height * 0.8, params.depth * 0.2)
  const slotMaterial = new MeshStandardMaterial({
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.7,
  })

  for (let row = 0; row < params.rows; row++) {
    const y = (row - (params.rows - 1) / 2) * params.height
    const slot = new Mesh(slotGeometry, slotMaterial)
    slot.position.set(hpWidth / 2 + 0.001, y, -params.depth / 2 + params.depth * 0.25)
    slot.name = `eurorack-slot-${row}`
    group.add(slot)
  }

  return group
}

export interface PatchCableParams {
  length: number
  thickness: number
  color: string | Color
  segments: number
  curveSegments: number
}

export function createPatchCable(params: PatchCableParams) {
  const group = new Group()

  // Cable body (curved tube)
  const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(0, params.length * 0.3, params.length * 0.2),
    new Vector3(params.length * 0.5, params.length * 0.6, params.length * 0.5),
    new Vector3(params.length, params.length * 0.2, params.length),
  ])

  const tubeGeometry = new THREE.TubeGeometry(curve, params.curveSegments, params.thickness / 2, 8, false)
  const tubeMaterial = new MeshStandardMaterial({
    color: params.color,
    metalness: 0.1,
    roughness: 0.8,
  })
  const cable = new Mesh(tubeGeometry, tubeMaterial)
  cable.castShadow = true
  cable.name = "patch-cable"
  group.add(cable)

  // Connectors at each end
  const connectorGeometry = new CylinderGeometry(params.thickness * 1.5, params.thickness * 1.5, 0.02, 8)
  const connectorMaterial = new MeshStandardMaterial({
    color: new Color(params.color).multiplyScalar(0.5),
    metalness: 0.8,
    roughness: 0.2,
  })

  const connector1 = new Mesh(connectorGeometry, connectorMaterial)
  connector1.position.set(0, 0, 0)
  connector1.name = "patch-connector-1"
  group.add(connector1)

  const connector2 = new Mesh(connectorGeometry, connectorMaterial)
  connector2.position.set(params.length, params.length * 0.2, params.length)
  connector2.name = "patch-connector-2"
  group.add(connector2)

  return group
}

// ============================================================================
// Material Presets
// ============================================================================

export const materials = {
  // ── Cybernetic premium finishes (Phase 2) ───────────────────────────
  // Lacquered panel: dark chassis with a glossy clearcoat sheen.
  lacqueredPanel: {
    __cyberKey: "lacqueredPanel",
    color: 0x0d0d14,
    metalness: 0.6,
    roughness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  },
  lacqueredPanelDark: {
    __cyberKey: "lacqueredPanelDark",
    color: 0x14141e,
    metalness: 0.7,
    roughness: 0.4,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  },
  // Anodized accent metals — brushed, keyed to the cybernetic palette.
  anodizedCyan: {
    __cyberKey: "anodizedCyan",
    color: 0x10303a,
    metalness: 0.85,
    roughness: 0.35,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  },
  anodizedAmber: {
    __cyberKey: "anodizedAmber",
    color: 0x3a2a0a,
    metalness: 0.85,
    roughness: 0.35,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  },
  anodizedCoral: {
    __cyberKey: "anodizedCoral",
    color: 0x3a1018,
    metalness: 0.85,
    roughness: 0.35,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  },
  anodizedEmerald: {
    __cyberKey: "anodizedEmerald",
    color: 0x0a3a22,
    metalness: 0.85,
    roughness: 0.35,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  },
  // Emissive screen/LED presets — moderate intensity (SelectiveBloom amplifies).
  emissiveCyan: {
    __cyberKey: "emissiveCyan",
    color: 0x00121a,
    emissive: 0x00d4ff,
    emissiveIntensity: 1.2,
    metalness: 0,
    roughness: 0.4,
    transparent: true,
    opacity: 0.9,
  },
  emissiveAmber: {
    __cyberKey: "emissiveAmber",
    color: 0x1a0f00,
    emissive: 0xffb800,
    emissiveIntensity: 1.2,
    metalness: 0,
    roughness: 0.4,
  },
  emissiveWhite: {
    __cyberKey: "emissiveWhite",
    color: 0x0a0a0a,
    emissive: 0xffffff,
    emissiveIntensity: 0.9,
    metalness: 0,
    roughness: 0.5,
  },
  // Glowing knob indicator ring (bright emissive accent).
  indicatorCyan: {
    __cyberKey: "indicatorCyan",
    color: 0x00d4ff,
    emissive: 0x00d4ff,
    emissiveIntensity: 2.0,
    metalness: 0,
    roughness: 0.3,
    transparent: true,
    opacity: 0.95,
  },
  indicatorAmber: {
    __cyberKey: "indicatorAmber",
    color: 0xffb800,
    emissive: 0xffb800,
    emissiveIntensity: 2.0,
    metalness: 0,
    roughness: 0.3,
    transparent: true,
    opacity: 0.95,
  },
  // Status LED (small, emissive — cloned per-instance for independent on/off).
  statusLedOn: {
    __cyberKey: "statusLedOn",
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 3.0,
    metalness: 0,
    roughness: 0.2,
  },
  statusLedOff: {
    __cyberKey: "statusLedOff",
    color: 0x113322,
    emissive: 0x001a10,
    emissiveIntensity: 0.3,
    metalness: 0,
    roughness: 0.6,
  },

  // Metal finishes
  brushedAluminum: {
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  },
  anodizedBlack: {
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.4,
  },
  anodizedDarkGray: {
    color: 0x333333,
    metalness: 0.8,
    roughness: 0.35,
  },
  powderCoatWhite: {
    color: 0xf5f5f5,
    metalness: 0.1,
    roughness: 0.8,
  },
  powderCoatBlack: {
    color: 0x1a1a1a,
    metalness: 0.1,
    roughness: 0.7,
  },
  chrome: {
    color: 0xeeeeee,
    metalness: 1,
    roughness: 0.05,
  },
  brushedSteel: {
    color: 0xaaaaaa,
    metalness: 0.9,
    roughness: 0.4,
  },
  gold: {
    color: 0xffd700,
    metalness: 1,
    roughness: 0.1,
  },

  // Plastics
  matteBlackPlastic: {
    color: 0x111111,
    metalness: 0,
    roughness: 0.9,
  },
  matteGrayPlastic: {
    color: 0x444444,
    metalness: 0,
    roughness: 0.85,
  },
  glossyBlackPlastic: {
    color: 0x0a0a0a,
    metalness: 0,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  },
  keycapWhite: {
    color: 0xf0f0f0,
    metalness: 0,
    roughness: 0.8,
  },
  keycapBlack: {
    color: 0x1a1a1a,
    metalness: 0,
    roughness: 0.75,
  },

  // Glass/Display
  displayGlass: {
    color: 0x001122,
    metalness: 0,
    roughness: 0,
    transmission: 0.95,
    thickness: 0.01,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    ior: 1.5,
  },

  // LED
  ledRed: {
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 5,
  },
  ledGreen: {
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 5,
  },
  ledBlue: {
    color: 0x0088ff,
    emissive: 0x0088ff,
    emissiveIntensity: 5,
  },
  ledAmber: {
    color: 0xff8800,
    emissive: 0xff8800,
    emissiveIntensity: 5,
  },
  ledCyan: {
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 5,
  },
  ledWhite: {
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 3,
  },

  // Wood
  walnut: {
    color: 0x3d2b1f,
    metalness: 0,
    roughness: 0.7,
  },
  bamboo: {
    color: 0xc8b896,
    metalness: 0,
    roughness: 0.6,
  },
  maple: {
    color: 0xe8d5b7,
    metalness: 0,
    roughness: 0.65,
  },
} as const

// ============================================================================
// Color Schemes
// ============================================================================

export const colorSchemes = {
  dark: {
    chassis: 0x0d0d14,
    panel: 0x14141e,
    accent: 0x00d4ff,
    secondary: 0xffb800,
    keys: { white: 0xf0f0f5, black: 0x1a1a1a },
    knobs: 0x1a1a1a,
    faders: { track: 0x2a2a3e, knob: 0x1a1a1a },
    jacks: 0x333333,
    displays: { bezel: 0x1a1a1a, screen: 0x001122, glow: 0x00d4ff },
    wood: 0x3d2b1f,
    knobBase: 0x1a1a1a,
    knobIndicator: 0x00d4ff,
    buttonColor: 0x2a2a3e,
    buttonActive: 0xff4d4d,
    padOn: 0x00d4ff,
    padOff: 0x1a1a1a,
    displayBezel: 0x1a1a1a,
    displayScreen: 0x001122,
    displayGlow: 0x00d4ff,
    jackColor: 0x333333,
    ledOn: 0x00ff88,
    ledOff: 0x1a1a1a,
    ledClip: 0xff4d4d,
    ventColor: 0x1a1a1a,
    screwColor: 0x333333,
    knobBaseAlt: 0x2a2a3e,
    faderTrack: 0x2a2a3e,
    faderKnob: 0x1a1a1a,
  },
  vintage: {
    chassis: 0x2d2820,
    panel: 0x3d3528,
    accent: 0xffb800,
    secondary: 0xff4d4d,
    keys: { white: 0xf5f0e0, black: 0x2a2018 },
    knobs: 0x3d2818,
    faders: { track: 0x4a4030, knob: 0x3d2818 },
    jacks: 0x4a4030,
    displays: { bezel: 0x3d2818, screen: 0x1a2a1a, glow: 0xffb800 },
    wood: 0x5d4a30,
    knobBase: 0x3d2818,
    knobIndicator: 0xffb800,
    buttonColor: 0x4a4030,
    buttonActive: 0xff4d4d,
    padOn: 0xffb800,
    padOff: 0x3d2818,
    displayBezel: 0x3d2818,
    displayScreen: 0x1a2a1a,
    displayGlow: 0xffb800,
    jackColor: 0x4a4030,
    ledOn: 0xffb800,
    ledOff: 0x3d2818,
    ledClip: 0xff4d4d,
    ventColor: 0x3d2818,
    screwColor: 0x4a4030,
    knobBaseAlt: 0x4a4030,
    faderTrack: 0x4a4030,
    faderKnob: 0x3d2818,
  },
  modern: {
    chassis: 0x1a1a2e,
    panel: 0x22223a,
    accent: 0x00ff88,
    secondary: 0xb877ff,
    keys: { white: 0xffffff, black: 0x0d0d1a },
    knobs: 0x0d0d1a,
    faders: { track: 0x1a1a2e, knob: 0x0d0d1a },
    jacks: 0x2a2a3e,
    displays: { bezel: 0x0d0d1a, screen: 0x001111, glow: 0x00ff88 },
    wood: 0x2d2d3d,
    knobBase: 0x0d0d1a,
    knobIndicator: 0x00ff88,
    buttonColor: 0x1a1a2e,
    buttonActive: 0x00ff88,
    padOn: 0x00ff88,
    padOff: 0x0d0d1a,
    displayBezel: 0x0d0d1a,
    displayScreen: 0x001111,
    displayGlow: 0x00ff88,
    jackColor: 0x2a2a3e,
    ledOn: 0x00ff88,
    ledOff: 0x0d0d1a,
    ledClip: 0xff4d4d,
    ventColor: 0x0d0d1a,
    screwColor: 0x2a2a3e,
    knobBaseAlt: 0x1a1a2e,
    faderTrack: 0x1a1a2e,
    faderKnob: 0x0d0d1a,
  },
} as const

// ============================================================================
// Instanced Mesh Helpers
// ============================================================================

export function createInstancedKnobs(
  count: number,
  knobGeometry: any,
  knobMaterial: any,
  positions: any[],
  rotations: any[] = [],
  scales: any[] = []
) {
  const instancedMesh = new InstancedMesh(knobGeometry, knobMaterial, count)
  instancedMesh.instanceMatrix.setUsage(35048) // DynamicDrawUsage
  instancedMesh.castShadow = true
  instancedMesh.receiveShadow = true

  const dummy = new Object3D()

  for (let i = 0; i < count; i++) {
    dummy.position.copy(positions[i])
    if (rotations[i]) dummy.rotation.copy(rotations[i])
    if (scales[i]) dummy.scale.copy(scales[i])
    else dummy.scale.set(1, 1, 1)
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
  }

  return instancedMesh
}

export function createInstancedKeys(
  count: number,
  keyGeometry: any,
  keyMaterial: any,
  positions: any[],
  colors: any[] = []
) {
  const instancedMesh = new InstancedMesh(keyGeometry, keyMaterial, count)
  instancedMesh.instanceMatrix.setUsage(35048) // DynamicDrawUsage
  ;(instancedMesh as any).instanceColor = new InstancedBufferAttribute(new Float32Array(count * 3), 3)
  instancedMesh.castShadow = true
  instancedMesh.receiveShadow = true

  const dummy = new Object3D()
  const color = new Color()

  for (let i = 0; i < count; i++) {
    dummy.position.copy(positions[i])
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)

    if (colors[i]) {
      color.copy(colors[i])
      ;(instancedMesh as any).instanceColor.setXYZ(i, color.r, color.g, color.b)
    }
  }

  return instancedMesh
}