"use client"

import { Group, Mesh, CylinderGeometry, BoxGeometry, RingGeometry, PlaneGeometry } from "three"
import { MeshStandardMaterial, MeshPhysicalMaterial, Color } from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { colorSchemes } from "../geometry"
import { useKnobDrag } from "../../hooks/usePointerControls"

interface AudioInterfaceModelProps {
  variant?: "desktop" | "rack" | "portable"
  colorScheme?: keyof typeof colorSchemes
  inputs?: number
  outputs?: number
  animated?: boolean
  onKnobTurn?: (knobId: string, value: number) => void
  onToggle?: (id: string, on: boolean) => void
  onMonitor?: (value: number) => void
}

export function AudioInterfaceModel({
  variant = "desktop",
  colorScheme = "dark",
  inputs = 4,
  outputs = 4,
  animated = true,
  onKnobTurn,
  onToggle,
  onMonitor,
}: AudioInterfaceModelProps) {
  const group = useMemo(() => {
    const g = new Group()

    const scheme = colorSchemes[colorScheme]

    // Dimensions by variant
    const dims = {
      desktop: { width: 0.35, height: 0.12, depth: 0.22 },
      rack: { width: 0.482, height: 0.132, depth: 0.25 }, // 19" rack, 1U
      portable: { width: 0.25, height: 0.08, depth: 0.15 },
    }[variant]

    const panelDepth = 0.006
    const bezelWidth = 0.006
    const cornerRadius = variant === "rack" ? 0 : 0.01

    // ===== CHASSIS =====
    const chassisGeo = new RoundedBoxGeometry(
      dims.width,
      dims.height,
      dims.depth,
      cornerRadius,
      8
    )
    const chassisMat = new MeshStandardMaterial({
      color: scheme.chassis,
      metalness: 0.8,
      roughness: 0.25,
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
      Math.max(0, cornerRadius - bezelWidth),
      4
    )
    const panelMat = new MeshStandardMaterial({
      color: scheme.panel,
      metalness: 0.85,
      roughness: 0.15,
    })
    const panel = new Mesh(panelGeo, panelMat)
    panel.position.z = dims.depth / 2 - panelDepth / 2 + 0.001
    panel.castShadow = true
    panel.receiveShadow = true
    panel.name = "panel"
    g.add(panel)

    // ===== FRONT PANEL CONTROLS =====
    const panelZ = dims.depth / 2 - panelDepth / 2

    // Input gain knobs
    const knobCount = inputs
    const knobRadius = 0.008
    const knobHeight = 0.012
    const knobSpacing = (dims.width * 0.7) / Math.max(1, knobCount - 1)
    const knobStartX = -dims.width * 0.35
    const knobY = dims.height * 0.15

    for (let i = 0; i < knobCount; i++) {
      const x = knobStartX + i * knobSpacing

      const knobGroup = new Group()

      // Base
      const baseGeo = new CylinderGeometry(knobRadius, knobRadius * 1.05, knobHeight, 20)
      const baseMat = new MeshStandardMaterial({
        color: scheme.knobBase,
        metalness: 0.3,
        roughness: 0.7,
      })
      const base = new Mesh(baseGeo, baseMat)
      base.position.y = knobHeight / 2
      base.castShadow = true
      base.name = `gain-knob-base-${i}`
      knobGroup.add(base)

      // Grip
      const gripGeo = new CylinderGeometry(knobRadius * 1.05, knobRadius * 1.05, knobHeight * 0.7, 24)
      const gripPos = gripGeo.attributes.position
      for (let v = 0; v < gripPos.count; v++) {
        const angle = Math.atan2(gripPos.getX(v), gripPos.getZ(v))
        const ridges = 12
        const displacement = Math.sin(angle * ridges) * 0.001
        const xPos = gripPos.getX(v)
        const zPos = gripPos.getZ(v)
        const len = Math.sqrt(xPos * xPos + zPos * zPos)
        if (len > 0) {
          gripPos.setXYZ(v, xPos + (xPos / len) * displacement, gripPos.getY(v), zPos + (zPos / len) * displacement)
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
      grip.name = `gain-knob-grip-${i}`
      knobGroup.add(grip)

      // Indicator
      const indicatorGeo = new BoxGeometry(0.0015, 0.004, knobRadius + 0.0015)
      const indicatorMat = new MeshStandardMaterial({
        color: scheme.knobIndicator,
        emissive: scheme.knobIndicator,
        emissiveIntensity: 0.3,
      })
      const indicator = new Mesh(indicatorGeo, indicatorMat)
      indicator.position.set(0, knobHeight + 0.002, knobRadius + 0.00075)
      indicator.name = `gain-knob-indicator-${i}`
      knobGroup.add(indicator)

      knobGroup.position.set(x, knobY, panelZ + 0.008)
      g.add(knobGroup)
    }

    // 48V Phantom power button
    const buttonSize = 0.018
    const buttonGroup = new Group()

    const btnGeo = new RoundedBoxGeometry(buttonSize, buttonSize, 0.006, 0.003, 2)
    const btnMat = new MeshStandardMaterial({
      color: scheme.buttonColor,
      metalness: 0.5,
      roughness: 0.4,
    })
    const btn = new Mesh(btnGeo, btnMat)
    btn.castShadow = true
    btn.name = "phantom-btn"
    buttonGroup.add(btn)

    // LED ring
    const ledGeo = new RingGeometry(0.004, 0.007, 24)
    const ledMat = new MeshStandardMaterial({
      color: scheme.ledOn,
      emissive: scheme.ledOn,
      emissiveIntensity: 1.5,
      side: 2,
    })
    const led = new Mesh(ledGeo, ledMat)
    led.rotation.x = -Math.PI / 2
    led.position.z = 0.004
    led.name = "phantom-led"
    buttonGroup.add(led)

    // 48V label
    const labelGeo = new PlaneGeometry(0.025, 0.008)
    const labelMat = new MeshStandardMaterial({
      color: scheme.knobIndicator,
      transparent: true,
      opacity: 0.9,
      side: 2,
    })
    const label = new Mesh(labelGeo, labelMat)
    label.rotation.x = -Math.PI / 2
    label.position.set(0, -0.018, 0.004)
    label.name = "phantom-label"
    buttonGroup.add(label)

    buttonGroup.position.set(
      dims.width / 2 - 0.03,
      dims.height / 2 - 0.03,
      panelZ + 0.01
    )
    g.add(buttonGroup)

    // Monitor/Headphone knob
    const monitorKnobGroup = new Group()
    const monitorBaseGeo = new CylinderGeometry(0.012, 0.013, 0.016, 24)
    const monitorBaseMat = new MeshStandardMaterial({
      color: scheme.knobBase,
      metalness: 0.3,
      roughness: 0.7,
    })
    const monitorBase = new Mesh(monitorBaseGeo, monitorBaseMat)
    monitorBase.position.y = 0.008
    monitorBase.castShadow = true
    monitorBase.name = "monitor-knob-base"
    monitorKnobGroup.add(monitorBase)

    // Indicator line
    const monitorIndicatorGeo = new BoxGeometry(0.002, 0.006, 0.014)
    const monitorIndicatorMat = new MeshStandardMaterial({
      color: scheme.knobIndicator,
      emissive: scheme.knobIndicator,
      emissiveIntensity: 0.5,
    })
    const monitorIndicator = new Mesh(monitorIndicatorGeo, monitorIndicatorMat)
    monitorIndicator.position.set(0, 0.019, 0.014)
    monitorIndicator.name = "monitor-knob-indicator"
    monitorKnobGroup.add(monitorIndicator)

    monitorKnobGroup.position.set(
      dims.width / 2 - 0.03,
      -dims.height / 2 + 0.03,
      panelZ + 0.01
    )
    g.add(monitorKnobGroup)

    // Headphone jack
    const hpJackGroup = new Group()
    const hpJackGeo = new CylinderGeometry(0.0045, 0.0045, 0.016, 16)
    const hpJackMat = new MeshStandardMaterial({
      color: scheme.jackColor,
      metalness: 0.9,
      roughness: 0.1,
    })
    const hpJack = new Mesh(hpJackGeo, hpJackMat)
    hpJack.rotation.x = -Math.PI / 2
    hpJack.castShadow = true
    hpJack.name = "headphone-jack"
    hpJackGroup.add(hpJack)

    hpJackGroup.position.set(
      dims.width / 2 - 0.03,
      -dims.height / 2 + 0.07,
      panelZ + 0.01
    )
    g.add(hpJackGroup)

    // Input/Output meters (LED strips)
    const meterWidth = 0.004
    const meterHeight = 0.06
    const meterDepth = 0.004
    const meterSpacing = 0.01
    const metersStartX = -dims.width * 0.35
    const metersY = -dims.height * 0.1

    for (let i = 0; i < inputs; i++) {
      const x = metersStartX + i * (meterWidth + meterSpacing)

      // Meter background
      const meterBgGeo = new RoundedBoxGeometry(meterWidth, meterHeight, meterDepth, 0.002, 1)
      const meterBgMat = new MeshStandardMaterial({
        color: scheme.ledOff,
        metalness: 0.1,
        roughness: 0.9,
      })
      const meterBg = new Mesh(meterBgGeo, meterBgMat)
      meterBg.position.set(x, metersY, panelZ + 0.005)
      meterBg.castShadow = true
      meterBg.name = `meter-bg-${i}`
      g.add(meterBg)

      // Active segments (simulated)
      const segments = 12
      for (let s = 0; s < segments; s++) {
        const segmentHeight = meterHeight / segments
        const isActive = s < 6 // Simulate -12dB level
        const segColor = isActive ? (s > 9 ? scheme.ledClip : scheme.ledOn) : scheme.ledOff
        const segIntensity = isActive ? 1 : 0

        const segGeo = new RoundedBoxGeometry(meterWidth * 0.8, segmentHeight * 0.7, meterDepth * 0.5, 0.001, 1)
        const segMat = new MeshStandardMaterial({
          color: segColor,
          emissive: isActive ? segColor : new Color(0),
          emissiveIntensity: segIntensity * 2,
          transparent: true,
          opacity: isActive ? 1 : 0.3,
        })
        const seg = new Mesh(segGeo, segMat)
        seg.position.set(
          x,
          metersY - meterHeight / 2 + segmentHeight / 2 + s * segmentHeight,
          panelZ + 0.007
        )
        seg.name = `meter-seg-${i}-${s}`
        g.add(seg)
      }
    }

    // ===== DISPLAY (for rack/desktop) =====
    if (variant !== "portable") {
      const displayWidth = Math.min(0.12, dims.width * 0.3)
      const displayHeight = 0.035
      const displayDepth = 0.005

      const displayGroup = new Group()

      const bezelGeo = new RoundedBoxGeometry(displayWidth, displayHeight, displayDepth, 0.003, 2)
      const bezelMat = new MeshStandardMaterial({
        color: scheme.displayBezel,
        metalness: 0.5,
        roughness: 0.3,
      })
      const bezel = new Mesh(bezelGeo, bezelMat)
      bezel.castShadow = true
      bezel.name = "display-bezel"
      displayGroup.add(bezel)

      const screenGeo = new RoundedBoxGeometry(displayWidth - 0.006, displayHeight - 0.006, displayDepth * 0.1, 0.0015, 1)
      const screenMat = new MeshPhysicalMaterial({
        color: scheme.displayScreen,
        metalness: 0,
        roughness: 0,
        transmission: 0.95,
        thickness: 0.003,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      })
      const screen = new Mesh(screenGeo, screenMat)
      screen.position.z = displayDepth / 2 * 0.9
      screen.name = "display-screen"
      displayGroup.add(screen)

      const glowGeo = new PlaneGeometry(displayWidth - 0.012, displayHeight - 0.012)
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

      displayGroup.position.set(
        0,
        dims.height / 2 - displayHeight / 2 - 0.008,
        panelZ + 0.004
      )
      g.add(displayGroup)
    }

    // ===== VENTILATION (rear/top) =====
    if (variant === "rack" || variant === "desktop") {
      const ventCount = Math.floor(dims.width / 0.02)
      const ventSpacing = dims.width / (ventCount + 1)

      for (let i = 0; i < ventCount; i++) {
        const x = -dims.width / 2 + ventSpacing * (i + 1)
        const ventGeo = new BoxGeometry(0.003, dims.height * 0.6, 0.002)
        const ventMat = new MeshStandardMaterial({
          color: scheme.ventColor,
          metalness: 0.3,
          roughness: 0.8,
        })
        const vent = new Mesh(ventGeo, ventMat)
        vent.position.set(x, 0, -dims.depth / 2 + 0.001)
        vent.name = `vent-${i}`
        g.add(vent)
      }
    }

    // ===== REAR PANEL =====
    const rearZ = -dims.depth / 2 + 0.01
    const rearPanelY = 0

    // Input jacks (combo XLR/TRS)
    const inputSpacing = (dims.width * 0.7) / Math.max(1, inputs - 1)
    const inputStartX = -dims.width * 0.35

    for (let i = 0; i < inputs; i++) {
      const x = inputStartX + i * inputSpacing
      const jackGroup = new Group()

      // XLR/Combo jack body
      const bodyGeo = new RoundedBoxGeometry(0.014, 0.022, 0.02, 0.002, 2)
      const bodyMat = new MeshStandardMaterial({
        color: scheme.jackColor,
        metalness: 0.9,
        roughness: 0.1,
      })
      const body = new Mesh(bodyGeo, bodyMat)
      body.castShadow = true
      body.name = `input-jack-body-${i}`
      jackGroup.add(body)

      // XLR pins
      const pinGeo = new CylinderGeometry(0.0015, 0.0015, 0.008, 8)
      const pinMat = new MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1,
      })
      for (let p = 0; p < 3; p++) {
        const angle = -Math.PI / 2 + p * Math.PI / 2
        const pin = new Mesh(pinGeo, pinMat)
        pin.rotation.x = Math.PI / 2
        pin.position.set(Math.cos(angle) * 0.0035, Math.sin(angle) * 0.0035, 0.014)
        pin.name = `input-jack-pin-${i}-${p}`
        jackGroup.add(pin)
      }

      // TRS hole (center)
      const trsGeo = new CylinderGeometry(0.003, 0.003, 0.02, 16)
      const trsMat = new MeshStandardMaterial({
        color: scheme.jackColor,
        metalness: 0.9,
        roughness: 0.1,
      })
      const trs = new Mesh(trsGeo, trsMat)
      trs.rotation.x = Math.PI / 2
      trs.castShadow = true
      trs.name = `input-jack-trs-${i}`
      jackGroup.add(trs)

      jackGroup.position.set(x, rearPanelY, rearZ)
      g.add(jackGroup)
    }

    // Output jacks (TRS)
    const outputSpacing = (dims.width * 0.7) / Math.max(1, outputs - 1)
    const outputStartX = -dims.width * 0.35

    for (let i = 0; i < outputs; i++) {
      const x = outputStartX + i * outputSpacing

      const jackGeo = new CylinderGeometry(0.0035, 0.0035, 0.016, 16)
      const jackMat = new MeshStandardMaterial({
        color: scheme.jackColor,
        metalness: 0.9,
        roughness: 0.1,
      })
      const jack = new Mesh(jackGeo, jackMat)
      jack.rotation.x = Math.PI / 2
      jack.castShadow = true
      jack.position.set(x, rearPanelY - 0.035, rearZ)
      jack.name = `output-jack-${i}`
      g.add(jack)
    }

    // MIDI I/O
    const midiTypes = ["midi-in", "midi-out", "midi-thru"]
    midiTypes.forEach((type, i) => {
      const x = dims.width / 2 - 0.03 + i * 0.02
      const jackGroup = new Group()

      const bodyGeo = new CylinderGeometry(0.0065, 0.0065, 0.01, 16)
      const bodyMat = new MeshStandardMaterial({
        color: scheme.jackColor,
        metalness: 0.9,
        roughness: 0.1,
      })
      const body = new Mesh(bodyGeo, bodyMat)
      body.rotation.x = Math.PI / 2
      body.castShadow = true
      body.name = `rear-${type}-body`
      jackGroup.add(body)

      // 5 pins
      const pinGeo = new CylinderGeometry(0.0012, 0.0012, 0.006, 8)
      const pinMat = new MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1,
      })
      for (let p = 0; p < 5; p++) {
        const angle = -Math.PI / 2 + p * Math.PI / 4
        const pin = new Mesh(pinGeo, pinMat)
        pin.rotation.x = Math.PI / 2
        pin.position.set(Math.cos(angle) * 0.003, Math.sin(angle) * 0.003, 0.008)
        pin.name = `rear-${type}-pin-${p}`
        jackGroup.add(pin)
      }

      jackGroup.position.set(x, rearPanelY, rearZ)
      g.add(jackGroup)
    })

    // USB
    const usbGeo = new BoxGeometry(0.012, 0.007, 0.01)
    const usbMat = new MeshStandardMaterial({
      color: scheme.jackColor,
      metalness: 0.3,
      roughness: 0.7,
    })
    const usb = new Mesh(usbGeo, usbMat)
    usb.castShadow = true
    usb.position.set(-dims.width / 2 + 0.025, rearPanelY + 0.035, rearZ)
    usb.name = "rear-usb"
    g.add(usb)

    // Power
    const powerGroup = new Group()
    const powerOuterGeo = new CylinderGeometry(0.005, 0.005, 0.012, 16)
    const powerOuterMat = new MeshStandardMaterial({
      color: scheme.jackColor,
      metalness: 0.9,
      roughness: 0.1,
    })
    const powerOuter = new Mesh(powerOuterGeo, powerOuterMat)
    powerOuter.rotation.x = Math.PI / 2
    powerOuter.castShadow = true
    powerOuter.name = "power-outer"
    powerGroup.add(powerOuter)

    const powerInnerGeo = new CylinderGeometry(0.0012, 0.0012, 0.008, 8)
    const powerInnerMat = new MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0.1,
    })
    const powerInner = new Mesh(powerInnerGeo, powerInnerMat)
    powerInner.rotation.x = Math.PI / 2
    powerInner.position.z = -0.004
    powerInner.name = "power-inner"
    powerGroup.add(powerInner)

    powerGroup.position.set(dims.width / 2 - 0.025, rearPanelY + 0.035, rearZ)
    g.add(powerGroup)

    // ===== RACK EARS (for rack variant) =====
    if (variant === "rack") {
      const earHeight = 0.132
      const earWidth = 0.02
      const earDepth = 0.01

      const earGeo = new BoxGeometry(earWidth, earHeight, earDepth)
      const earMat = new MeshStandardMaterial({
        color: scheme.chassis,
        metalness: 0.8,
        roughness: 0.2,
      })

      const leftEar = new Mesh(earGeo, earMat)
      leftEar.position.set(-dims.width / 2 - earWidth / 2, 0, -dims.depth / 2 + earDepth / 2 + 0.02)
      leftEar.castShadow = true
      leftEar.name = "rack-ear-left"
      g.add(leftEar)

      const rightEar = new Mesh(earGeo, earMat)
      rightEar.position.set(dims.width / 2 + earWidth / 2, 0, -dims.depth / 2 + earDepth / 2 + 0.02)
      rightEar.castShadow = true
      rightEar.name = "rack-ear-right"
      g.add(rightEar)

      // Screw holes in ears
      const screwGeo = new CylinderGeometry(0.0025, 0.0025, earDepth * 0.8, 8)
      const screwMat = new MeshStandardMaterial({
        color: scheme.screwColor,
        metalness: 0.9,
        roughness: 0.1,
      })

      const screwYPositions = [-earHeight / 2 + 0.02, earHeight / 2 - 0.02]
      screwYPositions.forEach((y, idx) => {
        const leftScrew = new Mesh(screwGeo, screwMat)
        leftScrew.position.set(-dims.width / 2 - earWidth / 2, y, -dims.depth / 2 + earDepth * 0.8)
        leftScrew.name = `rack-screw-left-${idx}`
        g.add(leftScrew)

        const rightScrew = new Mesh(screwGeo, screwMat)
        rightScrew.position.set(dims.width / 2 + earWidth / 2, y, -dims.depth / 2 + earDepth * 0.8)
        rightScrew.name = `rack-screw-right-${idx}`
        g.add(rightScrew)
      })
    }

    return g
  }, [variant, colorScheme, inputs, outputs])

  const knobId = (name: string) => {
    const g = name.match(/^gain-knob-base-(\d+)$/)
    if (g) return `gain-${g[1]}`
    if (name === "monitor-knob-base") return "monitor"
    return null
  }
  const knobHandlers = useKnobDrag({
    idFromName: knobId,
    onTurn: (id, value) => {
      if (id === "monitor") onMonitor?.(value)
      else onKnobTurn?.(id, value)
    },
  })

  const phantomState = useRef(false)
  // global pointerdown override is added via the primitive below for the phantom btn.

  useFrame((state) => {
    if (!animated || !group) return
    const t = state.clock.elapsedTime
    const led = group.getObjectByName("phantom-led")
    if (led) {
      const mat = (led as Mesh).material as MeshStandardMaterial
      if (mat && "emissiveIntensity" in mat) {
        // slow breathing when off; bright steady when on
        const target = phantomState.current ? 2.2 : 0.25 + 0.15 * Math.sin(t * 1.2)
        mat.emissiveIntensity = target
      }
    }
  })

  return (
    <primitive
      object={group}
      onPointerDown={(e: any) => {
        if (e.object.name === "phantom-btn") {
          e.stopPropagation()
          phantomState.current = !phantomState.current
          onToggle?.("phantom", phantomState.current)
          return
        }
        knobHandlers.onPointerDown(e)
      }}
    />
  )
}