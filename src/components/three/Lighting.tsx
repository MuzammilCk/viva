"use client"

import { Environment, ContactShadows } from "@react-three/drei"
import { useMemo, useRef } from "react"
import * as THREE from "three"

interface LightingProps {
  preset?: "studio" | "dramatic" | "soft" | "hero" | "product"
  intensity?: number
  environment?: string | null
  environmentIntensity?: number
  environmentRotation?: number
}

export function Lighting({
  preset = "studio",
  intensity = 1,
  environment = null,
  environmentIntensity = 1,
  environmentRotation = 0,
}: LightingProps) {
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D())
  const lights = useMemo(() => {
    const baseIntensity = intensity

    switch (preset) {
      case "studio":
        return (
          <>
            {/* Key light - main directional */}
            <directionalLight
              position={[5, 10, 7]}
              intensity={1.5 * baseIntensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              shadow-bias={-0.0001}
            />

            {/* Fill light - softer, opposite side */}
            <directionalLight
              position={[-8, 5, 3]}
              intensity={0.6 * baseIntensity}
              color="#88aaff"
            />

            {/* Rim/back light - creates edge definition */}
            <directionalLight
              position={[0, 8, -10]}
              intensity={1.0 * baseIntensity}
              color="#fff8e8"
            />

            {/* Ambient for base illumination */}
            <ambientLight intensity={0.3 * baseIntensity} color="#ffffff" />
          </>
        )

      case "dramatic":
        return (
          <>
            {/* Strong key light from side */}
            <directionalLight
              position={[10, 8, 5]}
              intensity={2.0 * baseIntensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={50}
              shadow-camera-left={-15}
              shadow-camera-right={15}
              shadow-camera-top={15}
              shadow-camera-bottom={-15}
              shadow-bias={-0.0001}
            />

            {/* Minimal fill - creates deep shadows */}
            <directionalLight
              position={[-5, 3, -5]}
              intensity={0.2 * baseIntensity}
              color="#4466aa"
            />

            {/* Strong rim for dramatic silhouette */}
            <directionalLight
              position={[-2, 10, -12]}
              intensity={1.5 * baseIntensity}
              color="#fff0d0"
            />

            <ambientLight intensity={0.1 * baseIntensity} color="#222233" />
          </>
        )

      case "soft":
        return (
          <>
            {/* Large soft key */}
            <directionalLight
              position={[3, 10, 5]}
              intensity={1.2 * baseIntensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={50}
              shadow-camera-left={-12}
              shadow-camera-right={12}
              shadow-camera-top={12}
              shadow-camera-bottom={-12}
              shadow-bias={-0.0001}
            />

            {/* Soft fill from multiple angles */}
            <directionalLight position={[-5, 6, 4]} intensity={0.5 * baseIntensity} color="#aaccff" />
            <directionalLight position={[0, 8, -6]} intensity={0.4 * baseIntensity} color="#ffeedd" />

            {/* Hemisphere for natural ambient */}
            <primitive
              object={new THREE.HemisphereLight("#ffffff", "#333344", 0.5 * baseIntensity)}
            />

            <ambientLight intensity={0.2 * baseIntensity} />
          </>
        )

      case "hero":
        return (
          <>
            {/* Hero key - slightly above and to side */}
            <directionalLight
              position={[4, 12, 6]}
              intensity={1.8 * baseIntensity}
              castShadow
              shadow-mapSize-width={4096}
              shadow-mapSize-height={4096}
              shadow-camera-near={1}
              shadow-camera-far={50}
              shadow-camera-left={-15}
              shadow-camera-right={15}
              shadow-camera-top={15}
              shadow-camera-bottom={-15}
              shadow-bias={-0.0001}
              shadow-radius={4}
            />

            {/* Accent lights for hero product */}
            <spotLight
              position={[0, 8, 0]}
              target={targetRef.current}
              angle={Math.PI / 6}
              penumbra={0.5}
              decay={1.5}
              intensity={2 * baseIntensity}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            <spotLight
              position={[6, 6, -6]}
              target={targetRef.current}
              angle={Math.PI / 8}
              penumbra={0.3}
              decay={2}
              intensity={1.2 * baseIntensity}
              color="#fff8e8"
            />

            <spotLight
              position={[-6, 6, -6]}
              target={targetRef.current}
              angle={Math.PI / 8}
              penumbra={0.3}
              decay={2}
              intensity={0.8 * baseIntensity}
              color="#cceeff"
            />

            {/* Subtle ambient */}
            <ambientLight intensity={0.15 * baseIntensity} color="#fffef0" />
          </>
        )

      case "product":
      default:
        return (
          <>
            {/* Product photography style lighting */}
            <directionalLight
              position={[3, 10, 5]}
              intensity={1.5 * baseIntensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.5}
              shadow-camera-far={30}
              shadow-camera-left={-8}
              shadow-camera-right={8}
              shadow-camera-top={8}
              shadow-camera-bottom={-8}
              shadow-bias={-0.0001}
            />

            {/* Fill cards */}
            <directionalLight position={[-4, 5, 3]} intensity={0.5 * baseIntensity} color="#e8f0ff" />
            <directionalLight position={[4, 5, -4]} intensity={0.4 * baseIntensity} color="#fff8e8" />

            {/* Top light for top surfaces */}
            <directionalLight position={[0, 12, 0]} intensity={0.6 * baseIntensity} color="#ffffff" />

            {/* Bottom bounce */}
            <directionalLight position={[0, -5, 0]} intensity={0.2 * baseIntensity} color="#333344" />

            <ambientLight intensity={0.25 * baseIntensity} color="#fffef5" />
          </>
        )
    }
  }, [preset, intensity])

  const env = useMemo(() => {
    if (!environment) return null
    return (
      <Environment
        preset={environment as any}
        environmentIntensity={environmentIntensity}
        environmentRotation={[0, environmentRotation, 0]}
      />
    )
  }, [environment, environmentIntensity, environmentRotation])

  return (
    <>
      {lights}
      {env}
      {/* Ground contact shadows */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.3}
        scale={20}
        blur={2}
        far={10}
        resolution={256}
      />
    </>
  )
}

// Convenience component for product shots
export function ProductLighting({ intensity = 1, environment = "studio", ...props }: LightingProps) {
  return <Lighting preset="product" intensity={intensity} environment={environment} {...props} />
}

// Hero section lighting
export function HeroLighting({ intensity = 1, ...props }: LightingProps) {
  return <Lighting preset="hero" intensity={intensity} {...props} />
}

// Studio lighting for general use
export function StudioLighting({ intensity = 1, ...props }: LightingProps) {
  return <Lighting preset="studio" intensity={intensity} {...props} />
}

// Dramatic lighting for emphasis
export function DramaticLighting({ intensity = 1, ...props }: LightingProps) {
  return <Lighting preset="dramatic" intensity={intensity} {...props} />
}