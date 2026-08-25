import type {
  Product,
  ProductArtKind,
  ProductCategory,
  ProductFinish,
  ProductSpecification,
  ProductVariant,
} from "@/types"

interface RawProduct {
  id: string
  slug: string
  name: string
  category: ProductCategory
  subcategory: string
  price: number
  salePrice?: number
  badge?: string
  description: string
  shortDescription: string
  specs: ProductSpecification[]
  features: string[]
  artKind: ProductArtKind
  featured: boolean
  variants: ProductVariant[]
}

const FINISHES = {
  graphite: { id: "graphite", name: "Graphite", body: "#24262d", panel: "#2e313a", accent: "#9aa0b4" },
  walnut: { id: "walnut", name: "Walnut & Cream", body: "#5b4636", panel: "#e8e0d2", accent: "#b08d57" },
  indigo: { id: "indigo", name: "Indigo", body: "#31355e", panel: "#3d4270", accent: "#7f8cff" },
  silver: { id: "silver", name: "Silver", body: "#c8cbd2", panel: "#eceef1", accent: "#6b7080" },
  black: { id: "black", name: "Matte Black", body: "#1b1c20", panel: "#25262c", accent: "#5c616e" },
  amber: { id: "amber", name: "Amber Panel", body: "#26221c", panel: "#d9a441", accent: "#f0c987" },
} as const satisfies Record<string, ProductFinish>

type FinishKey = keyof typeof FINISHES

const META: Record<
  string,
  { brand: string; rating: number; reviewCount: number; finishes: FinishKey[]; inTheBox: string[] }
> = {
  "synthlab-pro-8": {
    brand: "SynthLab",
    rating: 4.8,
    reviewCount: 214,
    finishes: ["graphite", "walnut", "indigo"],
    inTheBox: ["SynthLab Pro 8", "IEC power cable", "USB-C cable", "Printed patch book", "Limited 5-year warranty"],
  },
  "keylab-61-mkii": {
    brand: "Arturia",
    rating: 4.6,
    reviewCount: 489,
    finishes: ["black", "walnut"],
    inTheBox: ["KeyLab 61 MkII", "USB-C cable", "Analog Lab V license", "Quick-start guide"],
  },
  "apollo-twin-x": {
    brand: "Universal Audio",
    rating: 4.7,
    reviewCount: 356,
    finishes: ["graphite", "silver"],
    inTheBox: ["Apollo Twin X", "Thunderbolt 3 cable", "Power supply", "UAD Heritage Edition plug-ins"],
  },
  "eurorack-case-84hp": {
    brand: "SynthLab",
    rating: 4.5,
    reviewCount: 97,
    finishes: ["black", "walnut"],
    inTheBox: ["84HP Eurorack case", "Slotted power supply", "10 × M3 screws", "Ribbon power cables"],
  },
  "minilab-3": {
    brand: "Arturia",
    rating: 4.4,
    reviewCount: 612,
    finishes: ["black"],
    inTheBox: ["MiniLab 3", "USB-C cable", "Analog Lab Lite license"],
  },
  "patch-cables-30cm": {
    brand: "SynthLab",
    rating: 4.9,
    reviewCount: 158,
    finishes: ["indigo", "amber", "black"],
    inTheBox: ["6 × 30cm patch cables"],
  },
  sub37: {
    brand: "Moog",
    rating: 4.9,
    reviewCount: 178,
    finishes: ["walnut", "black"],
    inTheBox: ["Sub 37 Tribute", "IEC power cable", "Dust cover", "Owner's manual"],
  },
  "focusrite-scarlett-18i20": {
    brand: "Focusrite",
    rating: 4.6,
    reviewCount: 431,
    finishes: ["silver"],
    inTheBox: ["Scarlett 18i20 4th Gen", "USB-C cable", "Power adapter", "Pro Tools Artist + Hitmaker Expansion"],
  },
  "mutable-instruments-plaits": {
    brand: "Mutable Instruments",
    rating: 4.8,
    reviewCount: 143,
    finishes: ["silver", "black"],
    inTheBox: ["Plaits module", "16-pin power ribbon", "Mounting screws"],
  },
  "push-3": {
    brand: "Ableton",
    rating: 4.7,
    reviewCount: 267,
    finishes: ["graphite"],
    inTheBox: ["Push 3 standalone", "Power supply", "Cloth dust cover", "Live 12 Suite license"],
  },
  hydrasynth: {
    brand: "ASM",
    rating: 4.5,
    reviewCount: 129,
    finishes: ["black", "indigo"],
    inTheBox: ["Hydrasynth Explorer", "Power adapter", "Patch sheet collection"],
  },
  "motu-m4": {
    brand: "MOTU",
    rating: 4.7,
    reviewCount: 208,
    finishes: ["black", "silver"],
    inTheBox: ["MOTU M4", "USB-C cable", "Power supply", "DAW software bundle"],
  },
}

function enrich(raw: RawProduct): Product {
  const meta = META[raw.slug]
  return {
    ...raw,
    brand: meta.brand,
    rating: meta.rating,
    reviewCount: meta.reviewCount,
    finishes: meta.finishes.map((key) => FINISHES[key]),
    inTheBox: meta.inTheBox,
  }
}

const rawProducts: RawProduct[] = [
  {
    id: "1",
    slug: "synthlab-pro-8",
    name: "SynthLab Pro 8",
    category: "Synthesizers",
    subcategory: "Analog",
    price: 2499,
    salePrice: 2299,
    badge: "Bestseller",
    description: "The SynthLab Pro 8 is our flagship 8-voice polyphonic analog synthesizer. Featuring dual VCOs per voice with continuous wave shaping, a resonant 4-pole ladder filter, dual ADSR envelopes, and a comprehensive modulation matrix with 16 sources and 24 destinations. Built for the demanding professional who needs both vintage character and modern flexibility.",
    shortDescription: "8-voice polyphonic analog synthesizer with dual VCOs, ladder filter, and modulation matrix.",
    specs: [
      { category: "Synthesis", name: "Type", value: "Analog subtractive" },
      { category: "Synthesis", name: "Polyphony", value: "8 voices" },
      { category: "Synthesis", name: "Oscillators", value: "2 VCOs per voice" },
      { category: "Synthesis", name: "Waveforms", value: "Saw, Square, Triangle, Sine, PWM" },
      { category: "Filter", name: "Type", value: "4-pole ladder, resonant" },
      { category: "Filter", name: "Modes", value: "LP, HP, BP, Notch" },
      { category: "Envelopes", name: "Count", value: "2 ADSR + 1 AD" },
      { category: "Modulation", name: "Matrix", value: "16 sources × 24 destinations" },
      { category: "Keyboard", name: "Keys", value: "61 semi-weighted, aftertouch" },
      { category: "Connectivity", name: "Audio Out", value: "2 × 1/4\" TRS balanced" },
      { category: "Connectivity", name: "Headphones", value: "1 × 1/4\" TRS" },
      { category: "Connectivity", name: "MIDI", value: "In/Out/Thru (5-pin DIN)" },
      { category: "Connectivity", name: "USB", value: "USB-C (MIDI + Audio)" },
      { category: "Connectivity", name: "CV/Gate", value: "4 × CV In, 2 × Gate Out" },
      { category: "Dimensions", name: "Size (W×H×D)", value: "850 × 180 × 350 mm" },
      { category: "Dimensions", name: "Weight", value: "12.5 kg" },
    ],
    features: [
      "True analog signal path — no DSP in audio chain",
      "Per-voice analog VCOs with temperature compensation",
      "Ladder filter with drive and resonance compensation",
      "16-slot modulation matrix with per-voice routing",
      "Polyphonic aftertouch and MPE support",
      "64-step sequencer with parameter locks",
      "USB audio interface (24-bit/96kHz)",
      "Firmware updatable via USB",
    ],
    artKind: "synthesizer",
    featured: true,
    variants: [
      {
        id: "1-standard",
        name: "Standard",
        sku: "SYN-PRO8-STD",
        price: 2499,
        salePrice: 2299,
        inStock: true,
        stockCount: 15,
        attributes: { color: "Dark" },
      },
    ],
  },
  {
    id: "2",
    slug: "keylab-61-mkii",
    name: "KeyLab 61 MkII",
    category: "Controllers",
    subcategory: "Keyboard",
    price: 599,
    description: "The KeyLab 61 MkII is a professional 61-key MIDI controller with semi-weighted, velocity-sensitive keys, aftertouch, 16 RGB-backlit pads, 9 motorized faders, and 12 rotary encoders. Deep integration with major DAWs including Ableton Live, Logic Pro, Cubase, and Pro Tools. Includes Analog Lab V with 6000+ sounds.",
    shortDescription: "61-key semi-weighted controller with 16 RGB pads, 9 faders, and deep DAW integration.",
    specs: [
      { category: "Keyboard", name: "Keys", value: "61 semi-weighted, velocity-sensitive" },
      { category: "Keyboard", name: "Aftertouch", value: "Channel aftertouch" },
      { category: "Pads", name: "Count", value: "16 RGB-backlit, velocity-sensitive" },
      { category: "Faders", name: "Count", value: "9 motorized, 100mm" },
      { category: "Encoders", name: "Count", value: "12 endless, detented" },
      { category: "Buttons", name: "Count", value: "40+ programmable" },
      { category: "Display", name: "Type", value: "2.8\" color LCD" },
      { category: "Connectivity", name: "MIDI", value: "In/Out (5-pin DIN)" },
      { category: "Connectivity", name: "USB", value: "USB-C (bus powered)" },
      { category: "Connectivity", name: "Pedals", value: "Sustain, Expression (1/4\" TRS)" },
      { category: "Connectivity", name: "CV/Gate", value: "4 × CV Out, 2 × Gate Out" },
      { category: "Power", name: "Source", value: "USB bus powered" },
      { category: "Dimensions", name: "Size (W×H×D)", value: "960 × 95 × 305 mm" },
      { category: "Dimensions", name: "Weight", value: "6.2 kg" },
    ],
    features: [
      "Semi-weighted keybed with aftertouch",
      "16 RGB velocity-sensitive pads",
      "9 motorized faders with LED position indicators",
      "12 endless rotary encoders with value displays",
      "DAW control modes for all major DAWs",
      "Analog Lab V included (6000+ presets)",
      "USB bus powered — no external power supply",
      "Aluminum chassis with wood side panels",
    ],
    artKind: "controller",
    featured: true,
    variants: [
      {
        id: "2-standard",
        name: "Standard",
        sku: "KEYLAB61-STD",
        price: 599,
        inStock: true,
        stockCount: 25,
        attributes: { color: "Black" },
      },
    ],
  },
  {
    id: "3",
    slug: "apollo-twin-x",
    name: "Apollo Twin X",
    category: "Audio Interfaces",
    subcategory: "Thunderbolt",
    price: 899,
    badge: "Top Rated",
    description: "The Apollo Twin X is a 10×6 Thunderbolt 3 audio interface with world-class A/D and D/A conversion, dual Unison preamps, and real-time UAD processing. Features sub-1ms latency, 127 dB dynamic range, and includes the Heritage Edition UAD plug-in bundle.",
    shortDescription: "10×6 Thunderbolt interface with UAD processing, Unison preamps, and sub-1ms latency.",
    specs: [
      { category: "Audio", name: "Sample Rates", value: "44.1–192 kHz" },
      { category: "Audio", name: "Bit Depth", value: "24-bit" },
      { category: "Audio", name: "Dynamic Range", value: "127 dB (A-weighted)" },
      { category: "Audio", name: "THD+N", value: "< -110 dB" },
      { category: "Preamps", name: "Count", value: "2 × Unison-enabled" },
      { category: "Preamps", name: "Gain Range", value: "0–60 dB" },
      { category: "Preamps", name: "Phantom Power", value: "+48V (per channel)" },
      { category: "Inputs", name: "Mic/Line", value: "2 × XLR/TRS combo" },
      { category: "Inputs", name: "Hi-Z", value: "1 × 1/4\" (front panel)" },
      { category: "Outputs", name: "Line", value: "4 × 1/4\" TRS" },
      { category: "Outputs", name: "Headphones", value: "2 × 1/4\" (front panel)" },
      { category: "Outputs", name: "Monitor", value: "1 × 1/4\" TRS (dedicated)" },
      { category: "Connectivity", name: "Interface", value: "Thunderbolt 3" },
      { category: "Processing", name: "UAD Cores", value: "DUO Core" },
      { category: "Latency", name: "Round-trip", value: "< 1 ms" },
      { category: "Dimensions", name: "Size (W×H×D)", value: "180 × 55 × 160 mm" },
      { category: "Dimensions", name: "Weight", value: "1.2 kg" },
    ],
    features: [
      "Elite-class A/D and D/A conversion",
      "Unison preamp technology for authentic analog tone",
      "Real-time UAD processing with near-zero latency",
      "Includes Heritage Edition UAD plug-in bundle",
      "Thunderbolt 3 for maximum bandwidth",
      "Dual headphone outputs with independent level",
      "Monitor control with dim, mono, and mute",
      "Console application for routing and control",
    ],
    artKind: "interface",
    featured: true,
    variants: [
      {
        id: "3-standard",
        name: "Standard",
        sku: "APL-TWINX-STD",
        price: 899,
        inStock: true,
        stockCount: 10,
        attributes: { color: "Silver" },
      },
    ],
  },
  {
    id: "4",
    slug: "eurorack-case-84hp",
    name: "Eurorack Case 84HP 3U",
    category: "Eurorack Modular",
    subcategory: "Case",
    price: 449,
    description: "Professional 84HP Eurorack case with 3U height (2 rows). Features a 2A linear power supply with low noise, bus boards with 14-pin connectors, aluminum rails with M2.5 threaded holes, and a sturdy steel chassis. Includes mounting hardware and cable ties.",
    shortDescription: "84HP 3U powered case with 2A power supply, bus boards, and aluminum rails.",
    specs: [
      { category: "Case", name: "Width", value: "84 HP (426.7 mm)" },
      { category: "Case", name: "Height", value: "3U (133.35 mm), 2 rows" },
      { category: "Case", name: "Depth", value: "80 mm (module clearance)" },
      { category: "Power", name: "Supply Type", value: "Linear, low noise" },
      { category: "Power", name: "+12V Current", value: "2 A" },
      { category: "Power", name: "-12V Current", value: "1.5 A" },
      { category: "Power", name: "+5V Current", value: "1 A" },
      { category: "Bus Boards", name: "Connectors", value: "2 × 14-pin (16 modules per row)" },
      { category: "Bus Boards", name: "Standard", value: "Doepfer A-100 compatible" },
      { category: "Rails", name: "Material", value: "Aluminum, M2.5 threaded" },
      { category: "Rails", name: "Spacing", value: "Standard 5.08 mm (1 HP)" },
      { category: "Chassis", name: "Material", value: "Powder-coated steel" },
      { category: "Dimensions", name: "Size (W×H×D)", value: "460 × 155 × 100 mm" },
      { category: "Dimensions", name: "Weight", value: "3.8 kg" },
    ],
    features: [
      "Clean linear power supply — no switching noise",
      "Ample current for demanding modules",
      "Aluminum rails for precise module alignment",
      "Threaded M2.5 holes — no nuts required",
      "Ventilation slots for thermal management",
      "Rubber feet for desktop stability",
      "Rack ears included for 19\" mounting",
      "1-year warranty on power supply",
    ],
    artKind: "modular",
    featured: false,
    variants: [
      {
        id: "4-standard",
        name: "Standard",
        sku: "EUR-CASE-84HP",
        price: 449,
        inStock: true,
        stockCount: 8,
        attributes: { color: "Black" },
      },
    ],
  },
  {
    id: "5",
    slug: "minilab-3",
    name: "MiniLab 3",
    category: "Controllers",
    subcategory: "Compact",
    price: 149,
    badge: "Value Pick",
    description: "The MiniLab 3 is a compact 25-key USB MIDI controller with velocity-sensitive slim keys, 8 rotary encoders, 4 banks (32 assignments), and a mini display. Includes Analog Lab Intro, Ableton Live Lite, and UVI Grand Piano Model D. Perfect for mobile production and tight spaces.",
    shortDescription: "25-key velocity-sensitive controller with 8 rotary encoders and 4 banks.",
    specs: [
      { category: "Keyboard", name: "Keys", value: "25 slim, velocity-sensitive" },
      { category: "Encoders", name: "Count", value: "8 endless, clickable" },
      { category: "Banks", name: "Count", value: "4 (32 total assignments)" },
      { category: "Pads", name: "Count", value: "8 RGB, velocity-sensitive" },
      { category: "Display", name: "Type", value: "Mini OLED" },
      { category: "Controls", name: "Touch Strip", value: "Pitch bend / Mod wheel" },
      { category: "Connectivity", name: "USB", value: "USB-C (bus powered)" },
      { category: "Connectivity", name: "MIDI Out", value: "3.5mm TRS (Type A)" },
      { category: "Connectivity", name: "Sustain", value: "1/4\" TS" },
      { category: "Software", name: "Included", value: "Analog Lab Intro, Ableton Live Lite, UVI Grand Piano Model D" },
      { category: "Dimensions", name: "Size (W×H×D)", value: "360 × 50 × 210 mm" },
      { category: "Dimensions", name: "Weight", value: "1.5 kg" },
    ],
    features: [
      "Ultra-portable — fits in a backpack",
      "8 clickable endless encoders",
      "8 RGB velocity-sensitive pads",
      "Mini OLED display for parameter feedback",
      "Touch strip for pitch/mod control",
      "USB-C bus powered",
      "Analog Lab Intro included (500+ sounds)",
      "Ableton Live Lite included",
    ],
    artKind: "controller",
    featured: false,
    variants: [
      {
        id: "5-standard",
        name: "Standard",
        sku: "MINILAB3-STD",
        price: 149,
        inStock: true,
        stockCount: 50,
        attributes: { color: "White" },
      },
    ],
  },
  {
    id: "6",
    slug: "patch-cables-30cm",
    name: "Patch Cables 30cm (10-pack)",
    category: "Accessories",
    subcategory: "Cables",
    price: 39,
    description: "High-quality 3.5mm TS patch cables for Eurorack modular systems. 30cm length, flexible PVC jacket, gold-plated connectors, and strain relief. Pack includes 10 cables in assorted colors for easy signal tracing.",
    shortDescription: "High-quality 3.5mm patch cables for Eurorack systems.",
    specs: [
      { category: "Cable", name: "Connector", value: "3.5mm TS (mono)" },
      { category: "Cable", name: "Length", value: "30 cm" },
      { category: "Cable", name: "Conductors", value: "OFC copper, 24 AWG" },
      { category: "Cable", name: "Jacket", value: "Flexible PVC, 2.8 mm OD" },
      { category: "Connector", name: "Plating", value: "Gold-plated contacts" },
      { category: "Connector", name: "Strain Relief", value: "Molded, 15 mm" },
      { category: "Pack", name: "Quantity", value: "10 cables" },
      { category: "Pack", name: "Colors", value: "Red, Blue, Green, Yellow, Orange, Purple, Gray, White, Black, Brown" },
    ],
    features: [
      "Gold-plated contacts for reliable connection",
      "Flexible PVC jacket for tight patches",
      "Molded strain relief prevents breakage",
      "10 assorted colors for signal tracing",
      "Compatible with all 3.5mm Eurorack jacks",
      "Lifetime warranty",
    ],
    artKind: "accessory",
    featured: false,
    variants: [
      {
        id: "6-standard",
        name: "10-Pack Assorted",
        sku: "PATCH-30CM-10PK",
        price: 39,
        inStock: true,
        stockCount: 100,
        attributes: { color: "Assorted" },
      },
    ],
  },
  {
    id: "7",
    slug: "sub37",
    name: "Sub 37 Tribute",
    category: "Synthesizers",
    subcategory: "Analog",
    price: 1799,
    description: "Paraphonic analog synthesizer with 37-key keyboard and extensive modulation.",
    shortDescription: "Paraphonic analog synthesizer with 37-key keyboard and extensive modulation.",
    specs: [
      { category: "Synthesis", name: "Type", value: "Analog subtractive" },
      { category: "Synthesis", name: "Polyphony", value: "Paraphonic (2 oscillators)" },
      { category: "Keyboard", name: "Keys", value: "37 velocity-sensitive" },
      { category: "Oscillators", name: "Count", value: "2 VCOs + sub oscillator" },
      { category: "Filter", name: "Type", value: "Multidrive filter" },
      { category: "Modulation", name: "Sources", value: "2 LFOs, 2 envelopes" },
      { category: "Connectivity", name: "CV/Gate", value: "Extensive patchbay" },
    ],
    features: [
      "Paraphonic architecture — 2 oscillators independently triggered",
      "37-note velocity-sensitive keyboard",
      "Multidrive filter with multiple saturation types",
      "Comprehensive CV/Gate patchbay for modular integration",
      "64-step sequencer with parameter locks",
      "Arpeggiator with multiple modes",
    ],
    artKind: "synthesizer",
    featured: false,
    variants: [
      {
        id: "7-standard",
        name: "Standard",
        sku: "SUB37-STD",
        price: 1799,
        inStock: true,
        stockCount: 5,
        attributes: { color: "Dark" },
      },
    ],
  },
  {
    id: "8",
    slug: "focusrite-scarlett-18i20",
    name: "Scarlett 18i20 4th Gen",
    category: "Audio Interfaces",
    subcategory: "USB",
    price: 549,
    description: "18-in 20-out USB interface with Air mode, auto-gain, and clip safe.",
    shortDescription: "18-in 20-out USB interface with Air mode, auto-gain, and clip safe.",
    specs: [
      { category: "Audio", name: "Sample Rates", value: "Up to 192 kHz" },
      { category: "Audio", name: "Bit Depth", value: "24-bit" },
      { category: "Inputs", name: "Mic Preamps", value: "8 × 4th Gen" },
      { category: "Inputs", name: "Line", value: "2 × 1/4\"" },
      { category: "Inputs", name: "ADAT", value: "8 channels" },
      { category: "Outputs", name: "Line", value: "8 × 1/4\"" },
      { category: "Outputs", name: "Headphones", value: "2 × 1/4\"" },
      { category: "Connectivity", name: "Interface", value: "USB-C" },
      { category: "Features", name: "Air Mode", value: "Yes" },
      { category: "Features", name: "Auto Gain", value: "Yes" },
      { category: "Features", name: "Clip Safe", value: "Yes" },
    ],
    features: [
      "8 fourth-generation mic preamps",
      "Air mode for transformer-like clarity",
      "Auto-gain and clip-safe for worry-free recording",
      "ADAT I/O for 8-channel expansion",
      "USB-C connectivity",
      "Focusrite Control 2 software",
    ],
    artKind: "interface",
    featured: false,
    variants: [
      {
        id: "8-standard",
        name: "Standard",
        sku: "FOC-18I20-STD",
        price: 549,
        inStock: true,
        stockCount: 12,
        attributes: { color: "Red" },
      },
    ],
  },
  {
    id: "9",
    slug: "mutable-instruments-plaits",
    name: "Plaits",
    category: "Eurorack Modular",
    subcategory: "Oscillator",
    price: 299,
    description: "Digital macro-oscillator with multiple synthesis models.",
    shortDescription: "Digital macro-oscillator with multiple synthesis models.",
    specs: [
      { category: "Module", name: "Width", value: "12 HP" },
      { category: "Module", name: "Depth", value: "25 mm" },
      { category: "Power", name: "+12V", value: "40 mA" },
      { category: "Power", name: "-12V", value: "15 mA" },
      { category: "Models", name: "Count", value: "16 synthesis models" },
      { category: "Features", name: "Internal Quantizer", value: "Yes" },
      { category: "Features", name: "Internal AD Envelope", value: "Yes" },
      { category: "Features", name: "Internal LFO", value: "Yes" },
    ],
    features: [
      "16 synthesis models covering virtual analog, wavetable, FM, physical modeling, noise, and more",
      "Built-in AD envelope and LFO",
      "Internal quantizer for melodic sequencing",
      "Morphing between models",
      "12 HP Eurorack format",
    ],
    artKind: "modular",
    featured: false,
    variants: [
      {
        id: "9-standard",
        name: "Standard",
        sku: "PLTS-STD",
        price: 299,
        inStock: true,
        stockCount: 20,
        attributes: { color: "Gray" },
      },
    ],
  },
  {
    id: "10",
    slug: "push-3",
    name: "Ableton Push 3",
    category: "Controllers",
    subcategory: "Pad",
    price: 999,
    badge: "New",
    description: "Standalone pad instrument with MPE-enabled pads and built-in audio interface.",
    shortDescription: "Standalone pad instrument with MPE-enabled pads and built-in audio interface.",
    specs: [
      { category: "Pads", name: "Count", value: "64 MPE-enabled, velocity/pressure sensitive" },
      { category: "Display", name: "Type", value: "Color LCD" },
      { category: "Encoders", name: "Count", value: "11 touch-sensitive" },
      { category: "Audio", name: "Interface", value: "Built-in 2-in/2-out" },
      { category: "Connectivity", name: "USB", value: "USB-C" },
      { category: "Connectivity", name: "WiFi", value: "Yes (Ableton Link)" },
      { category: "Power", name: "Battery", value: "Optional (standalone mode)" },
    ],
    features: [
      "64 MPE-enabled pads with polyphonic aftertouch",
      "Standalone operation — no computer required",
      "Built-in audio interface (2-in/2-out)",
      "Ableton Link over WiFi",
      "Optional battery for mobile production",
      "Deep Ableton Live integration",
    ],
    artKind: "controller",
    featured: false,
    variants: [
      {
        id: "10-standard",
        name: "Standard",
        sku: "PUSH3-STD",
        price: 999,
        inStock: true,
        stockCount: 8,
        attributes: { color: "Black" },
      },
    ],
  },
  {
    id: "11",
    slug: "hydrasynth",
    name: "Hydrasynth",
    category: "Synthesizers",
    subcategory: "Digital",
    price: 1299,
    description: "8-voice polyphonic wavetable synthesizer with PolyTouch keyboard.",
    shortDescription: "8-voice polyphonic wavetable synthesizer with PolyTouch keyboard.",
    specs: [
      { category: "Synthesis", name: "Type", value: "Wavetable / FM / WaveScan" },
      { category: "Synthesis", name: "Polyphony", value: "8 voices" },
      { category: "Oscillators", name: "Per Voice", value: "3 oscillators + 2 mutators" },
      { category: "Wavetables", name: "Count", value: "219 factory + user" },
      { category: "Filter", name: "Types", value: "Multiple (analog models, etc.)" },
      { category: "Keyboard", name: "Keys", value: "49 PolyTouch (aftertouch per key)" },
      { category: "Modulation", name: "Matrix", value: "32 slots, 40+ sources, 100+ destinations" },
      { category: "Connectivity", name: "CV/Gate", value: "2 × CV Out, 1 × Gate Out" },
    ],
    features: [
      "WaveScan synthesis — morph between wavetables",
      "PolyTouch keyboard with per-key aftertouch",
      "Mutators for wave shaping (FM, PWM, sync, etc.)",
      "Massive modulation matrix",
      "Built-in arpeggiator and sequencer",
      "CV/Gate outputs for modular integration",
    ],
    artKind: "synthesizer",
    featured: false,
    variants: [
      {
        id: "11-standard",
        name: "Standard",
        sku: "HYDRA-STD",
        price: 1299,
        inStock: true,
        stockCount: 6,
        attributes: { color: "Dark" },
      },
    ],
  },
  {
    id: "12",
    slug: "motu-m4",
    name: "MOTU M4",
    category: "Audio Interfaces",
    subcategory: "USB",
    price: 199,
    description: "4-in 4-out USB-C interface with ESS Sabre32 DAC and loopback.",
    shortDescription: "4-in 4-out USB-C interface with ESS Sabre32 DAC and loopback.",
    specs: [
      { category: "Audio", name: "Sample Rates", value: "Up to 192 kHz" },
      { category: "Audio", name: "Bit Depth", value: "24-bit" },
      { category: "Inputs", name: "Mic/Line", value: "2 × combo" },
      { category: "Inputs", name: "Line", value: "2 × TRS" },
      { category: "Outputs", name: "Main", value: "2 × TRS" },
      { category: "Outputs", name: "Headphones", value: "1 × 1/4\" + 1 × 1/8\"" },
      { category: "Connectivity", name: "Interface", value: "USB-C" },
      { category: "Features", name: "Loopback", value: "Yes" },
      { category: "Features", name: "DAC", value: "ESS Sabre32" },
      { category: "Features", name: "LCD Meters", value: "Full-color" },
    ],
    features: [
      "ESS Sabre32 Ultra DAC for pristine conversion",
      "Full-color LCD level meters",
      "Loopback for streaming and podcasting",
      "2 mic preamps + 2 line inputs",
      "USB-C bus powered",
      "CueMix 5 software for monitoring",
    ],
    artKind: "interface",
    featured: false,
    variants: [
      {
        id: "12-standard",
        name: "Standard",
        sku: "MOTU-M4-STD",
        price: 199,
        inStock: true,
        stockCount: 30,
        attributes: { color: "Black" },
      },
    ],
  },
]

export const products: Product[] = rawProducts.map(enrich)

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getAllProducts(): Product[] {
  return products
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  )
  const others = products.filter(
    (p) => p.id !== product.id && p.category !== product.category
  )
  return [...sameCategory, ...others].slice(0, limit)
}

export interface CategorySummary {
  category: ProductCategory
  count: number
}

export function getCategorySummaries(): CategorySummary[] {
  return [...new Set(products.map((p) => p.category))].map((category) => ({
    category,
    count: products.filter((p) => p.category === category).length,
  }))
}