"use client"

import { Canvas, type CanvasProps } from "@react-three/fiber"
import { type ReactNode, Suspense } from "react"

interface ThreeCanvasProps extends Omit<CanvasProps, "children" | "camera"> {
  children: ReactNode
  camera?: {
    fov?: number
    near?: number
    far?: number
    position?: [number, number, number]
  }
  fog?: {
    color: number | string
    density: number
  }
  shadows?: boolean
  toneMapping?: "ACESFilmic" | "Linear" | "sRGB"
  exposure?: number
}

export function ThreeCanvas({
  children,
  camera = {},
  fog,
  shadows = true,
  toneMapping = "ACESFilmic",
  exposure = 1.1,
  className,
  style,
  ...props
}: ThreeCanvasProps) {
  const {
    fov = 50,
    near = 0.1,
    far = 100,
    position = [0, 1.5, 4],
  } = camera

  return (
    <Canvas
      className={className}
      style={style}
      camera={{ fov, near, far, position }}
      shadows={shadows}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        logarithmicDepthBuffer: true,
      }}
      dpr={[1, 2]}
      {...props}
    >      {fog && <fog attach="fog" args={[fog.color, fog.density]} />}
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
