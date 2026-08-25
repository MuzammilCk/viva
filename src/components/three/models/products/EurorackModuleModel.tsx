"use client"

import { Group, Mesh, CylinderGeometry, BoxGeometry, PlaneGeometry } from "three"
import { MeshStandardMaterial, MeshPhysicalMaterial, Color } from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { colorSchemes } from "../geometry"
import { useKnobDrag, useFaderDrag } from "../../hooks/usePointerControls"

interface EurorackModuleModelProps {
  variant?: "vco" | "vcf" | "vca" | "env" | "lfo" | "seq" | "util"
  colorScheme?: keyof typeof colorSchemes
  hp?: number
  animated?: boolean
  panelColor?: string
  knobCount?: number
  jackCount?: number
  hasDisplay?: boolean
  onKnobTurn?: (knobId: string, value: number) => void
  onSliderMove?: (sliderId: string, value: number) => void
  onToggle?: (id: string, on: boolean) => void
  onPatch?: (jackId: string) => void
}

const moduleConfigs: Record<string, { knobs: number; jacks: number; display: boolean; switches: number; sliders: number }> = {
  vco: { knobs: 6, jacks: 8, display: false, switches: 2, sliders: 0 },
  vcf: { knobs: 5, jacks: 6, display: false, switches: 1, sliders: 0 },
  vca: { knobs: 3, jacks: 4, display: false, switches: 1, sliders: 0 },
  env: { knobs: 4, jacks: 4, display: false, switches: 2, sliders: 0 },
  lfo: { knobs: 4, jacks: 4, display: false, switches: 1, sliders: 0 },
  seq: { knobs: 4, jacks: 6, display: true, switches: 4, sliders: 0 },
  util: { knobs: 2, jacks: 4, display: false, switches: 2, sliders: 0 },
}

export function EurorackModuleModel({
  variant = "vco",
  colorScheme = "dark",
  hp = 10,
  animated = true,
  panelColor,
  knobCount,
  jackCount,
  hasDisplay,
  onKnobTurn,
  onSliderMove,
  onToggle,
  onPatch,
}: EurorackModuleModelProps) {
  const group = useMemo(() => {
    const g = new Group()

    const scheme = colorSchemes[colorScheme]
    const config = moduleConfigs[variant]

    // Module dimensions (Eurorack standard)
    const height = 128.5 / 1000 // 128.5mm = 3U in meters
    const width = hp * 5.08 / 1000 // 1 HP = 5.08mm
    const depth = 35 / 1000 // ~35mm typical module depth
    const panelThickness = 1.6 / 1000 // 1.6mm PCB
    const cornerRadius = 0.5 / 1000

    const actualKnobCount = knobCount ?? config.knobs
    const actualJackCount = jackCount ?? config.jacks
    const actualDisplay = hasDisplay ?? config.display

    // ===== FRONT PANEL (PCB) =====
    const panelGeo = new RoundedBoxGeometry(width, height, panelThickness, cornerRadius, 2)
    const panelMat = new MeshStandardMaterial({
      color: panelColor || scheme.panel,
      metalness: 0.85,
      roughness: 0.15,
    })
    const panel = new Mesh(panelGeo, panelMat)
    panel.position.z = depth - panelThickness / 2
    panel.castShadow = true
    panel.receiveShadow = true
    panel.name = "front-panel"
    g.add(panel)

    // ===== CHASSIS / BODY =====
    const bodyGeo = new RoundedBoxGeometry(
      width - 0.002,
      height - 0.002,
      depth - panelThickness,
      cornerRadius,
      2
    )
    const bodyMat = new MeshStandardMaterial({
      color: scheme.chassis,
      metalness: 0.7,
      roughness: 0.3,
    })
    const body = new Mesh(bodyGeo, bodyMat)
    body.position.z = (depth - panelThickness) / 2 - panelThickness
    body.castShadow = true
    body.receiveShadow = true
    body.name = "module-body"
    g.add(body)

    // ===== KNOBS =====
    const knobRadius = 0.006
    const knobHeight = 0.01
    const knobSpacing = (width * 0.8) / Math.max(1, actualKnobCount - 1)
    const knobStartX = -width * 0.4

    for (let i = 0; i < actualKnobCount; i++) {
      const x = knobStartX + i * knobSpacing
      const y = 0.015 // Slightly above center

      const knobGroup = new Group()

      // Knob base
      const baseGeo = new CylinderGeometry(knobRadius, knobRadius * 1.1, knobHeight, 20)
      const baseMat = new MeshStandardMaterial({
        color: scheme.knobBase,
        metalness: 0.3,
        roughness: 0.7,
      })
      const base = new Mesh(baseGeo, baseMat)
      base.position.y = knobHeight / 2
      base.castShadow = true
      base.name = `knob-base-${i}`
      knobGroup.add(base)

      // Knob grip (knurled)
      const gripGeo = new CylinderGeometry(knobRadius * 1.1, knobRadius * 1.1, knobHeight * 0.7, 24)
      const gripPos = gripGeo.attributes.position
      for (let v = 0; v < gripPos.count; v++) {
        const angle = Math.atan2(gripPos.getX(v), gripPos.getZ(v))
        const ridges = 16
        const displacement = Math.sin(angle * ridges) * 0.0008
        const x = gripPos.getX(v)
        const z = gripPos.getZ(v)
        const len = Math.sqrt(x * x + z * z)
        if (len > 0) {
          gripPos.setXYZ(v, x + (x / len) * displacement, gripPos.getY(v), z + (z / len) * displacement)
        }
      }
      gripGeo.computeVertexNormals()

      const gripMat = new MeshStandardMaterial({
        color: new Color(scheme.knobBase).multiplyScalar(0.6),
        metalness: 0.2,
        roughness: 0.9,
      })
      const grip = new Mesh(gripGeo, gripMat)
      grip.position.y = knobHeight / 2
      grip.name = `knob-grip-${i}`
      knobGroup.add(grip)

      // Indicator line
      const indicatorGeo = new BoxGeometry(0.0012, 0.0035, knobRadius + 0.001)
      const indicatorMat = new MeshStandardMaterial({
        color: scheme.knobIndicator,
        emissive: scheme.knobIndicator,
        emissiveIntensity: 0.3,
      })
      const indicator = new Mesh(indicatorGeo, indicatorMat)
      indicator.position.set(0, knobHeight + 0.0015, knobRadius + 0.0005)
      indicator.name = `knob-indicator-${i}`
      knobGroup.add(indicator)

      knobGroup.position.set(x, y, depth - panelThickness / 2 + 0.008)
      g.add(knobGroup)
    }

    // ===== JACKS =====
    const jackRadius = 0.0035
    const jackDepth = 0.012
    const jackSpacing = (width * 0.8) / Math.max(1, actualJackCount - 1)
    const jackStartX = -width * 0.4
    const jackY = -height / 2 + 0.015

    for (let i = 0; i < actualJackCount; i++) {
      const x = jackStartX + i * jackSpacing

      const jackGroup = new Group()

      // Jack body
      const jackGeo = new CylinderGeometry(jackRadius, jackRadius, jackDepth, 16)
      const jackMat = new MeshStandardMaterial({
        color: scheme.jackColor,
        metalness: 0.9,
        roughness: 0.1,
      })
      const jack = new Mesh(jackGeo, jackMat)
      jack.rotation.x = Math.PI / 2
      jack.castShadow = true
      jack.name = `jack-${i}`
      jackGroup.add(jack)

      // Jack tip (brass color)
      const tipGeo = new CylinderGeometry(jackRadius * 0.5, jackRadius * 0.5, 0.003, 12)
      const tipMat = new MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1,
      })
      const tip = new Mesh(tipGeo, tipMat)
      tip.rotation.x = Math.PI / 2
      tip.position.y = jackDepth / 2 + 0.001
      tip.name = `jack-tip-${i}`
      jackGroup.add(tip)

      jackGroup.position.set(x, jackY, depth - panelThickness / 2 + jackDepth / 2)
      g.add(jackGroup)
    }

    // ===== DISPLAY (for sequencers, etc.) =====
    if (actualDisplay) {
      const displayWidth = Math.min(0.05, width * 0.5)
      const displayHeight = 0.018
      const displayDepth = 0.005

      const displayGroup = new Group()

      const bezelGeo = new RoundedBoxGeometry(displayWidth, displayHeight, displayDepth, 0.002, 2)
      const bezelMat = new MeshStandardMaterial({
        color: scheme.displayBezel,
        metalness: 0.5,
        roughness: 0.3,
      })
      const bezel = new Mesh(bezelGeo, bezelMat)
      bezel.castShadow = true
      bezel.name = "display-bezel"
      displayGroup.add(bezel)

      const screenGeo = new RoundedBoxGeometry(displayWidth - 0.004, displayHeight - 0.004, displayDepth * 0.1, 0.001, 1)
      const screenMat = new MeshPhysicalMaterial({
        color: scheme.displayScreen,
        metalness: 0,
        roughness: 0,
        transmission: 0.95,
        thickness: 0.002,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      })
      const screen = new Mesh(screenGeo, screenMat)
      screen.position.z = displayDepth / 2 * 0.9
      screen.name = "display-screen"
      displayGroup.add(screen)

      const glowGeo = new PlaneGeometry(displayWidth - 0.008, displayHeight - 0.008)
      const glowMat = new MeshStandardMaterial({
        color: scheme.displayGlow,
        emissive: scheme.displayGlow,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.6,
        side: 2,
        depthWrite: false,
      })
      const glow = new Mesh(glowGeo, glowMat)
      glow.position.z = displayDepth / 2 + 0.001
      glow.name = "display-glow"
      displayGroup.add(glow)

      displayGroup.position.set(0, height / 2 - displayHeight / 2 - 0.01, depth - panelThickness / 2 + 0.006)
      g.add(displayGroup)
    }

    // ===== SWITCHES =====
    const switchCount = config.switches
    if (switchCount > 0) {
      const switchSpacing = (width * 0.6) / Math.max(1, switchCount - 1)
      const switchStartX = -width * 0.3
      const switchY = height / 2 - 0.025

      for (let i = 0; i < switchCount; i++) {
        const x = switchStartX + i * switchSpacing

        const switchGroup = new Group()

        // Switch body
        const bodyGeo = new BoxGeometry(0.006, 0.012, 0.006)
        const bodyMat = new MeshStandardMaterial({
          color: scheme.buttonColor,
          metalness: 0.5,
          roughness: 0.4,
        })
        const body = new Mesh(bodyGeo, bodyMat)
        body.castShadow = true
        body.name = `switch-body-${i}`
        switchGroup.add(body)

        // Toggle
        const toggleGeo = new BoxGeometry(0.003, 0.008, 0.004)
        const toggleMat = new MeshStandardMaterial({
          color: scheme.knobBase,
          metalness: 0.3,
          roughness: 0.7,
        })
        const toggle = new Mesh(toggleGeo, toggleMat)
        toggle.position.y = 0.006
        toggle.castShadow = true
        toggle.name = `switch-toggle-${i}`
        switchGroup.add(toggle)

        switchGroup.position.set(x, switchY, depth - panelThickness / 2 + 0.006)
        g.add(switchGroup)
      }
    }

    // ===== SLIDERS =====
    const sliderCount = config.sliders
    if (sliderCount > 0) {
      const sliderHeight = 0.04
      const sliderTrackWidth = 0.004
      const sliderKnobWidth = 0.014
      const sliderSpacing = (width * 0.6) / Math.max(1, sliderCount - 1)
      const sliderStartX = -width * 0.3
      const sliderY = -0.01

      for (let i = 0; i < sliderCount; i++) {
        const x = sliderStartX + i * sliderSpacing

        const sliderGroup = new Group()

        // Track
        const trackGeo = new RoundedBoxGeometry(sliderTrackWidth, sliderHeight, 0.004, 0.002, 2)
        const trackMat = new MeshStandardMaterial({
          color: scheme.faderTrack,
          metalness: 0.8,
          roughness: 0.2,
        })
        const track = new Mesh(trackGeo, trackMat)
        track.position.y = sliderHeight / 2
        track.castShadow = true
        track.name = `slider-track-${i}`
        sliderGroup.add(track)

        // Knob
        const knobGeo = new RoundedBoxGeometry(sliderKnobWidth, 0.008, 0.014, 0.002, 2)
        const knobMat = new MeshStandardMaterial({
          color: scheme.faderKnob,
          metalness: 0.3,
          roughness: 0.6,
          emissive: scheme.faderKnob,
          emissiveIntensity: 0.2,
        })
        const knob = new Mesh(knobGeo, knobMat)
        knob.position.y = sliderHeight * 0.7
        knob.castShadow = true
        knob.name = `slider-knob-${i}`
        sliderGroup.add(knob)

        sliderGroup.position.set(x, sliderY, depth - panelThickness / 2 + 0.01)
        g.add(sliderGroup)
      }
    }

    // ===== SCREW HOLES (4 corners) =====
    const screwPositions = [
      { x: -width / 2 + 0.004, y: -height / 2 + 0.004 },
      { x: width / 2 - 0.004, y: -height / 2 + 0.004 },
      { x: -width / 2 + 0.004, y: height / 2 - 0.004 },
      { x: width / 2 - 0.004, y: height / 2 - 0.004 },
    ]

    screwPositions.forEach((pos, i) => {
      const screwGroup = new Group()

      // Screw head
      const headGeo = new CylinderGeometry(0.002, 0.0025, 0.0015, 12)
      const headMat = new MeshStandardMaterial({
        color: scheme.screwColor,
        metalness: 0.9,
        roughness: 0.2,
      })
      const head = new Mesh(headGeo, headMat)
      head.rotation.x = -Math.PI / 2
      head.castShadow = true
      head.name = `screw-head-${i}`
      screwGroup.add(head)

      // Screw slot (cross)
      const slotGeo = new BoxGeometry(0.003, 0.0003, 0.001)
      const slotMat = new MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.9,
      })
      const slot1 = new Mesh(slotGeo, slotMat)
      slot1.rotation.x = -Math.PI / 2
      slot1.position.z = 0.001
      slot1.name = `screw-slot-1-${i}`
      screwGroup.add(slot1)

      const slot2 = new Mesh(slotGeo, slotMat)
      slot2.rotation.x = -Math.PI / 2
      slot2.rotation.z = Math.PI / 2
      slot2.position.z = 0.001
      slot2.name = `screw-slot-2-${i}`
      screwGroup.add(slot2)

      screwGroup.position.set(pos.x, pos.y, depth - panelThickness / 2 + 0.001)
      g.add(screwGroup)
    })

    return g
  }, [variant, colorScheme, hp, panelColor, knobCount, jackCount, hasDisplay])

  const knobId = (name: string) => {
    const m = name.match(/^knob-base-(\d+)$/)
    return m ? `knob-${m[1]}` : null
  }
  const sliderId = (name: string) => {
    const m = name.match(/^slider-knob-(\d+)$/)
    return m ? `slider-${m[1]}` : null
  }
  const knobHandlers = useKnobDrag({ idFromName: knobId, onTurn: onKnobTurn })
  const sliderHandlers = useFaderDrag({
    idFromName: sliderId,
    trackLength: 0.04,
    pixelsPerSweep: 120,
    onMove: onSliderMove,
  })

  const switchState = useRef<Record<string, boolean>>({})

  useFrame((state) => {
    if (!animated || !group) return
    const t = state.clock.elapsedTime
    const glow = group.getObjectByName("display-glow")
    if (glow) {
      const mat = (glow as Mesh).material as any
      if (mat && "emissiveIntensity" in mat) {
        mat.emissiveIntensity = 0.5 + (0.6 + 0.4 * Math.sin(t * 1.1)) * 0.4
      }
    }
  })

  return (
    <primitive
      object={group}
      onPointerDown={(e: any) => {
        const n = e.object.name
        // Toggles: click flips the switch lever.
        const sw = n.match(/^switch-toggle-(\d+)$/)
        if (sw) {
          e.stopPropagation()
          const id = `switch-${sw[1]}`
          switchState.current[id] = !switchState.current[id]
          e.object.rotation.x = switchState.current[id] ? 0.3 : -0.3
          onToggle?.(id, switchState.current[id])
          return
        }
        // Jack patch: clicking a jack emits a patch event.
        if (n.startsWith("jack-")) {
          e.stopPropagation()
          onPatch?.(n)
          return
        }
        knobHandlers.onPointerDown(e)
        sliderHandlers.onPointerDown(e)
      }}
    />
  )
}