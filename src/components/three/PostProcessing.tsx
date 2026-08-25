"use client"

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { FXAAPass } from "three/examples/jsm/postprocessing/FXAAPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js"
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js"
import { useThree, useFrame } from "@react-three/fiber"
import { useMemo, useEffect, useRef } from "react"
import * as THREE from "three"

interface PostProcessingProps {
  /** Enable bloom effect */
  bloom?: {
    enabled: boolean
    strength?: number
    radius?: number
    threshold?: number
  }
  /** Enable FXAA anti-aliasing */
  fxaa?: boolean
  /** Enable vignette */
  vignette?: {
    enabled: boolean
    offset?: number
    darkness?: number
  }
  /** Enable chromatic aberration */
  chromaticAberration?: {
    enabled: boolean
    offset?: number
  }
  /** Enable film grain */
  film?: {
    enabled: boolean
    noiseIntensity?: number
    grayscale?: boolean
  }
  /** Enable depth of field (requires depth texture) */
  depthOfField?: {
    enabled: boolean
    focusDistance?: number
    focalLength?: number
    fstop?: number
  }
  /** Custom render target options */
  renderTargetOptions?: {
    minFilter?: THREE.TextureFilter
    magFilter?: THREE.MagnificationTextureFilter
    format?: THREE.PixelFormat
    type?: THREE.TextureDataType
  }
}

export function PostProcessing({
  bloom = { enabled: true, strength: 0.3, radius: 0.5, threshold: 0.8 },
  fxaa = true,
  vignette = { enabled: false, offset: 0.8, darkness: 1.2 },
  chromaticAberration = { enabled: false, offset: 0.001 },
  film = { enabled: false, noiseIntensity: 0.1, grayscale: false },
  depthOfField = { enabled: false },
  renderTargetOptions = {},
}: PostProcessingProps) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const bloomPassRef = useRef<UnrealBloomPass | null>(null)
  const vignettePassRef = useRef<ShaderPass | null>(null)
  const chromaticPassRef = useRef<ShaderPass | null>(null)
  const filmPassRef = useRef<FilmPass | null>(null)
  const fxaaPassRef = useRef<FXAAPass | null>(null)
  const initialized = useRef(false)

  // Initialize composer
  useEffect(() => {
    if (initialized.current) return

    const renderTarget = new THREE.WebGLRenderTarget(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio(), {
      minFilter: renderTargetOptions.minFilter ?? THREE.LinearFilter,
      magFilter: renderTargetOptions.magFilter ?? THREE.LinearFilter,
      format: renderTargetOptions.format ?? THREE.RGBAFormat,
      type: renderTargetOptions.type ?? THREE.HalfFloatType,
      depthBuffer: true,
      stencilBuffer: false,
    })

    renderTarget.texture.name = "PostProcessingRenderTarget"

    // Create composer
    const composer = new EffectComposer(gl, renderTarget)
    composerRef.current = composer

    // Add render pass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Add bloom pass
    if (bloom.enabled) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        bloom.strength ?? 0.3,
        bloom.radius ?? 0.5,
        bloom.threshold ?? 0.8
      )
      bloomPass.threshold = bloom.threshold ?? 0.8
      bloomPass.strength = bloom.strength ?? 0.3
      bloomPass.radius = bloom.radius ?? 0.5
      composer.addPass(bloomPass)
      bloomPassRef.current = bloomPass
    }

    // Add FXAA pass
    if (fxaa) {
      const fxaaPass = new FXAAPass()
      composer.addPass(fxaaPass)
      fxaaPassRef.current = fxaaPass
    }

    // Add vignette pass
    if (vignette.enabled) {
      const vignettePass = new ShaderPass(VignetteShader)
      vignettePass.uniforms["offset"].value = vignette.offset ?? 0.8
      vignettePass.uniforms["darkness"].value = vignette.darkness ?? 1.2
      composer.addPass(vignettePass)
      vignettePassRef.current = vignettePass
    }

    // Add chromatic aberration pass
    if (chromaticAberration.enabled) {
      const chromaticPass = new ShaderPass(RGBShiftShader)
      chromaticPass.uniforms["amount"].value = chromaticAberration.offset ?? 0.001
      composer.addPass(chromaticPass)
      chromaticPassRef.current = chromaticPass
    }

    // Add film pass
    if (film.enabled) {
      const filmPass = new FilmPass(
        film.noiseIntensity ?? 0.1,
        film.grayscale ?? false
      )
      composer.addPass(filmPass)
      filmPassRef.current = filmPass
    }

    initialized.current = true

    // Cleanup
    return () => {
      composer.dispose()
      renderTarget.dispose()
      initialized.current = false
    }
  }, [])

  // Update passes on resize
  useFrame((state) => {
    const composer = composerRef.current
    if (!composer) return

    // Update FXAA resolution
    if (fxaaPassRef.current) {
      fxaaPassRef.current.material.uniforms["resolution"].value.set(
        1 / (size.width * gl.getPixelRatio()),
        1 / (size.height * gl.getPixelRatio())
      )
    }

    // Render with composer instead of default renderer
    composer.render(state.clock.getDelta())
  }, 1) // Run after render

  // Update bloom settings
  useEffect(() => {
    if (bloomPassRef.current) {
      bloomPassRef.current.strength = bloom.strength ?? 0.3
      bloomPassRef.current.radius = bloom.radius ?? 0.5
      bloomPassRef.current.threshold = bloom.threshold ?? 0.8
    }
  }, [bloom])

  // Update vignette settings
  useEffect(() => {
    if (vignettePassRef.current) {
      vignettePassRef.current.uniforms["offset"].value = vignette.offset ?? 0.8
      vignettePassRef.current.uniforms["darkness"].value = vignette.darkness ?? 1.2
    }
  }, [vignette])

  // Update chromatic aberration
  useEffect(() => {
    if (chromaticPassRef.current) {
      chromaticPassRef.current.uniforms["amount"].value = chromaticAberration.offset ?? 0.001
    }
  }, [chromaticAberration])

  return null
}

// Selective bloom - only bloom specific objects
export function SelectiveBloom({
  enabled = true,
  strength = 0.5,
  radius = 0.4,
  threshold = 0.9,
  layer = 1,
}: {
  enabled?: boolean
  strength?: number
  radius?: number
  threshold?: number
  layer?: number
}) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return

    // Create two render targets - one for bloom, one for final
    const renderTarget = new THREE.WebGLRenderTarget(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio(), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    })

    const bloomTarget = new THREE.WebGLRenderTarget(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio(), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    })

    // Create composers
    const bloomComposer = new EffectComposer(gl, bloomTarget)
    const finalComposer = new EffectComposer(gl, renderTarget)

    // Bloom composer - only renders objects on bloom layer
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      strength,
      radius,
      threshold
    )

    // Save original layers
    const originalLayers: Map<THREE.Object3D, number> = new Map()

    // Function to set bloom layer on objects
    const setBloomLayer = (object: THREE.Object3D, bloomLayer: number) => {
      object.layers.enable(bloomLayer)
      originalLayers.set(object, object.layers.mask)
      object.layers.set(bloomLayer)
      object.traverse((child) => {
        child.layers.enable(bloomLayer)
        originalLayers.set(child, child.layers.mask)
        child.layers.set(bloomLayer)
      })
    }

    // Function to restore original layers
    const restoreLayers = () => {
      originalLayers.forEach((mask, object) => {
        object.layers.mask = mask
      })
      originalLayers.clear()
    }

    // Render passes
    const renderScene = new RenderPass(scene, camera)
    const renderBloom = new RenderPass(scene, camera)

    bloomComposer.addPass(renderBloom)
    bloomComposer.addPass(bloomPass)

    finalComposer.addPass(renderScene)

    // Custom shader to combine bloom with scene
    const combineShader = {
      uniforms: {
        tDiffuse: { value: null },
        tBloom: { value: bloomTarget.texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tBloom;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          vec4 bloom = texture2D(tBloom, vUv);
          gl_FragColor = color + bloom;
        }
      `,
    }

    const combinePass = new ShaderPass(combineShader)
    finalComposer.addPass(combinePass)

    // Store references for cleanup
    composerRef.current = finalComposer

    // Store references for cleanup
    ;(bloomComposer as any).originalLayers = originalLayers
    ;(bloomComposer as any).setBloomLayer = setBloomLayer
    ;(bloomComposer as any).restoreLayers = restoreLayers

    initialized.current = true

    return () => {
      bloomComposer.dispose()
      finalComposer.dispose()
      renderTarget.dispose()
      bloomTarget.dispose()
      initialized.current = false
    }
  }, [])

  useFrame((state) => {
    const composer = composerRef.current
    if (!composer) return

    composer.render(state.clock.getDelta())
  }, 1)

  return null
}

// Tone mapping component
export function ToneMapping({
  type = "ACESFilmic",
  exposure = 1.1,
}: {
  type?: "ACESFilmic" | "Linear" | "Reinhard" | "Cineon" | "sRGB"
  exposure?: number
}) {
  const { gl } = useThree()

  useEffect(() => {
    let toneMapping: THREE.ToneMapping

    switch (type) {
      case "ACESFilmic":
        toneMapping = THREE.ACESFilmicToneMapping
        break
      case "Linear":
        toneMapping = THREE.LinearToneMapping
        break
      case "Reinhard":
        toneMapping = THREE.ReinhardToneMapping
        break
      case "Cineon":
        toneMapping = THREE.CineonToneMapping
        break
      case "sRGB":
        toneMapping = THREE.LinearToneMapping // sRGB is handled by output color space
        break
      default:
        toneMapping = THREE.ACESFilmicToneMapping
    }

    gl.toneMapping = toneMapping
    gl.toneMappingExposure = exposure
  }, [type, exposure, gl])

  return null
}

// Color correction / grading
export function ColorGrading({
  contrast = 1.0,
  saturation = 1.0,
  brightness = 1.0,
  gamma = 1.0,
  temperature = 0, // -1 to 1
  tint = 0, // -1 to 1
}: {
  contrast?: number
  saturation?: number
  brightness?: number
  gamma?: number
  temperature?: number
  tint?: number
}) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return

    const renderTarget = new THREE.WebGLRenderTarget(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio(), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    })

    const composer = new EffectComposer(gl, renderTarget)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Color correction shader
    const colorCorrectionShader = {
      uniforms: {
        tDiffuse: { value: null },
        contrast: { value: contrast },
        saturation: { value: saturation },
        brightness: { value: brightness },
        gamma: { value: gamma },
        temperature: { value: temperature },
        tint: { value: tint },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float contrast;
        uniform float saturation;
        uniform float brightness;
        uniform float gamma;
        uniform float temperature;
        uniform float tint;
        varying vec2 vUv;

        vec3 temperatureTint(vec3 color, float temp, float tint) {
          float r = color.r + temp * 0.1;
          float g = color.g - tint * 0.1;
          float b = color.b - temp * 0.1;
          return vec3(r, g, b);
        }

        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          vec3 rgb = color.rgb;

          // Brightness
          rgb *= brightness;

          // Contrast
          rgb = (rgb - 0.5) * contrast + 0.5;

          // Saturation
          float lum = dot(rgb, vec3(0.299, 0.587, 0.114));
          rgb = mix(vec3(lum), rgb, saturation);

          // Temperature & tint
          rgb = temperatureTint(rgb, temperature, tint);

          // Gamma
          rgb = pow(rgb, vec3(1.0 / gamma));

          gl_FragColor = vec4(rgb, color.a);
        }
      `,
    }

    const colorPass = new ShaderPass(colorCorrectionShader)
    composer.addPass(colorPass)

    composerRef.current = composer
    initialized.current = true

    return () => {
      composer.dispose()
      renderTarget.dispose()
      initialized.current = false
    }
  }, [])

  useFrame((state) => {
    const composer = composerRef.current
    if (!composer) return
    composer.render(state.clock.getDelta())
  }, 1)

  return null
}