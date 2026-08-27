/**
 * VIVA Business Team — Services Data Layer
 *
 * Confirmed six core services provided by VIVA Business Team in Kottakkal, Kerala.
 * Grounded in: docs/planning/02-viva-business-model.md & docs/planning/04-viva-website-architecture.md
 */

import type { Service, ProjectCategory } from "@/types"

export const SERVICES: Service[] = [
  {
    id: "complete-audio-solutions",
    slug: "complete-audio-solutions",
    name: "Complete Audio Solutions",
    summary: "End-to-end sound system engineering designed around your space, acoustic requirements, and budget.",
    description:
      "From vehicle cabins to commercial venues and private home theatres, VIVA designs and delivers complete audio systems from scratch. We analyze the acoustic space, understand your listening preferences, engineer the optimal multi-component setup, supply genuine hardware, and personally execute installation and acoustic calibration.",
    applicableEnvironments: [
      "Cars",
      "Buses",
      "Auto Rickshaws",
      "Home Theatres",
      "Cafés & Restaurants",
      "Shops & Offices",
      "Commercial Spaces",
      "Auditoriums & Event Venues",
    ],
    matchingProjectCategories: [
      "Vehicles",
      "Home & Theatre",
      "Cafés & Restaurants",
      "Commercial & Business",
    ],
    ctaLabel: "Discuss Audio Solution",
    ctaMessage: "Hi VIVA team, I would like to discuss a complete audio solution for my vehicle/space.",
    order: 1,
  },
  {
    id: "product-recommendation-supply",
    slug: "product-recommendation-supply",
    name: "Product Recommendation & Supply",
    summary: "Expert component selection and genuine equipment sourcing tailored to your specific acoustic goals and budget.",
    description:
      "Whether you know the exact speaker model you want or simply have a listening goal in mind (such as tighter bass or clearer vocals), VIVA provides knowledgeable advice and supplies genuine components. We evaluate compatibility with your existing hardware and demonstrate options so you can hear the difference before deciding.",
    applicableEnvironments: [
      "Cars & Vehicles",
      "Home Audio",
      "Commercial Sound Systems",
    ],
    matchingProjectCategories: [
      "Vehicles",
      "Home & Theatre",
      "Commercial & Business",
    ],
    ctaLabel: "Ask About Equipment",
    ctaMessage: "Hi VIVA team, I would like guidance on selecting the right audio equipment.",
    order: 2,
  },
  {
    id: "installation-integration",
    slug: "installation-integration",
    name: "Installation & Integration",
    summary: "Precision wiring, acoustic isolation, and clean equipment integration without damaging factory interiors.",
    description:
      "Professional physical installation and integration for audio gear you supply or source through VIVA. We ensure clean cable routing, solid ground connections, proper fuse protection, custom mounting baffles, and door damping to eliminate rattles and maximize acoustic fidelity.",
    applicableEnvironments: [
      "Cars",
      "Buses",
      "Auto Rickshaws",
      "Homes & Theatres",
      "Cafés & Retail Spaces",
    ],
    matchingProjectCategories: [
      "Vehicles",
      "Home & Theatre",
      "Commercial & Business",
      "Cafés & Restaurants",
    ],
    ctaLabel: "Discuss Installation",
    ctaMessage: "Hi VIVA team, I would like to schedule an audio installation.",
    order: 3,
  },
  {
    id: "repair-diagnosis",
    slug: "repair-diagnosis",
    name: "Repair & Diagnosis",
    summary: "Systematic electrical diagnosis, component-level repair, and restoration of faulty or degraded audio equipment.",
    description:
      "When an audio system suffers from channel dropouts, distortion, amplifier protection trips, alternator whine, or power failure, VIVA provides methodical diagnosis and repair. We inspect the system, identify the electrical or mechanical fault, explain the repair scope clearly, and execute bench and in-vehicle fixes.",
    applicableEnvironments: [
      "Vehicle Audio Systems",
      "Home Cinema Receivers",
      "Power Amplifiers",
      "Subwoofers & Speakers",
      "Commercial PA Systems",
    ],
    matchingProjectCategories: [
      "Repair & Restoration",
      "Vehicles",
      "Home & Theatre",
    ],
    ctaLabel: "Discuss Repair",
    ctaMessage: "Hi VIVA team, I have an audio system/equipment that needs diagnosis or repair.",
    order: 4,
  },
  {
    id: "custom-solutions",
    slug: "custom-solutions",
    name: "Custom Solutions",
    summary: "Bespoke enclosure fabrication, acoustic pod builds, and non-standard vehicle or architectural sound setups.",
    description:
      "When off-the-shelf enclosures or factory mounting spots cannot fulfill your space or acoustic requirements, VIVA builds custom solutions. This includes fabricated fiberglass or MDF subwoofer enclosures, custom A-pillar tweeter pods, modified parcel shelves, and bespoke multi-zone distribution setups.",
    applicableEnvironments: [
      "Custom Car Audio",
      "Auto Rickshaws",
      "Buses",
      "Bespoke Home Theatres",
      "Specialized Venues",
    ],
    matchingProjectCategories: [
      "Custom Work",
      "Vehicles",
      "Cafés & Restaurants",
    ],
    ctaLabel: "Discuss Custom Build",
    ctaMessage: "Hi VIVA team, I am looking for a custom audio build / specialized setup.",
    order: 5,
  },
  {
    id: "tuning-upgrades-maintenance",
    slug: "tuning-upgrades-maintenance",
    name: "Tuning, Upgrades & Maintenance",
    summary: "Acoustic calibration, crossover and gain optimization, sound damping upgrades, and long-term system maintenance.",
    description:
      "Unlock the full acoustic potential of your audio system. VIVA offers precision gain staging, active/passive crossover tuning, equalizer and DSP calibration, acoustic damping upgrades, and preventative maintenance to keep your sound clean, dynamic, and reliable over the long haul.",
    applicableEnvironments: [
      "Vehicle Audio Systems",
      "Home Cinema Rooms",
      "Commercial Sound Racks",
    ],
    matchingProjectCategories: [
      "Vehicles",
      "Home & Theatre",
      "Custom Work",
      "Repair & Restoration",
    ],
    ctaLabel: "Discuss Tuning & Upgrades",
    ctaMessage: "Hi VIVA team, I would like to tune or upgrade my current audio system.",
    order: 6,
  },
]

export function getAllServices(): Service[] {
  return SERVICES
}

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function getServicesByEnvironment(environment: string): Service[] {
  const query = environment.toLowerCase()
  return SERVICES.filter((s) =>
    s.applicableEnvironments.some((env) => env.toLowerCase().includes(query))
  )
}

export function getServicesByProjectCategory(category: ProjectCategory): Service[] {
  return SERVICES.filter((s) => s.matchingProjectCategories?.includes(category))
}
