"use client"

/**
 * Pointer-interaction helpers for the procedural audio-hardware models.
 *
 * The models build an imperative THREE.Group inside useMemo and return
 * `<primitive object={group} />`. R3F raycasts the whole group and surfaces
 * `event.object.name` + `event.point`, so we dispatch on the semantic child
 * names assigned during construction (`knob-${id}`, `white-key-${i}`,
 * `fader-${id}`, `pad-${i}`, …).
 *
 * Design: drag state lives in refs (no React re-render during a drag); only
 * the mesh transform is mutated per frame. Callbacks fire on change so the
 * Phase-5 configurator can persist values. A single window-level
 * pointermove/up listener is attached on drag-start and removed on drag-end.
 *
 * Stability: every option (parsers + callbacks) is mirrored into a ref and
 * read inside stable (created-once) callbacks, so the hook returns handlers
 * that never need to be recreated — R3F attaches them once.
 */

import { useCallback, useEffect, useRef } from "react"
import type { ThreeEvent } from "@react-three/fiber"
import { Mesh, Object3D } from "three"

const KNOB_NAME = /^knob-(.+)$/
const FADER_NAME = /^fader-(.+)$/
const WHITE_KEY = /^white-key-(\d+)$/
const BLACK_KEY = /^black-key-(\d+)$/
const PAD_FLAT = /^pad-(\d+)$/

// ────────────────────────────────────────────────────────────────────────────
// Knob drag-rotate — sweeps 270° (−135°..+135°), value 0..1
// ────────────────────────────────────────────────────────────────────────────

export interface KnobInteraction {
  id: string
  object: Object3D
  baseRotationZ: number
  startY: number
  startValue: number
}

export interface UseKnobDragOptions {
  idFromName?: (name: string) => string | null
  pixelsPerTurn?: number
  onValueChange?: (id: string, value: number) => void
  onTurn?: (knobId: string, value: number) => void
}

const defaultKnobId = (name: string): string | null => {
  const m = name.match(KNOB_NAME)
  return m ? m[1] : null
}

export function useKnobDrag(opts: UseKnobDragOptions = {}) {
  const state = useRef<KnobInteraction | null>(null)
  const optsRef = useRef(opts)
  optsRef.current = opts

  const onMove = useCallback((e: PointerEvent) => {
    const s = state.current
    if (!s) return
    const { pixelsPerTurn = 180, onValueChange, onTurn } = optsRef.current
    const delta = (s.startY - e.clientY) / pixelsPerTurn
    const value = Math.max(0, Math.min(1, s.startValue + delta))
    s.object.rotation.z = s.baseRotationZ + (value - 0.5) * (Math.PI * 1.5)
    onValueChange?.(s.id, value)
    onTurn?.(s.id, value)
  }, [])

  const onUp = useCallback(() => {
    state.current = null
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
  }, [onMove])

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    const idFromName = optsRef.current.idFromName ?? defaultKnobId
    const id = idFromName(e.object.name)
    if (id == null) return
    e.stopPropagation()
    // If the hit mesh is itself a knob group (named `knob-…`), rotate it;
    // otherwise (e.g. a `knob-base-${i}` child) rotate its parent group so the
    // whole knob incl. indicator turns.
    const obj = e.object.name.startsWith("knob-") ? e.object : (e.object.parent ?? e.object)
    state.current = {
      id,
      object: obj,
      baseRotationZ: obj.rotation.z,
      startY: e.nativeEvent.clientY,
      startValue: 0.5,
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }, [onMove, onUp])

  useEffect(() => () => {
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
  }, [onMove, onUp])

  return { onPointerDown }
}

// ────────────────────────────────────────────────────────────────────────────
// Fader drag-slide — value 0..1 along a track of a given world length
// ────────────────────────────────────────────────────────────────────────────

export interface FaderInteraction {
  id: string
  object: Object3D
  basePosY: number
  trackLength: number
  startY: number
  startValue: number
}

export interface UseFaderDragOptions {
  idFromName?: (name: string) => string | null
  trackLength?: number
  pixelsPerSweep?: number
  onValueChange?: (id: string, value: number) => void
  onMove?: (faderId: string, value: number) => void
}

const defaultFaderId = (name: string): string | null => {
  const m = name.match(FADER_NAME)
  return m ? m[1] : null
}

export function useFaderDrag(opts: UseFaderDragOptions = {}) {
  const state = useRef<FaderInteraction | null>(null)
  const optsRef = useRef(opts)
  optsRef.current = opts

  const onMove = useCallback((e: PointerEvent) => {
    const s = state.current
    if (!s) return
    const { pixelsPerSweep = 160, onValueChange, onMove: onCb } = optsRef.current
    const delta = (s.startY - e.clientY) / pixelsPerSweep
    const value = Math.max(0, Math.min(1, s.startValue + delta))
    s.object.position.y = s.basePosY - s.trackLength / 2 + value * s.trackLength
    onValueChange?.(s.id, value)
    onCb?.(s.id, value)
  }, [])

  const onUp = useCallback(() => {
    state.current = null
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
  }, [onMove])

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    const { idFromName = defaultFaderId, trackLength = 0.06 } = optsRef.current
    const id = idFromName(e.object.name)
    if (id == null) return
    e.stopPropagation()
    state.current = {
      id,
      object: e.object,
      basePosY: e.object.position.y,
      trackLength,
      startY: e.nativeEvent.clientY,
      startValue: 0.5,
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }, [onMove, onUp])

  useEffect(() => () => {
    window.removeEventListener("pointermove", onMove)
    window.removeEventListener("pointerup", onUp)
  }, [onMove, onUp])

  return { onPointerDown }
}

// ────────────────────────────────────────────────────────────────────────────
// Key click-press — depresses the key briefly, fires note+velocity
// ────────────────────────────────────────────────────────────────────────────

export interface UseKeyPressOptions {
  baseNote?: number
  velocity?: number
  keyInfoFromName?: (name: string) => { index: number; isBlack: boolean } | null
  onPress?: (note: number, velocity: number) => void
}

const defaultKeyInfo = (name: string): { index: number; isBlack: boolean } | null => {
  const w = name.match(WHITE_KEY)
  if (w) return { index: Number(w[1]), isBlack: false }
  const b = name.match(BLACK_KEY)
  if (b) return { index: Number(b[1]), isBlack: true }
  return null
}

export function useKeyPress(opts: UseKeyPressOptions = {}) {
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const optsRef = useRef(opts)
  optsRef.current = opts

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    const { keyInfoFromName = defaultKeyInfo, baseNote = 36, velocity = 0.9, onPress } = optsRef.current
    const info = keyInfoFromName(e.object.name)
    if (!info) return
    e.stopPropagation()
    const obj = e.object
    const restAngle = obj.rotation.x
    obj.rotation.x = restAngle - (info.isBlack ? 0.06 : 0.04)
    const note = baseNote + info.index
    onPress?.(note, velocity)
    const name = e.object.name
    const prev = timers.current.get(name)
    if (prev) clearTimeout(prev)
    const t = setTimeout(() => {
      obj.rotation.x = restAngle
      timers.current.delete(name)
    }, 120)
    timers.current.set(name, t)
  }, [])

  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    timers.current.clear()
  }, [])

  return { onPointerDown }
}

// ────────────────────────────────────────────────────────────────────────────
// Pad hover-glow — boosts emissiveIntensity on enter, restores on leave
// ────────────────────────────────────────────────────────────────────────────

export interface UsePadHoverOptions {
  indexFromName?: (name: string) => number | null
  onHit?: (padId: number, velocity: number) => void
}

const defaultPadIndex = (name: string): number | null => {
  const m = name.match(PAD_FLAT)
  return m ? Number(m[1]) : null
}

export function usePadHover(opts: UsePadHoverOptions = {}) {
  const optsRef = useRef(opts)
  optsRef.current = opts

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    const { indexFromName = defaultPadIndex } = optsRef.current
    if (indexFromName(e.object.name) == null) return
    e.stopPropagation()
    const mat = (e.object as Mesh).material as any
    if (mat && "emissiveIntensity" in mat) mat.emissiveIntensity = 1.8
  }, [])

  const onPointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    const { indexFromName = defaultPadIndex } = optsRef.current
    if (indexFromName(e.object.name) == null) return
    e.stopPropagation()
    const mat = (e.object as Mesh).material as any
    if (mat && "emissiveIntensity" in mat) mat.emissiveIntensity = 0.4
  }, [])

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    const { indexFromName = defaultPadIndex, onHit } = optsRef.current
    const idx = indexFromName(e.object.name)
    if (idx == null) return
    e.stopPropagation()
    onHit?.(idx, 0.9)
  }, [])

  return { onPointerOver, onPointerOut, onPointerDown }
}
