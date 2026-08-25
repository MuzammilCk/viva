"use client"

import { Group, Mesh, BoxGeometry, RingGeometry } from "three"
import { MeshStandardMaterial } from "three"
import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { createSynthBody, createKeyboard, createKnob, createFader, createJack, createDisplay, createEurorackCase, materials, colorSchemes } from "../geometry"
import { useKnobDrag, useFaderDrag, useKeyPress } from "../../hooks/usePointerControls"

interface SynthesizerModelProps {
  variant?: "mono" | "poly" | "modular" | "desktop"
  colorScheme?: keyof typeof colorSchemes
  animated?: boolean
  onKnobTurn?: (knobId: string, value: number) => void
  onKeyPress?: (note: number, velocity: number) => void
  onFaderMove?: (faderId: string, value: number) => void
}

export function SynthesizerModel({
  variant = "poly",
  colorScheme = "dark",
  animated = true,
  onKnobTurn,
  onKeyPress,
  onFaderMove,
}: SynthesizerModelProps) {
  const group = useMemo(() => {
    const g = new Group()

    const scheme = colorSchemes[colorScheme]

    // Dimensions based on variant
    const dims: { width: number; height: number; depth: number; octaves: number; hp?: number; rows?: number } = {
      mono: { width: 0.45, height: 0.15, depth: 0.3, octaves: 3, hp: 0, rows: 0 },
      poly: { width: 0.85, height: 0.18, depth: 0.35, octaves: 5, hp: 0, rows: 0 },
      modular: { width: 0.6, height: 0.133, depth: 0.2, octaves: 0, hp: 84, rows: 3 },
      desktop: { width: 0.4, height: 0.12, depth: 0.25, octaves: 0, hp: 0, rows: 0 },
    }[variant]

    if (variant === "modular") {
      // Eurorack case
      const eurorack = createEurorackCase({
        hp: dims.hp!,
        rows: dims.rows!,
        height: dims.height,
        depth: dims.depth,
        railHeight: 0.008,
        railWidth: 0.008,
        screwSpacing: 0.0254,
        color: String(scheme.chassis),
        metalness: 0.8,
        roughness: 0.3,
      })
      g.add(eurorack)
      return g
    }

    // Main synth body
    const body = createSynthBody({
      width: dims.width,
      height: dims.height,
      depth: dims.depth,
      cornerRadius: 0.015,
      panelDepth: 0.008,
      bezelWidth: 0.008,
      color: String(scheme.chassis),
      metalness: 0.8,
      roughness: 0.3,
    })
    g.add(body)

    // Keyboard (if applicable)
    const octaves = dims.octaves ?? 0
    if (octaves > 0) {
      const keyboard = createKeyboard({
        octaves,
        keyWidth: 0.022,
        keyDepth: 0.12,
        keyHeight: 0.012,
        blackKeyWidthRatio: 0.65,
        blackKeyDepthRatio: 0.65,
        blackKeyHeightRatio: 0.6,
        whiteKeyColor: String(scheme.keys.white),
        blackKeyColor: String(scheme.keys.black),
        gap: 0.001,
      })
      keyboard.position.set(0, -dims.height / 2 - 0.006, dims.depth / 2 - 0.04)
      g.add(keyboard)
    }

    // Control panel elements
    const panelZ = dims.depth / 2 - 0.004

    // Knobs layout
    const knobPositions = generateKnobPositions(variant, dims.width, dims.height)
    knobPositions.forEach((pos) => {
      const knob = createKnob({
        radius: 0.012,
        height: 0.018,
        indicatorWidth: 0.002,
        indicatorHeight: 0.008,
        indicatorDepth: 0.003,
        baseColor: String(scheme.knobs),
        indicatorColor: String(scheme.accent),
        segments: 24,
      })
      knob.position.set(pos.x, pos.y, panelZ)
      knob.rotation.x = -Math.PI / 2
      knob.name = `knob-${pos.id}`
      g.add(knob)
    })

    // Faders
    const faderPositions = generateFaderPositions(variant, dims.width, dims.height)
    faderPositions.forEach((pos) => {
      const fader = createFader({
        width: 0.018,
        height: 0.06,
        trackWidth: 0.006,
        trackDepth: 0.008,
        knobWidth: 0.02,
        knobHeight: 0.025,
        knobDepth: 0.02,
        trackColor: String(scheme.faders.track),
        knobColor: String(scheme.faders.knob),
        cornerRadius: 0.003,
      })
      fader.position.set(pos.x, pos.y, panelZ)
      fader.name = `fader-${pos.id}`
      g.add(fader)
    })

    // Display
    if (variant !== "mono") {
      const display = createDisplay({
        width: 0.15,
        height: 0.05,
        depth: 0.012,
        bezelWidth: 0.004,
        cornerRadius: 0.006,
        screenColor: String(scheme.displays.screen),
        bezelColor: String(scheme.displays.bezel),
        glowColor: String(scheme.displays.glow),
        glowIntensity: 0.8,
      })
      display.position.set(-dims.width * 0.25, dims.height * 0.2, panelZ)
      display.rotation.x = -Math.PI / 2
      display.name = "main-display"
      g.add(display)
    }

    // Patch bay / Jacks
    const jackPositions = generateJackPositions(variant, dims.width, dims.height)
    jackPositions.forEach((pos) => {
      const jack = createJack({
        type: pos.type,
        diameter: pos.type === "xlr" ? 0.025 : 0.013,
        depth: 0.025,
        color: String(scheme.jacks),
        segments: 16,
      })
      jack.position.set(pos.x, pos.y, panelZ)
      jack.name = `jack-${pos.type}-${pos.id}`
      g.add(jack)
    })

    // Side panels (wood)
    if (variant === "poly" || variant === "desktop") {
      const sidePanelGeometry = new BoxGeometry(0.012, dims.height * 0.9, dims.depth * 0.9)
      const sidePanelMaterial = new MeshStandardMaterial(materials.walnut)

      const leftPanel = new Mesh(sidePanelGeometry, sidePanelMaterial)
      leftPanel.position.set(-dims.width / 2 - 0.006, 0, 0)
      leftPanel.castShadow = true
      leftPanel.name = "side-panel-left"
      g.add(leftPanel)

      const rightPanel = new Mesh(sidePanelGeometry, sidePanelMaterial)
      rightPanel.position.set(dims.width / 2 + 0.006, 0, 0)
      rightPanel.castShadow = true
      rightPanel.name = "side-panel-right"
      g.add(rightPanel)
    }

    // Brand badge
    const badgeGeometry = new RingGeometry(0.015, 0.02, 32)
    const badgeMaterial = new MeshStandardMaterial({
      color: String(scheme.accent),
      emissive: String(scheme.accent),
      emissiveIntensity: 0.5,
      metalness: 1,
      roughness: 0.1,
      side: 2,
    })
    const badge = new Mesh(badgeGeometry, badgeMaterial)
    badge.position.set(dims.width * 0.35, dims.height * 0.3, panelZ + 0.001)
    badge.rotation.x = -Math.PI / 2
    badge.name = "brand-badge"
    g.add(badge)

    return g
  }, [variant, colorScheme])

  const knobHandlers = useKnobDrag({ onTurn: onKnobTurn })
  const faderHandlers = useFaderDrag({ onMove: onFaderMove })
  const keyHandlers = useKeyPress({ onPress: onKeyPress })

  useFrame((state) => {
    if (!animated || !group) return
    const t = state.clock.elapsedTime
    // Gentle idle life: drift the brand-badge ring + pulse the display glow.
    const badge = group.getObjectByName("brand-badge")
    if (badge) {
      const mat = (badge as Mesh).material as MeshStandardMaterial
      if (mat && "emissive" in mat) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5)
        ;(mat as any).emissiveIntensity = 0.3 + pulse * 0.4
      }
    }
    const glow = group.getObjectByName("display-glow")
    if (glow) {
      const mat = (glow as Mesh).material as any
      if (mat && "emissiveIntensity" in mat) {
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.8)
        mat.emissiveIntensity = 0.5 + pulse * 0.4
      }
    }
  })

  return (
    <primitive
      object={group}
      onPointerDown={(e: any) => {
        knobHandlers.onPointerDown(e)
        faderHandlers.onPointerDown(e)
        keyHandlers.onPointerDown(e)
      }}
    />
  )
}

// Position generators
function generateKnobPositions(variant: string, width: number, height: number) {
  const positions: Array<{ x: number; y: number; id: string }> = []

  const rows = variant === "poly" ? 3 : 2
  const cols = variant === "poly" ? 6 : 4
  const spacingX = width * 0.7 / (cols - 1)
  const spacingY = height * 0.6 / (rows - 1)
  const startX = -width * 0.35
  const startY = height * 0.25

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: startX + col * spacingX,
        y: startY - row * spacingY,
        id: `r${row}c${col}`,
      })
    }
  }

  return positions
}

function generateFaderPositions(variant: string, width: number, height: number) {
  const positions: Array<{ x: number; y: number; id: string }> = []

  const count = variant === "poly" ? 8 : 4
  const spacing = width * 0.6 / (count - 1)
  const startX = -width * 0.3

  for (let i = 0; i < count; i++) {
    positions.push({
      x: startX + i * spacing,
      y: -height * 0.15,
      id: String(i),
    })
  }

  return positions
}

function generateJackPositions(variant: string, width: number, height: number) {
  const positions: Array<{ x: number; y: number; type: "ts" | "trs" | "xlr" | "midi" | "usb" | "power"; id: string }> = []

  // Audio outputs
  positions.push({ x: width * 0.35, y: -height * 0.3, type: "trs", id: "out-l" })
  positions.push({ x: width * 0.42, y: -height * 0.3, type: "trs", id: "out-r" })

  // Headphones
  positions.push({ x: -width * 0.35, y: -height * 0.3, type: "trs", id: "phones" })

  // MIDI
  positions.push({ x: -width * 0.42, y: -height * 0.3, type: "midi", id: "midi-in" })
  positions.push({ x: -width * 0.35, y: -height * 0.3, type: "midi", id: "midi-out" })

  // USB
  positions.push({ x: width * 0.35, y: -height * 0.4, type: "usb", id: "usb" })

  // Power
  positions.push({ x: width * 0.42, y: -height * 0.4, type: "power", id: "power" })

  return positions
}