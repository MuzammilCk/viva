/**
 * VIVA Business Team — Business Identity & Configuration
 *
 * Single source of truth for all business identity, contact information,
 * and operational details. All components and pages MUST import from here;
 * no identity data should be hardcoded elsewhere in the codebase.
 *
 * Grounded in: docs/planning/03-viva-business-context.md
 */

import type {
  BrandTokens,
  BusinessAddress,
  BusinessConfig,
  BusinessHours,
  BusinessPhone,
  BusinessWhatsApp,
  GoogleBusinessProfile,
  SocialLinks,
} from "@/types"

export type {
  BrandTokens,
  BusinessAddress,
  BusinessConfig,
  BusinessHours,
  BusinessPhone,
  BusinessWhatsApp,
  GoogleBusinessProfile,
  SocialLinks,
}

export const BUSINESS_CONFIG: BusinessConfig = {
  // Identity
  name: "VIVA Business Team",
  legalName: "RIMS",
  legalNotice: "VIVA Business Team is operated under the registered trade name RIMS.",
  tagline: "Audio Solutions for Vehicles, Home Theatres & Commercial Spaces",
  description:
    "Expert audio design, installation, tuning, and repair services in Kottakkal, Malappuram, Kerala.",

  // Domain & Email (TBD — not yet registered / confirmed)
  domain: null, // TBD: Domain not yet registered
  email: null, // TBD: No public email address confirmed in 03-viva-business-context.md

  // Contact Details
  // Note: Phone and WhatsApp use TWO DIFFERENT NUMBERS. Never merge or assume one dials the other.
  contact: {
    phone: {
      number: "9633334786",
      display: "+91 96333 34786",
      tel: "tel:+919633334786",
    },
    whatsapp: {
      number: "9995880059",
      display: "+91 99958 80059",
      url: "https://wa.me/919995880059",
      defaultMessage: "Hi VIVA team, I would like to enquire about audio solutions.",
    },
    address: {
      town: "Kottakkal",
      district: "Malappuram",
      state: "Kerala",
      pincode: "676501",
      full: "Kottakkal, Malappuram district, Kerala — 676501",
    },
  },

  // Operating Schedule
  hours: {
    days: "7 days a week",
    summary: "Open daily (12x7 schedule)",
    openTime: null, // TBD: Exact opening time unconfirmed per business-context.md §8
    closeTime: null, // TBD: Exact closing time unconfirmed per business-context.md §8
    isConfirmed: false,
  },

  // Social Channels (TBD — not yet created / no content)
  social: {
    instagram: null, // TBD: Account not yet created
    facebook: null, // TBD: Account not yet created
    youtube: null, // TBD: Account not yet created
  },

  // Local Search / GBP (TBD — not yet set up)
  googleBusinessProfile: {
    url: null, // TBD: Google Business Profile needs to be created from scratch
    isConfirmed: false,
  },

  // Brand Assets (Provisional — see 05-viva-ui-ux-direction.md)
  brand: {
    primaryColorHex: null, // TBD: Blue general direction, hex unconfirmed
    provisionalColorName: "blue",
    logoUrl: null, // TBD: Logo not designed yet
    typeface: null, // TBD: Typeface not decided
  },
} as const

export default BUSINESS_CONFIG
