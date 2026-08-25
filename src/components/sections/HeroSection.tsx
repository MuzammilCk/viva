import { Stage } from "@react-three/drei"
import { Suspense, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ThreeCanvas } from "@/components/three/Canvas"
import { HeroLighting } from "@/components/three/Lighting"
import { CameraControls } from "@/components/three/CameraControls"
import { SynthesizerModel } from "@/components/three/models/products/SynthesizerModel"
import { MidiControllerModel } from "@/components/three/models/products/MidiControllerModel"
import { AudioInterfaceModel } from "@/components/three/models/products/AudioInterfaceModel"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Zap, Music, Settings, Headphones, Truck, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface HeroSceneProps {
  className?: string
}

const products = {
  synth: {
    name: "Synthesizers",
    model: "SynthLab Pro 8",
    price: "$2,499",
    color: "#00d4ff",
    description: "8-voice polyphonic analog synthesizer with dual VCOs, ladder filter, and extensive modulation matrix.",
    icon: Music,
  },
  controller: {
    name: "Controllers",
    model: "KeyLab 61 MkII",
    price: "$599",
    color: "#ffb800",
    description: "61-key semi-weighted keyboard with 16 RGB pads, 9 faders, and deep DAW integration.",
    icon: Settings,
  },
  interface: {
    name: "Audio Interfaces",
    model: "Apollo Twin X",
    price: "$899",
    color: "#ff4d4d",
    description: "10×6 Thunderbolt interface with UAD processing, Unison preamps, and sub-1ms latency.",
    icon: Headphones,
  },
} as const

type ProductKey = keyof typeof products

function HeroContent() {
  const [activeProduct, setActiveProduct] = useState<ProductKey>("synth")
  const current = products[activeProduct]
  const navigate = useNavigate()

  return (
    <>
      {/* 3D Canvas Area */}
      <div className="relative w-full h-full flex items-center justify-center lg:pr-20">
        <ThreeCanvas
          className="w-full h-full max-w-5xl"
          camera={{ position: [0, 1, 4], fov: 40 }}
          shadows
          toneMapping="ACESFilmic"
          exposure={1.1}
        >
          <HeroLighting preset="hero" intensity={1.2} />
          <CameraControls
            enableDamping
            dampingFactor={0.05}
            autoRotate={true}
            autoRotateSpeed={0.3}
            minDistance={2.5}
            maxDistance={8}
            minPolarAngle={0.3}
            maxPolarAngle={Math.PI / 2 - 0.1}
          />

          {/* Ground/Stage */}
          <Stage
            preset="rembrandt"
            intensity={0.8}
            environment="city"
            shadows={{
              type: "contact",
              opacity: 0.15,
              scale: 12,
            }}
          >
            <Suspense fallback={null}>
              {activeProduct === "synth" && <SynthesizerModel />}
              {activeProduct === "controller" && <MidiControllerModel />}
              {activeProduct === "interface" && <AudioInterfaceModel />}
            </Suspense>
          </Stage>
        </ThreeCanvas>

        {/* Product indicator dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10" role="tablist" aria-label="Product selector">
          {Object.entries(products).map(([key, product]) => (
            <button
              key={key}
              onClick={() => setActiveProduct(key as ProductKey)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]",
                activeProduct === key
                  ? "bg-[var(--color-fg-primary)] scale-125"
                  : "bg-[var(--color-fg-muted)] hover:bg-[var(--color-fg-secondary)]"
              )}
              role="tab"
              aria-selected={activeProduct === key}
              aria-label={`View ${product.name}`}
            />
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-6 lg:pl-20 z-20">
        <div className="max-w-2xl">
          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="primary" className="mb-6 inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-cyan)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent-cyan)]" />
              </span>
              Professional Music Electronics
            </Badge>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display font-bold text-5xl lg:text-7xl lg:leading-[1.1] text-[var(--color-fg-primary)] mb-6 tracking-tight"
          >
            Instruments for the{" "}
            <span className="text-gradient">modern synthesist</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg lg:text-xl text-[var(--color-fg-secondary)] mb-10 max-w-xl leading-relaxed"
          >
            Curated synthesizers, controllers, and audio interfaces. Built for
            sound designers, performers, and studio professionals who demand
            precision and character.
          </motion.p>

          {/* Product info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-strong rounded-2xl p-6 mb-10 border border-[var(--color-border-subtle)] max-w-md"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: current.color + "20" }}
              >
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: current.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)] mb-1">
                  {current.name}
                </p>
                <h3 className="font-display font-semibold text-xl text-[var(--color-fg-primary)] mb-1">
                  {current.model}
                </h3>
                <p className="text-2xl font-bold text-[var(--color-fg-primary)] mb-2">
                  {current.price}
                </p>
                <p className="text-sm text-[var(--color-fg-secondary)] line-clamp-2">
                  {current.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto gap-2" onClick={() => navigate("/products")}>
              Explore Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/products?category=modular")}>
              Configure Modular
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-16 flex flex-wrap items-center gap-8 text-sm text-[var(--color-fg-muted)]"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[var(--color-accent-emerald)]" />
              <span>Free Shipping $199+</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--color-accent-amber)]" />
              <span>3-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-[var(--color-accent-violet)]" />
              <span>Expert Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--color-accent-cyan)]" />
              <span>Fast Processing</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-fg-muted)]"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[var(--color-border-default)] rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[var(--color-fg-muted)] rounded-full"
          />
        </motion.div>
      </motion.div>
    </>
  )
}

// ViewerSkeleton for loading state
function ViewerSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-tertiary)] rounded-xl">
      <div className="animate-pulse space-y-4 text-center">
        <div className="w-32 h-32 mx-auto rounded-2xl bg-[var(--color-border-default)]" />
        <div className="w-24 h-4 mx-auto bg-[var(--color-border-default)] rounded" />
        <div className="w-16 h-3 mx-auto bg-[var(--color-border-default)] rounded" />
      </div>
    </div>
  )
}

export function HeroSection({ className }: HeroSceneProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        className
      )}
      aria-label="Hero 3D showcase"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
      </div>

      <Suspense fallback={<ViewerSkeleton />}>
        <HeroContent />
      </Suspense>
    </section>
  )
}