"use client"

import { useThree, useFrame } from "@react-three/fiber"
import { OrbitControls } from "three-stdlib"
import { useEffect, useRef, useMemo } from "react"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"

interface CameraControlsProps {
  /** Enable/disable controls */
  enabled?: boolean
  /** Allow panning */
  enablePan?: boolean
  /** Allow zooming */
  enableZoom?: boolean
  /** Allow rotation */
  enableRotate?: boolean
  /** Minimum zoom distance */
  minDistance?: number
  /** Maximum zoom distance */
  maxDistance?: number
  /** Minimum polar angle (vertical) */
  minPolarAngle?: number
  /** Maximum polar angle (vertical) */
  maxPolarAngle?: number
  /** Minimum azimuth angle (horizontal) */
  minAzimuthAngle?: number
  /** Maximum azimuth angle (horizontal) */
  maxAzimuthAngle?: number
  /** Damping factor for smooth movement */
  dampingFactor?: number
  /** Enable damping */
  enableDamping?: boolean
  /** Auto-rotate when idle */
  autoRotate?: boolean
  /** Auto-rotate speed */
  autoRotateSpeed?: number
  /** Target position to look at */
  target?: [number, number, number]
  /** Callback when camera changes */
  onChange?: (camera: THREE.Camera) => void
  /** Callback when interaction starts */
  onStart?: () => void
  /** Callback when interaction ends */
  onEnd?: () => void
  /** Disable on mobile/touch */
  disableOnMobile?: boolean
  /** Make controls focusable for keyboard navigation */
  tabIndex?: number
}

export function CameraControls({
  enabled = true,
  enablePan = true,
  enableZoom = true,
  enableRotate = true,
  minDistance = 1,
  maxDistance = 20,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
  minAzimuthAngle = -Infinity,
  maxAzimuthAngle = Infinity,
  dampingFactor = 0.05,
  enableDamping = true,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  target = [0, 0, 0],
  onChange,
  onStart,
  onEnd,
  disableOnMobile = false,
  tabIndex = 0,
}: CameraControlsProps) {
  const { camera, gl, size } = useThree()
  const controlsRef = useRef<OrbitControlsType | null>(null)
  const isMobile = useRef(false)
  const mounted = useRef(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const shouldDisable = disableOnMobile && isMobile.current

  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement)
    controlsRef.current = c

    c.enabled = enabled && !shouldDisable
    c.enablePan = enablePan
    c.enableZoom = enableZoom
    c.enableRotate = enableRotate
    c.minDistance = minDistance
    c.maxDistance = maxDistance
    c.minPolarAngle = minPolarAngle
    c.maxPolarAngle = maxPolarAngle
    c.minAzimuthAngle = minAzimuthAngle
    c.maxAzimuthAngle = maxAzimuthAngle
    c.dampingFactor = dampingFactor
    c.enableDamping = enableDamping
    c.autoRotate = autoRotate
    c.autoRotateSpeed = autoRotateSpeed
    c.target.set(...target)
    c.rotateSpeed = 0.7
    c.zoomSpeed = 1.0
    c.panSpeed = 1.0
    c.screenSpacePanning = true
    c.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }

    // Handle interaction events
    c.addEventListener("start", () => {
      onStart?.()
      if (autoRotate) c.autoRotate = false
    })

    c.addEventListener("end", () => {
      onEnd?.()
    })

    c.addEventListener("change", () => {
      onChange?.(camera)
    })

    return c
  }, [])

  // Update controls when props change
  useEffect(() => {
    if (!controlsRef.current) return

    const c = controlsRef.current
    c.enabled = enabled && !shouldDisable
    c.enablePan = enablePan
    c.enableZoom = enableZoom
    c.enableRotate = enableRotate
    c.minDistance = minDistance
    c.maxDistance = maxDistance
    c.minPolarAngle = minPolarAngle
    c.maxPolarAngle = maxPolarAngle
    c.minAzimuthAngle = minAzimuthAngle
    c.maxAzimuthAngle = maxAzimuthAngle
    c.dampingFactor = dampingFactor
    c.enableDamping = enableDamping
    c.autoRotate = autoRotate
    c.autoRotateSpeed = autoRotateSpeed
    c.target.set(...target)
  }, [
    enabled,
    shouldDisable,
    enablePan,
    enableZoom,
    enableRotate,
    minDistance,
    maxDistance,
    minPolarAngle,
    maxPolarAngle,
    minAzimuthAngle,
    maxAzimuthAngle,
    dampingFactor,
    enableDamping,
    autoRotate,
    autoRotateSpeed,
    target,
  ])

  // Update on each frame for damping
  useFrame(() => {
    if (controlsRef.current && enableDamping) {
      controlsRef.current.update()
    }
  })

  // Register with R3F - using gl.domElement for controls reference
  useEffect(() => {
    // Store controls on the DOM element for external access
    ;(gl.domElement as any).__controls = controls
    mounted.current = true
    return () => {
      if (mounted.current) {
        controls.dispose()
        ;(gl.domElement as any).__controls = undefined
        mounted.current = false
      }
    }
  }, [controls])

  // Keyboard navigation support
  useEffect(() => {
    const canvas = gl.domElement
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabled || shouldDisable) return
      if (!controlsRef.current) return

      const controls = controlsRef.current
      const step = 0.1

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          ;(controls as any).rotateUp(-step)
          break
        case "ArrowDown":
          e.preventDefault()
          ;(controls as any).rotateUp(step)
          break
        case "ArrowLeft":
          e.preventDefault()
          ;(controls as any).rotateLeft(step)
          break
        case "ArrowRight":
          e.preventDefault()
          ;(controls as any).rotateLeft(-step)
          break
        case "+":
        case "=":
          e.preventDefault()
          controls.dollyIn(0.9)
          break
        case "-":
          e.preventDefault()
          controls.dollyOut(0.9)
          break
        case "0":
          e.preventDefault()
          controls.reset()
          break
        case " ":
          e.preventDefault()
          controls.autoRotate = !controls.autoRotate
          break
      }
    }

    canvas.addEventListener("keydown", handleKeyDown)
    canvas.setAttribute("tabIndex", String(tabIndex))

    return () => {
      canvas.removeEventListener("keydown", handleKeyDown)
    }
  }, [enabled, shouldDisable, tabIndex])

  // Reduced motion support
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (controlsRef.current) {
        controlsRef.current.enableDamping = !e.matches && enableDamping
        controlsRef.current.autoRotate = false
      }
    }

    if (mediaQuery.matches && controlsRef.current) {
      controlsRef.current.enableDamping = false
      controlsRef.current.autoRotate = false
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [enableDamping])

  return null
}

// Smooth camera transition component
interface CameraTransitionProps {
  /** Target position */
  position?: [number, number, number]
  /** Target look-at point */
  target?: [number, number, number]
  /** Duration in seconds */
  duration?: number
  /** Easing function */
  easing?: (t: number) => number
  /** Callback when transition completes */
  onComplete?: () => void
  /** Trigger transition */
  trigger?: boolean
}

export function CameraTransition({
  position,
  target,
  duration = 1.5,
  easing = (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
  onComplete,
  trigger = false,
}: CameraTransitionProps) {
  const { camera, gl } = useThree()
  const startPosition = useRef<THREE.Vector3>(new THREE.Vector3())
  const startTarget = useRef<THREE.Vector3>(new THREE.Vector3())
  const startTime = useRef<number>(0)
  const active = useRef(false)

  useFrame((state) => {
    if (!active.current || !trigger) return

    const elapsed = state.clock.getElapsedTime() - startTime.current
    const progress = Math.min(elapsed / duration, 1)
    const eased = easing(progress)

    if (position) {
      camera.position.lerpVectors(startPosition.current, new THREE.Vector3(...position), eased)
    }

    if (target) {
      // For OrbitControls, we need to update the target
      const controls = (gl.domElement as any).__controls
      if (controls) {
        controls.target.lerpVectors(startTarget.current, new THREE.Vector3(...target), eased)
      }
    }

    if (progress >= 1) {
      active.current = false
      onComplete?.()
    }
  })

  // This is called externally to trigger the transition
  const triggerRef = useRef(() => {
    startPosition.current.copy(camera.position)
    const controls = (gl.domElement as any).__controls
    if (controls) {
      startTarget.current.copy(controls.target)
    }
    startTime.current = performance.now() / 1000
    active.current = true
  })

  // Expose trigger via imperative handle if needed
  return null
}

// Helper hook for programmatic camera control
export function useCameraControls() {
  const { camera, gl, scene } = useThree()

  const setPosition = (position: [number, number, number], duration = 0) => {
    if (duration <= 0) {
      camera.position.set(...position)
      return
    }
    // Would need animation loop for smooth transitions
    camera.position.set(...position)
  }

  const setTarget = (target: [number, number, number]) => {
    const controls = (gl.domElement as any).__controls
    if (controls) {
      controls.target.set(...target)
    }
  }

  const lookAt = (x: number, y: number, z: number) => {
    camera.lookAt(x, y, z)
  }

  const reset = () => {
    const controls = (gl.domElement as any).__controls
    if (controls) {
      controls.reset()
    }
  }

  const zoomTo = (distance: number) => {
    const controls = (gl.domElement as any).__controls
    if (controls) {
      controls.dollyTo(distance)
    }
  }

  return { setPosition, setTarget, lookAt, reset, zoomTo }
}

// Focus on object helper
export function useFocusOnObject() {
  const { camera, gl, scene } = useThree()

  const focusOn = (objectName: string, distance = 3, duration = 1) => {
    const object = scene.getObjectByName(objectName)
    if (!object) return

    const box = new THREE.Box3().setFromObject(object)
    const center = new THREE.Vector3()
    box.getCenter(center)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
    const dist = (maxDim / 2) / Math.tan(fov / 2) * distance

    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    const targetPos = center.clone().add(direction.multiplyScalar(-dist))

    const controls = (gl.domElement as any).__controls
    if (controls) {
      // Animate to position
      animateCamera(camera.position, targetPos, duration)
      animateTarget(controls.target, center, duration)
    }
  }

  return { focusOn }
}

function animateCamera(from: THREE.Vector3, to: THREE.Vector3, duration: number) {
  const start = performance.now()
  const animate = () => {
    const elapsed = (performance.now() - start) / 1000
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    from.lerp(to, eased)
    if (progress < 1) requestAnimationFrame(animate)
  }
  animate()
}

function animateTarget(from: THREE.Vector3, to: THREE.Vector3, duration: number) {
  const start = performance.now()
  const animate = () => {
    const elapsed = (performance.now() - start) / 1000
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    from.lerp(to, eased)
    if (progress < 1) requestAnimationFrame(animate)
  }
  animate()
}