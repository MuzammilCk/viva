/**
 * VIVA Business Team — Product Catalog Data
 *
 * Real category range: Speakers, Amplifiers, Woofers/Subwoofers, Tweeters,
 * Microphones, Wiring & Accessories, Other.
 *
 * Grounded in: docs/planning/04-viva-website-architecture.md & 02-viva-business-model.md
 *
 * PRICING RULES:
 * - Genuine price in INR or null.
 * - When price is null, UI renders "Contact for price".
 * - No fabricated prices, discounts, or synthetic ratings.
 * - Unconfirmed items are explicitly marked with "PLACEHOLDER —" naming until
 *   verified directly with VIVA in Phase 10.
 */

import type { Product, ProductCategory } from "@/types"

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Speakers",
  "Amplifiers",
  "Woofers/Subwoofers",
  "Tweeters",
  "Microphones",
  "Wiring & Accessories",
  "Other",
]

export const PRODUCTS: Product[] = [
  // 1. Speakers
  {
    id: "placeholder-component-speakers-6-5",
    slug: "placeholder-component-speakers-6-5",
    name: "PLACEHOLDER — 6.5\" 2-Way Component Speaker System",
    brand: "PLACEHOLDER Brand",
    model: "TBD-SPK-65",
    category: "Speakers",
    price: null,
    description:
      "High-fidelity 2-way component speaker package engineered for vehicle door installations, custom pods, and architectural enclosures.",
    specs: [
      { name: "Type", value: "2-Way Component System" },
      { name: "Woofer Size", value: "6.5 Inch (165mm)" },
      { name: "Crossover", value: "External 12dB/octave passive network" },
      { name: "Impedance", value: "4 Ohms" },
    ],
    useCases: ["Car Front Stage Audio", "Custom Vehicle Door Pods", "Commercial Audio Enclosures"],
    images: [],
    featured: true,
  },
  {
    id: "placeholder-coaxial-speakers-6x9",
    slug: "placeholder-coaxial-speakers-6x9",
    name: "PLACEHOLDER — 6x9\" 3-Way Coaxial Speakers",
    brand: "PLACEHOLDER Brand",
    model: "TBD-SPK-69",
    category: "Speakers",
    price: null,
    description:
      "Rear parcel tray and high-output full-range coaxial speakers designed for rich vocal projection and punchy mid-bass response.",
    specs: [
      { name: "Type", value: "3-Way Coaxial" },
      { name: "Size", value: "6 x 9 Inch" },
      { name: "Impedance", value: "4 Ohms" },
      { name: "Mounting Depth", value: "Approx. 75mm" },
    ],
    useCases: ["Car Audio Rear Parcel Trays", "Bus & Heavy Vehicle Cabin Sound", "Retail Space Full-Range Audio"],
    images: [],
    featured: false,
  },

  // 2. Amplifiers
  {
    id: "placeholder-4ch-amplifier",
    slug: "placeholder-4ch-amplifier",
    name: "PLACEHOLDER — 4-Channel Class-D Power Amplifier",
    brand: "PLACEHOLDER Brand",
    model: "TBD-AMP-4CH",
    category: "Amplifiers",
    price: null,
    description:
      "Compact, high-efficiency 4-channel power amplifier suited for powering 4 door speakers or running front stage speakers with a bridged subwoofer channel.",
    specs: [
      { name: "Topology", value: "Class-D High Efficiency" },
      { name: "Channels", value: "4 Channel (Bridgeable 4/3/2)" },
      { name: "Filter Controls", value: "Variable HPF / LPF Crossover" },
      { name: "Protection", value: "Thermal, short-circuit, and overload protection" },
    ],
    useCases: ["Vehicle Cabin Multi-Speaker Setup", "Front Stage + Subwoofer Drive", "Compact Commercial Multi-Zone"],
    images: [],
    featured: true,
  },
  {
    id: "placeholder-monoblock-amplifier",
    slug: "placeholder-monoblock-amplifier",
    name: "PLACEHOLDER — Monoblock Class-D Subwoofer Amplifier",
    brand: "PLACEHOLDER Brand",
    model: "TBD-AMP-MONO",
    category: "Amplifiers",
    price: null,
    description:
      "Dedicated high-current low-frequency power amplifier optimized for driving single or dual subwoofer loads with stability and thermal headroom.",
    specs: [
      { name: "Topology", value: "Class-D Monoblock" },
      { name: "Stability", value: "1-Ohm / 2-Ohm Stable" },
      { name: "Low-Pass Filter", value: "30Hz – 250Hz Variable" },
      { name: "Subsonic Filter", value: "10Hz – 50Hz Variable" },
      { name: "Bass Boost", value: "0 – 12dB @ 45Hz" },
    ],
    useCases: ["Vehicle Subwoofer Enclosures", "Home Cinema Dedicated Sub Drive", "High-SPL Custom Builds"],
    images: [],
    featured: false,
  },

  // 3. Woofers/Subwoofers
  {
    id: "placeholder-subwoofer-12-inch",
    slug: "placeholder-subwoofer-12-inch",
    name: "PLACEHOLDER — 12\" High-Excursion Enclosed Subwoofer",
    brand: "PLACEHOLDER Brand",
    model: "TBD-SUB-12",
    category: "Woofers/Subwoofers",
    price: null,
    description:
      "Deep-bass transducer designed for ported or sealed custom enclosures, delivering authoritative low-frequency impact and sustained bass notes.",
    specs: [
      { name: "Diameter", value: "12 Inch (300mm)" },
      { name: "Voice Coil", value: "Dual 4-Ohm (Configurable 2-Ohm / 8-Ohm)" },
      { name: "Cone Material", value: "Reinforced Polypropylene with High-Roll Foam Surround" },
      { name: "Magnet", value: "High-Flux Ferrite Motor Structure" },
    ],
    useCases: ["Car Boot Custom Box Fabrications", "SUV & Hatchback Bass Upgrades", "Café / Lounge Subwoofer Enclosures"],
    images: [],
    featured: true,
  },
  {
    id: "placeholder-underseat-active-sub",
    slug: "placeholder-underseat-active-sub",
    name: "PLACEHOLDER — Compact Under-Seat Active Subwoofer",
    brand: "PLACEHOLDER Brand",
    model: "TBD-SUB-ACTIVE",
    category: "Woofers/Subwoofers",
    price: null,
    description:
      "Slim-profile powered subwoofer with built-in amplifier and wired remote level control, engineered for discreet placement under vehicle seats.",
    specs: [
      { name: "Form Factor", value: "Slim Cast-Aluminum Sealed Enclosure" },
      { name: "Driver Size", value: "8 Inch (200mm)" },
      { name: "Built-in Amp", value: "Integrated Class-D High-Efficiency" },
      { name: "Inputs", value: "Speaker-level (High) & RCA (Low) inputs" },
    ],
    useCases: ["Hatchbacks & Sedans Space-Saver", "Auto Rickshaw Custom Audio", "Pickup Truck Cabin Bass"],
    images: [],
    featured: false,
  },

  // 4. Tweeters
  {
    id: "placeholder-silk-dome-tweeters",
    slug: "placeholder-silk-dome-tweeters",
    name: "PLACEHOLDER — 25mm Silk Dome Tweeter Pair",
    brand: "PLACEHOLDER Brand",
    model: "TBD-TWT-25",
    category: "Tweeters",
    price: null,
    description:
      "Smooth, non-fatiguing high-frequency reproduction with inline protection crossovers and multi-angle surface and flush mounting pods.",
    specs: [
      { name: "Diaphragm", value: "25mm (1\") Hand-Treated Silk Dome" },
      { name: "Magnet", value: "Neodymium Micro-Motor" },
      { name: "Crossover", value: "6dB/octave Inline Passive Filter" },
      { name: "Mounting Options", value: "Flush mount / Angle surface cup" },
    ],
    useCases: ["A-Pillar Custom Staging Pods", "Dashboard High-Frequency Upgrades", "Door Mirror Triangle Custom Mounts"],
    images: [],
    featured: false,
  },

  // 5. Microphones
  {
    id: "placeholder-commercial-microphone",
    slug: "placeholder-commercial-microphone",
    name: "PLACEHOLDER — Professional Dynamic Vocal & Announcement Microphone",
    brand: "PLACEHOLDER Brand",
    model: "TBD-MIC-PRO",
    category: "Microphones",
    price: null,
    description:
      "Cardioid dynamic microphone designed for vocal intelligibility, public address, religious institutions, and venue announcements.",
    specs: [
      { name: "Polar Pattern", value: "Cardioid Dynamic" },
      { name: "Frequency Response", value: "50Hz – 15,000Hz" },
      { name: "Output Impedance", value: "600 Ohms Balanced" },
      { name: "Connector", value: "3-pin Gold-plated XLR male" },
      { name: "Switch", value: "Silent magnetic lockable on/off switch" },
    ],
    useCases: ["Commercial Announcement Systems", "Auditoriums & Public Address", "Places of Worship Audio Systems"],
    images: [],
    featured: false,
  },

  // 6. Wiring & Accessories
  {
    id: "placeholder-amplifier-wiring-kit-4ga",
    slug: "placeholder-amplifier-wiring-kit-4ga",
    name: "PLACEHOLDER — 4-Gauge OFC Power & Ground Wiring Kit",
    brand: "PLACEHOLDER Brand",
    model: "TBD-WIR-4GA",
    category: "Wiring & Accessories",
    price: null,
    description:
      "Pure Oxygen-Free Copper power and ground cabling package complete with in-line ANL fuse block, twisted-pair shielded RCA cables, and terminal hardware.",
    specs: [
      { name: "Conductor", value: "100% Oxygen-Free Copper (OFC)" },
      { name: "Power Cable", value: "4 AWG Ultra-Flex Translucent Red (5.5m)" },
      { name: "Ground Cable", value: "4 AWG Ultra-Flex Translucent Black (1.0m)" },
      { name: "Fuse Holder", value: "Waterproof In-Line ANL Block with 100A Fuse" },
      { name: "Interconnects", value: "2-Channel Twisted-Pair Shielded RCA (5.0m)" },
    ],
    useCases: ["High-Power Car Audio Installs", "Subwoofer & Multi-Channel Amp Racks", "Bus & Heavy Vehicle Power Runs"],
    images: [],
    featured: true,
  },

  // 7. Other
  {
    id: "placeholder-sound-damping-sheets",
    slug: "placeholder-sound-damping-sheets",
    name: "PLACEHOLDER — Multi-Layer Butyl Acoustic Damping Sheets",
    brand: "PLACEHOLDER Brand",
    model: "TBD-ACC-DAMP",
    category: "Other",
    price: null,
    description:
      "Vibration damping and acoustic isolation butyl sheets engineered to eliminate door rattle, suppress exterior road noise, and tighten mid-bass response.",
    specs: [
      { name: "Composition", value: "High-grade Butyl rubber + 100-micron Aluminum constraint layer" },
      { name: "Sheet Thickness", value: "2.0 mm" },
      { name: "Temperature Resistance", value: "-40°C to +140°C" },
      { name: "Application", value: "Vehicle door skins, floor pans, boot lid, roof panels" },
    ],
    useCases: ["Vehicle Door Acoustic Isolation", "Boot Lid Rattle Elimination", "Roof & Cabin Quiet Ride Treatment"],
    images: [],
    featured: false,
  },
]

export function getAllProducts(): Product[] {
  return PRODUCTS
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured)
}

export function getCategorySummaries(): { category: ProductCategory; count: number }[] {
  return PRODUCT_CATEGORIES.map((category) => ({
    category,
    count: PRODUCTS.filter((p) => p.category === category).length,
  }))
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(
    0,
    limit
  )
}