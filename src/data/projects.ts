/**
 * VIVA Business Team — Projects Data Layer
 *
 * Real portfolio categories: Vehicles, Home & Theatre, Cafés & Restaurants,
 * Commercial & Business, Custom Work, Repair & Restoration, Other.
 *
 * Grounded in: docs/planning/04-viva-website-architecture.md & 03-viva-business-context.md
 *
 * RULES:
 * - No visible / public project count (quality-led, not volume-led).
 * - No stock photography.
 * - Scaffolding items are unmistakably labeled "PLACEHOLDER —" until real photography
 *   is populated in Phase 10.
 */

import type { Project, ProjectCategory } from "@/types"

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Vehicles",
  "Home & Theatre",
  "Cafés & Restaurants",
  "Commercial & Business",
  "Custom Work",
  "Repair & Restoration",
  "Other",
]

export const PROJECTS: Project[] = [
  {
    id: "placeholder-sedan-audio-upgrade",
    slug: "placeholder-sedan-audio-upgrade",
    title: "PLACEHOLDER — Sedan Multi-Stage Sound Stage Upgrade",
    category: "Vehicles",
    environmentTags: ["Car", "Sedan", "Vehicle Audio"],
    summary: "Front component stage integration with custom door damping and compact 4-channel power amplification.",
    requirement: "Customer wanted balanced vocal clarity and tight bass without sacrificing cabin or boot utility.",
    solution: "Installed 2-way component speakers in damped factory door locations and mounted a compact 4-channel amplifier under the seat.",
    componentsUsed: [
      "6.5\" 2-Way Component Speaker System",
      "4-Channel Class-D Power Amplifier",
      "Multi-Layer Butyl Acoustic Damping Sheets",
      "4-Gauge OFC Power & Ground Wiring Kit",
    ],
    relatedProductIds: [
      "placeholder-component-speakers-6-5",
      "placeholder-4ch-amplifier",
      "placeholder-sound-damping-sheets",
      "placeholder-amplifier-wiring-kit-4ga",
    ],
    media: [],
    featured: true,
    order: 1,
  },
  {
    id: "placeholder-home-theatre-setup",
    slug: "placeholder-home-theatre-setup",
    title: "PLACEHOLDER — Acoustic Home Theatre Calibration & Sub Integration",
    category: "Home & Theatre",
    environmentTags: ["Home Theatre", "Living Room", "Acoustic Tuning"],
    summary: "Dedicated multi-channel surround integration with precision low-frequency alignment and discrete cable routing.",
    requirement: "Clean cinematic sound in a residential living room with zero visible cabling across floors.",
    solution: "Configured multi-point receiver tuning, calibrated dedicated subwoofers for room acoustics, and integrated concealed conduit wiring.",
    componentsUsed: [
      "12\" High-Excursion Enclosed Subwoofer",
      "4-Channel Class-D Power Amplifier",
      "Shielded Interconnects",
    ],
    relatedProductIds: [
      "placeholder-subwoofer-12-inch",
      "placeholder-4ch-amplifier",
    ],
    media: [],
    featured: true,
    order: 2,
  },
  {
    id: "placeholder-cafe-ambient-sound",
    slug: "placeholder-cafe-ambient-sound",
    title: "PLACEHOLDER — Multi-Zone Ambient Audio for Modern Café",
    category: "Cafés & Restaurants",
    environmentTags: ["Café", "Hospitality", "Commercial Space"],
    summary: "Even sound distribution across dining and outdoor seating areas without loud hot-spots.",
    requirement: "A warm, even acoustic environment for background music that allows effortless conversation across tables.",
    solution: "Engineered a zoned commercial audio architecture with balanced multi-speaker coverage and separate volume controls for indoor and patio zones.",
    componentsUsed: [
      "6.5\" 2-Way Component Speaker System",
      "4-Channel Class-D Power Amplifier",
      "4-Gauge OFC Wiring Kit",
    ],
    relatedProductIds: [
      "placeholder-component-speakers-6-5",
      "placeholder-4ch-amplifier",
    ],
    media: [],
    featured: true,
    order: 3,
  },
  {
    id: "placeholder-bus-tourist-sound",
    slug: "placeholder-bus-tourist-sound",
    title: "PLACEHOLDER — High-Output Audio System for Tourist Bus",
    category: "Vehicles",
    environmentTags: ["Bus", "Heavy Vehicle", "Public Transport"],
    summary: "Full-cabin vocal projection and punchy entertainment audio engineered for long-distance travel.",
    requirement: "Powerful, clear audio across a long passenger cabin capable of overcoming diesel engine and highway noise.",
    solution: "Designed distributed multi-speaker array along roof line powered by high-headroom amplification and dedicated passenger-zone subwoofers.",
    componentsUsed: [
      "6x9\" 3-Way Coaxial Speakers",
      "Monoblock Class-D Subwoofer Amplifier",
      "12\" High-Excursion Enclosed Subwoofer",
    ],
    relatedProductIds: [
      "placeholder-coaxial-speakers-6x9",
      "placeholder-monoblock-amplifier",
      "placeholder-subwoofer-12-inch",
    ],
    media: [],
    featured: true,
    order: 4,
  },
  {
    id: "placeholder-auto-rickshaw-custom",
    slug: "placeholder-auto-rickshaw-custom",
    title: "PLACEHOLDER — Custom Sealed Audio Enclosure for Auto Rickshaw",
    category: "Custom Work",
    environmentTags: ["Auto Rickshaw", "Custom Enclosure", "Vehicle Audio"],
    summary: "Water-resistant, high-SPL audio pod fabrication tailored to compact auto-rickshaw geometry.",
    requirement: "Punchy, clear sound in an open-air vehicle with vibration isolation and weather protection.",
    solution: "Fabricated custom fiberglass/wood sealed enclosures with marine-grade terminals and compact high-efficiency amplification.",
    componentsUsed: [
      "Compact Under-Seat Active Subwoofer",
      "25mm Silk Dome Tweeter Pair",
      "Custom Fabricated Enclosure",
    ],
    relatedProductIds: [
      "placeholder-underseat-active-sub",
      "placeholder-silk-dome-tweeters",
    ],
    media: [],
    featured: false,
    order: 5,
  },
  {
    id: "placeholder-amplifier-bench-repair",
    slug: "placeholder-amplifier-bench-repair",
    title: "PLACEHOLDER — Power Amplifier MOSFET Stage Repair & Bench Testing",
    category: "Repair & Restoration",
    environmentTags: ["Electronics Repair", "Bench Testing", "Restoration"],
    summary: "Component-level diagnosis and transistor replacement for an amplifier stuck in protection mode.",
    requirement: "Restore a high-end power amplifier that suffered power-supply MOSFET burnout.",
    solution: "Diagnosed shorted power transistors, replaced with matched genuine components, replaced degraded electrolytic capacitors, and bench-tested under full resistive load.",
    componentsUsed: [
      "Matched Output MOSFETs",
      "High-Temp Filter Capacitors",
      "Thermal Compound & Isolators",
    ],
    relatedProductIds: [
      "placeholder-4ch-amplifier",
    ],
    media: [],
    featured: false,
    order: 6,
  },
]

export function getAllProjects(): Project[] {
  return PROJECTS
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getProjectsByCategory(category: ProjectCategory | string): Project[] {
  return PROJECTS.filter((p) => p.category === category)
}

export function getRelatedProjects(project: Project, limit = 2): Project[] {
  return PROJECTS.filter((p) => p.id !== project.id && p.category === project.category).slice(
    0,
    limit
  )
}
