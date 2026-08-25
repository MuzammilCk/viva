/**
 * Design tokens for the music electronics shop
 * Single source of truth for colors, spacing, typography, etc.
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: "#050508",
    secondary: "#0a0a0f",
    tertiary: "#111118",
    card: "#0d0d14",
    elevated: "#14141e",
    overlay: "rgba(5, 5, 8, 0.9)",
  },

  // Foregrounds
  fg: {
    primary: "#f0f0f5",
    secondary: "#a0a0b0",
    muted: "#606070",
    inverse: "#050508",
    disabled: "#3a3a4a",
  },

  // Accents
  accent: {
    cyan: "#00d4ff",
    cyanDim: "#00a8cc",
    amber: "#ffb800",
    amberDim: "#cc9200",
    coral: "#ff4d4d",
    coralDim: "#cc3d3d",
    emerald: "#00ff88",
    emeraldDim: "#00cc6d",
    violet: "#b877ff",
    violetDim: "#9260cc",
  },

  // Borders
  border: {
    subtle: "#1e1e2e",
    default: "#2a2a3e",
    strong: "#3a3a52",
    focus: "#00d4ff",
  },

  // Semantic
  success: "#00ff88",
  warning: "#ffb800",
  error: "#ff4d4d",
  info: "#00d4ff",

  // Focus
  focus: "#00d4ff",
  focusRing: "rgba(0, 212, 255, 0.4)",
} as const

export const typography = {
  fontFamily: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"IBM Plex Sans", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },

  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
    "6xl": "3.75rem",   // 60px
    "7xl": "4.5rem",    // 72px
    "8xl": "6rem",      // 96px
    "9xl": "8rem",      // 128px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.1,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const

export const spacing = {
  0: "0",
  1: "0.25rem",   // 4px
  2: "0.5rem",    // 8px
  3: "0.75rem",   // 12px
  4: "1rem",      // 16px
  5: "1.25rem",   // 20px
  6: "1.5rem",    // 24px
  8: "2rem",      // 32px
  10: "2.5rem",   // 40px
  12: "3rem",     // 48px
  16: "4rem",     // 64px
  20: "5rem",     // 80px
  24: "6rem",     // 96px
  32: "8rem",     // 128px
} as const

export const borderRadius = {
  none: "0",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.5)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.4)",
  glow: {
    cyan: "0 0 20px rgba(0, 212, 255, 0.3)",
    amber: "0 0 20px rgba(255, 184, 0, 0.3)",
    coral: "0 0 20px rgba(255, 77, 77, 0.3)",
    emerald: "0 0 20px rgba(0, 255, 136, 0.3)",
    violet: "0 0 20px rgba(184, 119, 255, 0.3)",
  },
} as const

export const transitions = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "350ms cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
} as const

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export const container = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

// 3D Specific tokens
export const three = {
  // Canvas
  dpr: [1, 2] as [number, number],
  colorManagement: true,
  shadows: true,
  shadowMapType: "PCFSoftShadowMap" as const,

  // Lighting
  ambientIntensity: 0.5,
  keyLightIntensity: 1.5,
  fillLightIntensity: 0.8,
  rimLightIntensity: 1.2,
  hdriIntensity: 1.0,

  // Camera
  fov: 50,
  near: 0.1,
  far: 100,
  defaultPosition: [0, 1.5, 4] as [number, number, number],

  // Controls
  enableDamping: true,
  dampingFactor: 0.05,
  enablePan: true,
  enableZoom: true,
  enableRotate: true,
  minDistance: 1,
  maxDistance: 20,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI,
  autoRotate: false,
  autoRotateSpeed: 0.5,

  // Post-processing
  bloom: {
    enabled: true,
    intensity: 0.3,
    threshold: 0.8,
    radius: 0.5,
  },
  toneMapping: "ACESFilmic" as const,
  toneMappingExposure: 1.1,
  fxaa: true,

  // Performance
  frustumCulled: true,
  instancedMeshThreshold: 10,
} as const

// Animation tokens
export const animation = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
    slowest: 700,
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: "36px",
      md: "44px",
      lg: "52px",
      xl: "60px",
    },
    padding: {
      sm: "0 12px",
      md: "0 20px",
      lg: "0 28px",
      xl: "0 36px",
    },
    fontSize: {
      sm: "0.8125rem",
      md: "0.875rem",
      lg: "1rem",
      xl: "1.125rem",
    },
    borderRadius: "0.5rem",
    gap: "0.5rem",
    iconSize: {
      sm: "16px",
      md: "18px",
      lg: "20px",
      xl: "24px",
    },
  },

  input: {
    height: {
      sm: "36px",
      md: "44px",
      lg: "52px",
    },
    padding: "0 16px",
    fontSize: "0.875rem",
    borderRadius: "0.5rem",
    borderWidth: "1px",
  },

  card: {
    padding: "24px",
    borderRadius: "0.75rem",
    borderWidth: "1px",
    gap: "16px",
  },

  badge: {
    height: "20px",
    padding: "0 8px",
    fontSize: "0.75rem",
    fontWeight: 500,
    borderRadius: "9999px",
    gap: "4px",
  },

  tooltip: {
    padding: "8px 12px",
    fontSize: "0.8125rem",
    borderRadius: "0.375rem",
    gap: "4px",
    maxWidth: "280px",
  },

  modal: {
    maxWidth: "560px",
    borderRadius: "1rem",
    padding: "24px",
    gap: "16px",
  },

  drawer: {
    width: "420px",
    mobileWidth: "100%",
    borderRadius: "0 0 1rem 1rem",
  },

  toast: {
    minWidth: "280px",
    maxWidth: "420px",
    padding: "16px",
    borderRadius: "0.5rem",
    gap: "12px",
  },
} as const

// Export all tokens as a single object for convenience
export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  container,
  three,
  animation,
  components,
} as const

export type Tokens = typeof tokens
export type Colors = typeof colors
export type Typography = typeof typography
export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
export type Transitions = typeof transitions
export type ZIndex = typeof zIndex
export type Breakpoints = typeof breakpoints
export type Container = typeof container
export type Three = typeof three
export type Animation = typeof animation
export type Components = typeof components