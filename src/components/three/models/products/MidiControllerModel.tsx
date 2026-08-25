"use client"

import { Group, Mesh, CylinderGeometry, BoxGeometry, PlaneGeometry } from "three"
import { MeshStandardMaterial, MeshPhysicalMaterial, Color } from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { colorSchemes } from "../geometry"
import { useKnobDrag, useFaderDrag, useKeyPress, usePadHover } from "../../hooks/usePointerControls"

interface MidiControllerModelProps {
  variant?: "compact" | "full" | "pad"
  colorScheme?: keyof typeof colorSchemes
  keys?: 25 | 49 | 61 | 88
  pads?: number
  faders?: number
  knobs?: number
  animated?: boolean
  onKnobTurn?: (knobId: string, value: number) => void
  onKeyPress?: (note: number, velocity: number) => void
  onFaderMove?: (faderId: string, value: number) => void
  onPadHit?: (padId: number, velocity: number) => void
}

export function MidiControllerModel({
  variant = "full",
  colorScheme = "dark",
  keys = 61,
  pads = 16,
  faders = 9,
  knobs = 8,
  animated = true,
  onKnobTurn,
  onKeyPress,
  onFaderMove,
  onPadHit,
}: MidiControllerModelProps) {
  const group = useMemo(() => {
    const g = new Group()

    const scheme = colorSchemes[colorScheme]

    // Dimensions
    const dims = {
      compact: { width: 0.45, height: 0.12, depth: 0.25, hasKeyboard: true },
      full: { width: 0.95, height: 0.15, depth: 0.35, hasKeyboard: true },
      pad: { width: 0.35, height: 0.1, depth: 0.25, hasKeyboard: false },
    }[variant]

    const panelDepth = 0.008
    const bezelWidth = 0.008
    const cornerRadius = 0.012

    // ===== MAIN CHASSIS =====
    const chassisGeo = new RoundedBoxGeometry(
      dims.width,
      dims.height,
      dims.depth,
      cornerRadius,
      8
    )
    const chassisMat = new MeshStandardMaterial({
      color: scheme.chassis,
      metalness: 0.7,
      roughness: 0.3,
    })
    const chassis = new Mesh(chassisGeo, chassisMat)
    chassis.castShadow = true
    chassis.receiveShadow = true
    chassis.name = "chassis"
    g.add(chassis)

    // ===== FRONT PANEL =====
    const panelGeo = new RoundedBoxGeometry(
      dims.width - bezelWidth * 2,
      dims.height - bezelWidth * 2,
      panelDepth,
      cornerRadius - bezelWidth,
      4
    )
    const panelMat = new MeshStandardMaterial({
      color: scheme.panel,
      metalness: 0.8,
      roughness: 0.2,
    })
    const panel = new Mesh(panelGeo, panelMat)
    panel.position.z = dims.depth / 2 - panelDepth / 2 + 0.001
    panel.castShadow = true
    panel.receiveShadow = true
    panel.name = "panel"
    g.add(panel)

    if (dims.hasKeyboard) {
      // ===== KEYBOARD =====
      const octaves = Math.floor(keys / 12)
      const extraKeys = keys % 12
      const totalWhiteKeys = octaves * 7 + Math.min(extraKeys, 7)
      const keyWidth = dims.width / (totalWhiteKeys + 1)
      const keyDepth = 0.08
      const keyHeight = 0.01

      const keyboardGroup = new Group()

      // White keys
      const whiteKeyGeo = new RoundedBoxGeometry(keyWidth, keyHeight, keyDepth, 0.002, 2)
      const whiteKeyMat = new MeshStandardMaterial({
        color: scheme.keys.white,
        metalness: 0.05,
        roughness: 0.85,
      })

      let whiteKeyIndex = 0
      for (let oct = 0; oct < octaves; oct++) {
        for (let w = 0; w < 7; w++) {
          const x = (whiteKeyIndex * (keyWidth + 0.001)) - (totalWhiteKeys * keyWidth) / 2
          const key = new Mesh(whiteKeyGeo, whiteKeyMat)
          key.position.set(x, -dims.height / 2 + keyHeight / 2, dims.depth / 2 - keyDepth / 2 + 0.002)
          key.castShadow = true
          key.receiveShadow = true
          key.name = `white-key-${whiteKeyIndex}`
          keyboardGroup.add(key)
          whiteKeyIndex++
        }
      }
      // Extra white keys
      for (let w = 0; w < Math.min(extraKeys, 7); w++) {
        const x = (whiteKeyIndex * (keyWidth + 0.001)) - (totalWhiteKeys * keyWidth) / 2
        const key = new Mesh(whiteKeyGeo, whiteKeyMat)
        key.position.set(x, -dims.height / 2 + keyHeight / 2, dims.depth / 2 - keyDepth / 2 + 0.002)
        key.castShadow = true
        key.receiveShadow = true
        key.name = `white-key-${whiteKeyIndex}`
        keyboardGroup.add(key)
        whiteKeyIndex++
      }

      // Black keys
      const blackKeyGeo = new RoundedBoxGeometry(
        keyWidth * 0.6,
        keyHeight * 0.6,
        keyDepth * 0.6,
        0.002,
        2
      )
      const blackKeyMat = new MeshStandardMaterial({
        color: scheme.keys.black,
        metalness: 0.05,
        roughness: 0.8,
      })

      const blackKeyPositions = [1, 3, 6, 8, 10]
      let blackKeyIndex = 0
      for (let oct = 0; oct < octaves; oct++) {
        for (const pos of blackKeyPositions) {
          const whiteKeyOffset = Math.floor(pos * 7 / 12) + oct * 7
          const x = (whiteKeyOffset * (keyWidth + 0.001)) - (totalWhiteKeys * keyWidth) / 2
          const key = new Mesh(blackKeyGeo, blackKeyMat)
          key.position.set(
            x,
            -dims.height / 2 + keyHeight / 2 + keyHeight * 0.2,
            dims.depth / 2 - keyDepth * 0.3 + 0.003
          )
          key.castShadow = true
          key.receiveShadow = true
          key.name = `black-key-${blackKeyIndex}`
          keyboardGroup.add(key)
          blackKeyIndex++
        }
      }
      // Extra black keys
      if (extraKeys > 7) {
        const extraBlackPositions = blackKeyPositions.slice(0, extraKeys - 7)
        for (const pos of extraBlackPositions) {
          const whiteKeyOffset = Math.floor(pos * 7 / 12) + octaves * 7
          const x = (whiteKeyOffset * (keyWidth + 0.001)) - (totalWhiteKeys * keyWidth) / 2
          const key = new Mesh(blackKeyGeo, blackKeyMat)
          key.position.set(
            x,
            -dims.height / 2 + keyHeight / 2 + keyHeight * 0.2,
            dims.depth / 2 - keyDepth * 0.3 + 0.003
          )
          key.castShadow = true
          key.receiveShadow = true
          key.name = `black-key-${blackKeyIndex}`
          keyboardGroup.add(key)
          blackKeyIndex++
        }
      }

      g.add(keyboardGroup)

      // ===== CONTROL AREA (above keyboard) =====
      const controlY = -dims.height / 2 + 0.03
      const controlHeight = dims.height - 0.04 - keyHeight * 2
      const controlWidth = dims.width - 0.04

      // Transport buttons
      const transportButtons = ["rewind", "forward", "stop", "play", "record"]
      const buttonSize = 0.025
      const buttonSpacing = 0.03
      const transportX = -controlWidth / 2 + 0.05
      const transportY = controlY + controlHeight * 0.8

      transportButtons.forEach((btn, i) => {
        const btnGroup = new Group()

        const btnGeo = new RoundedBoxGeometry(buttonSize, buttonSize, 0.008, 0.005, 2)
        const btnMat = new MeshStandardMaterial({
          color: i === 4 ? scheme.buttonActive : scheme.buttonColor,
          metalness: 0.5,
          roughness: 0.4,
          emissive: i === 4 ? new Color(scheme.buttonActive) : new Color(0),
          emissiveIntensity: i === 4 ? 0.5 : 0,
        })
        const btnMesh = new Mesh(btnGeo, btnMat)
        btnMesh.castShadow = true
        btnMesh.name = `transport-${btn}`
        btnGroup.add(btnMesh)

        btnGroup.position.set(transportX + i * buttonSpacing, transportY, dims.depth / 2 - panelDepth / 2 + 0.008)
        g.add(btnGroup)
      })

      // Pads grid
      const padRows = 4
      const padCols = pads / padRows
      const padSize = 0.028
      const padGap = 0.004
      const padsStartX = -controlWidth / 2 + 0.05 + 5 * buttonSpacing
      const padsStartY = controlY + controlHeight * 0.5

      for (let row = 0; row < padRows; row++) {
        for (let col = 0; col < padCols; col++) {
          const padIndex = row * padCols + col
          const x = padsStartX + col * (padSize + padGap)
          const y = padsStartY - row * (padSize + padGap)

          const padGeo = new RoundedBoxGeometry(padSize, padSize, 0.006, 0.004, 2)
          const isActive = padIndex % 4 === 0 // Some pads lit
          const padMat = new MeshStandardMaterial({
            color: isActive ? scheme.padOn : scheme.padOff,
            metalness: 0.2,
            roughness: 0.7,
            emissive: isActive ? new Color(scheme.padOn) : new Color(0),
            emissiveIntensity: isActive ? 1 : 0,
          })
          const pad = new Mesh(padGeo, padMat)
          pad.position.set(x, y, dims.depth / 2 - panelDepth / 2 + 0.005)
          pad.castShadow = true
          pad.name = `pad-${padIndex}`
          g.add(pad)
        }
      }

      // Knobs
      const knobCount = knobs
      const knobRadius = 0.01
      const knobHeight = 0.014
      const knobsStartX = padsStartX + padCols * (padSize + padGap) + 0.03
      const knobsY = controlY + controlHeight * 0.3
      const knobSpacing = (controlWidth - (knobsStartX + controlWidth / 2)) / (knobCount + 1)

      for (let i = 0; i < knobCount; i++) {
        const x = knobsStartX + i * knobSpacing
        const y = knobsY

        const knobGroup = new Group()

        // Base
        const baseGeo = new CylinderGeometry(knobRadius, knobRadius * 1.1, knobHeight, 24)
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

        // Grip
        const gripGeo = new CylinderGeometry(knobRadius * 1.1, knobRadius * 1.1, knobHeight * 0.8, 32)
        const gripPos = gripGeo.attributes.position
        for (let v = 0; v < gripPos.count; v++) {
          const angle = Math.atan2(gripPos.getX(v), gripPos.getZ(v))
          const ridges = 16
          const displacement = Math.sin(angle * ridges) * 0.0015
          const x = gripPos.getX(v)
          const z = gripPos.getZ(v)
          const len = Math.sqrt(x * x + z * z)
          if (len > 0) {
            gripPos.setXYZ(v, x + (x / len) * displacement, gripPos.getY(v), z + (z / len) * displacement)
          }
        }
        gripGeo.computeVertexNormals()

        const gripMat = new MeshStandardMaterial({
          color: new Color(scheme.knobBase).multiplyScalar(0.7),
          metalness: 0.2,
          roughness: 0.9,
        })
        const grip = new Mesh(gripGeo, gripMat)
        grip.position.y = knobHeight / 2
        grip.name = `knob-grip-${i}`
        knobGroup.add(grip)

        // Indicator
        const indicatorGeo = new BoxGeometry(0.002, 0.005, knobRadius + 0.002)
        const indicatorMat = new MeshStandardMaterial({
          color: scheme.knobIndicator,
          emissive: scheme.knobIndicator,
          emissiveIntensity: 0.3,
        })
        const indicator = new Mesh(indicatorGeo, indicatorMat)
        indicator.position.set(0, knobHeight + 0.0025, knobRadius + 0.001)
        indicator.name = `knob-indicator-${i}`
        knobGroup.add(indicator)

        knobGroup.position.set(x, y, dims.depth / 2 - panelDepth / 2 + 0.01)
        g.add(knobGroup)
      }

      // Faders
      const faderCount = faders
      const faderHeight = 0.05
      const faderTrackWidth = 0.005
      const faderKnobWidth = 0.016
      const fadersStartX = knobsStartX + knobCount * knobSpacing + 0.03
      const fadersY = controlY + controlHeight * 0.15
      const faderSpacing = (controlWidth / 2 - fadersStartX) / (faderCount + 1)

      for (let i = 0; i < faderCount; i++) {
        const x = fadersStartX + i * faderSpacing
        const y = fadersY

        const faderGroup = new Group()

        // Track
        const trackGeo = new RoundedBoxGeometry(faderTrackWidth, faderHeight, 0.006, 0.0025, 2)
        const trackMat = new MeshStandardMaterial({
          color: scheme.faderTrack,
          metalness: 0.8,
          roughness: 0.2,
        })
        const track = new Mesh(trackGeo, trackMat)
        track.position.y = faderHeight / 2
        track.castShadow = true
        track.name = `fader-track-${i}`
        faderGroup.add(track)

        // Knob
        const knobGeo = new RoundedBoxGeometry(faderKnobWidth, 0.01, 0.016, 0.003, 2)
        const knobMat = new MeshStandardMaterial({
          color: scheme.faderKnob,
          metalness: 0.3,
          roughness: 0.6,
          emissive: scheme.faderKnob,
          emissiveIntensity: 0.2,
        })
        const knob = new Mesh(knobGeo, knobMat)
        knob.position.y = faderHeight * 0.7
        knob.castShadow = true
        knob.name = `fader-knob-${i}`
        faderGroup.add(knob)

        faderGroup.position.set(x, y, dims.depth / 2 - panelDepth / 2 + 0.012)
        g.add(faderGroup)
      }

      // Display (top right)
      const displayWidth = 0.14
      const displayHeight = 0.045
      const displayDepth = 0.006

      const displayGroup = new Group()

      const bezelGeo = new RoundedBoxGeometry(displayWidth, displayHeight, displayDepth, 0.004, 2)
      const bezelMat = new MeshStandardMaterial({
        color: scheme.displayBezel,
        metalness: 0.5,
        roughness: 0.3,
      })
      const bezel = new Mesh(bezelGeo, bezelMat)
      bezel.castShadow = true
      bezel.name = "display-bezel"
      displayGroup.add(bezel)

      const screenGeo = new RoundedBoxGeometry(displayWidth - 0.008, displayHeight - 0.008, displayDepth * 0.1, 0.002, 1)
      const screenMat = new MeshPhysicalMaterial({
        color: scheme.displayScreen,
        metalness: 0,
        roughness: 0,
        transmission: 0.95,
        thickness: 0.005,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      })
      const screen = new Mesh(screenGeo, screenMat)
      screen.position.z = displayDepth / 2 * 0.9
      screen.name = "display-screen"
      displayGroup.add(screen)

      const glowGeo = new PlaneGeometry(displayWidth - 0.015, displayHeight - 0.015)
      const glowMat = new MeshStandardMaterial({
        color: scheme.displayGlow,
        emissive: scheme.displayGlow,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7,
        side: 2,
        depthWrite: false,
      })
      const glow = new Mesh(glowGeo, glowMat)
      glow.position.z = displayDepth / 2 + 0.001
      glow.name = "display-glow"
      displayGroup.add(glow)

      displayGroup.position.set(
        dims.width / 2 - displayWidth / 2 - 0.015,
        dims.height / 2 - displayHeight / 2 - 0.01,
        dims.depth / 2 - panelDepth / 2 + 0.005
      )
      g.add(displayGroup)
    } else {
      // Pad-only controller
      const padRows = 4
      const padCols = 4
      const padSize = 0.035
      const padGap = 0.006

      for (let row = 0; row < padRows; row++) {
        for (let col = 0; col < padCols; col++) {
          const x = -dims.width / 2 + 0.04 + col * (padSize + padGap)
          const y = dims.height / 2 - 0.04 - row * (padSize + padGap)

          const padGeo = new RoundedBoxGeometry(padSize, padSize, 0.008, 0.006, 2)
          const isActive = (row + col) % 3 === 0
          const padMat = new MeshStandardMaterial({
            color: isActive ? scheme.padOn : scheme.padOff,
            metalness: 0.2,
            roughness: 0.7,
            emissive: isActive ? new Color(scheme.padOn) : new Color(0),
            emissiveIntensity: isActive ? 1.5 : 0,
          })
          const pad = new Mesh(padGeo, padMat)
          pad.position.set(x, y, dims.depth / 2 - panelDepth / 2 + 0.006)
          pad.castShadow = true
          pad.name = `pad-${row}-${col}`
          g.add(pad)
        }
      }

      // Knobs at top
      for (let i = 0; i < 8; i++) {
        const x = -dims.width / 2 + 0.04 + i * (dims.width - 0.08) / 7
        const y = -dims.height / 2 + 0.03

        const knobGroup = new Group()

        const baseGeo = new CylinderGeometry(0.01, 0.011, 0.014, 24)
        const baseMat = new MeshStandardMaterial({
          color: scheme.knobBase,
          metalness: 0.3,
          roughness: 0.7,
        })
        const base = new Mesh(baseGeo, baseMat)
        base.position.y = 0.007
        base.castShadow = true
        knobGroup.add(base)

        const indicatorGeo = new BoxGeometry(0.002, 0.005, 0.012)
        const indicatorMat = new MeshStandardMaterial({
          color: scheme.knobIndicator,
          emissive: scheme.knobIndicator,
          emissiveIntensity: 0.3,
        })
        const indicator = new Mesh(indicatorGeo, indicatorMat)
        indicator.position.set(0, 0.0165, 0.011)
        knobGroup.add(indicator)

        knobGroup.position.set(x, y, dims.depth / 2 - panelDepth / 2 + 0.01)
        g.add(knobGroup)
      }
    }

    // ===== REAR JACKS =====
    const rearJacks = ["ts", "ts", "midi", "midi", "usb", "power"]
    const jackSpacing = dims.width / (rearJacks.length + 1)

    rearJacks.forEach((type, i) => {
      const x = -dims.width / 2 + jackSpacing * (i + 1)
      const y = -dims.height / 2 + 0.03

      const jackGroup = new Group()

      if (type === "ts") {
        const jackGeo = new CylinderGeometry(0.0035, 0.0035, 0.018, 16)
        const jackMat = new MeshStandardMaterial({
          color: scheme.jackColor,
          metalness: 0.9,
          roughness: 0.1,
        })
        const jack = new Mesh(jackGeo, jackMat)
        jack.rotation.x = Math.PI / 2
        jack.castShadow = true
        jack.name = `rear-jack-${type}-${i}`
        jackGroup.add(jack)
      } else if (type === "midi") {
        const bodyGeo = new CylinderGeometry(0.0065, 0.0065, 0.012, 16)
        const bodyMat = new MeshStandardMaterial({
          color: scheme.jackColor,
          metalness: 0.9,
          roughness: 0.1,
        })
        const body = new Mesh(bodyGeo, bodyMat)
        body.rotation.x = Math.PI / 2
        body.castShadow = true
        body.name = `rear-midi-body-${i}`
        jackGroup.add(body)
      } else if (type === "usb") {
        const bodyGeo = new BoxGeometry(0.012, 0.007, 0.01)
        const bodyMat = new MeshStandardMaterial({
          color: scheme.jackColor,
          metalness: 0.3,
          roughness: 0.7,
        })
        const body = new Mesh(bodyGeo, bodyMat)
        body.castShadow = true
        body.name = `rear-usb-body-${i}`
        jackGroup.add(body)
      } else if (type === "power") {
        const outerGeo = new CylinderGeometry(0.005, 0.005, 0.015, 16)
        const outerMat = new MeshStandardMaterial({
          color: scheme.jackColor,
          metalness: 0.9,
          roughness: 0.1,
        })
        const outer = new Mesh(outerGeo, outerMat)
        outer.rotation.x = Math.PI / 2
        outer.castShadow = true
        outer.name = `rear-power-outer-${i}`
        jackGroup.add(outer)

        const innerGeo = new CylinderGeometry(0.0012, 0.0012, 0.01, 8)
        const innerMat = new MeshStandardMaterial({
          color: 0xffd700,
          metalness: 1,
          roughness: 0.1,
        })
        const inner = new Mesh(innerGeo, innerMat)
        inner.rotation.x = Math.PI / 2
        inner.position.z = -0.004
        inner.name = `rear-power-inner-${i}`
        jackGroup.add(inner)
      }

      jackGroup.position.set(x, y, -dims.depth / 2 + 0.01)
      g.add(jackGroup)
    })

    return g
  }, [variant, colorScheme, keys, pads, faders, knobs])

  const knobId = (name: string) => {
    const m = name.match(/^knob-base-(\d+)$/)
    return m ? `knob-${m[1]}` : null
  }
  const faderId = (name: string) => {
    const m = name.match(/^fader-knob-(\d+)$/)
    return m ? `fader-${m[1]}` : null
  }
  const padIndex = (name: string): number | null => {
    const m = name.match(/^pad-(\d+)$/)
    if (m) return Number(m[1])
    const g = name.match(/^pad-(\d+)-(\d+)$/)
    if (g) return Number(g[1]) * 4 + Number(g[2])
    return null
  }

  const knobHandlers = useKnobDrag({ idFromName: knobId, onTurn: onKnobTurn })
  const faderHandlers = useFaderDrag({
    idFromName: faderId,
    trackLength: 0.05,
    pixelsPerSweep: 140,
    onMove: onFaderMove,
  })
  const keyHandlers = useKeyPress({ onPress: onKeyPress })
  const padHandlers = usePadHover({ indexFromName: padIndex, onHit: onPadHit })

  useFrame((state) => {
    if (!animated || !group) return
    const t = state.clock.elapsedTime
    const glow = group.getObjectByName("display-glow")
    if (glow) {
      const mat = (glow as Mesh).material as any
      if (mat && "emissiveIntensity" in mat) {
        mat.emissiveIntensity = 0.5 + (0.6 + 0.4 * Math.sin(t * 0.7)) * 0.3
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
        padHandlers.onPointerDown(e)
      }}
      onPointerOver={(e: any) => padHandlers.onPointerOver(e)}
      onPointerOut={(e: any) => padHandlers.onPointerOut(e)}
    />
  )
}