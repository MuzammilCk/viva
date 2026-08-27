/**
 * VIVA Business Team — Core Type Definitions
 *
 * Content entities and shared data contracts for the VIVA website.
 * Grounded in: docs/planning/04-viva-website-architecture.md
 */

// ============================================================================
// 1. Business Configuration Entity (Single source of truth)
// ============================================================================

export interface BusinessPhone {
  readonly number: string
  readonly display: string
  readonly tel: string
}

export interface BusinessWhatsApp {
  readonly number: string
  readonly display: string
  readonly url: string
  readonly defaultMessage: string
}

export interface BusinessAddress {
  readonly town: string
  readonly district: string
  readonly state: string
  readonly pincode: string
  readonly full: string
}

export interface BusinessHours {
  readonly days: string
  readonly summary: string
  /** Exact open time (e.g. "09:00") — null until confirmed per 03-viva-business-context.md */
  readonly openTime: string | null
  /** Exact close time (e.g. "21:00") — null until confirmed per 03-viva-business-context.md */
  readonly closeTime: string | null
  readonly isConfirmed: boolean
}

export interface SocialLinks {
  /** Instagram link — null until account is created */
  readonly instagram: string | null
  /** Facebook link — null until account is created */
  readonly facebook: string | null
  /** YouTube link — null until account is created */
  readonly youtube: string | null
}

export interface GoogleBusinessProfile {
  /** GBP link — null until profile is set up */
  readonly url: string | null
  readonly isConfirmed: boolean
}

export interface BrandTokens {
  /** Confirmed hex code — null (general direction is Blue, hex unconfirmed) */
  readonly primaryColorHex: string | null
  /** Provisional CSS color token used until hex is finalized */
  readonly provisionalColorName: "blue"
  /** Logo asset path — null until logo is designed */
  readonly logoUrl: string | null
  /** Typography choice — null until decided */
  readonly typeface: string | null
}

export interface BusinessConfig {
  /** Public-facing brand name used across all pages, headings, and CTAs */
  readonly name: string
  /** Registered legal/trade name — appears ONLY in legal/footer fine print and structured data */
  readonly legalName: string
  readonly legalNotice: string
  readonly tagline: string
  readonly description: string
  readonly domain: string | null
  readonly email: string | null
  readonly contact: {
    readonly phone: BusinessPhone
    readonly whatsapp: BusinessWhatsApp
    readonly address: BusinessAddress
  }
  readonly hours: BusinessHours
  readonly social: SocialLinks
  readonly googleBusinessProfile: GoogleBusinessProfile
  readonly brand: BrandTokens
}

/** Alias for backward compatibility / architecture alignment */
export type SiteConfig = BusinessConfig

// ============================================================================
// 2. Project Entity
// ============================================================================

export type ProjectCategory =
  | "Vehicles"
  | "Home & Theatre"
  | "Cafés & Restaurants"
  | "Commercial & Business"
  | "Custom Work"
  | "Repair & Restoration"
  | "Other"

export interface ProjectMedia {
  id?: string
  url: string
  type: "image" | "video"
  alt?: string
  caption?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  category: ProjectCategory | string
  environmentTags: string[]
  summary: string
  requirement?: string
  solution?: string
  componentsUsed?: string[]
  media: ProjectMedia[]
  coverImage?: string
  relatedProductIds?: string[]
  featured: boolean
  order: number
}

// ============================================================================
// 3. Service Entity
// ============================================================================

export interface Service {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  applicableEnvironments: string[]
  relatedProjectIds?: string[]
  ctaLabel?: string
  ctaMessage?: string
  order: number
}

// ============================================================================
// 4. Product Entity (Redefined — catalog only, no cart/stock/variants)
// ============================================================================

export type ProductCategory =
  | "Speakers"
  | "Amplifiers"
  | "Subwoofers"
  | "Tweeters"
  | "Microphones"
  | "Wiring & Accessories"
  | "Other Components"

export interface ProductSpecification {
  category?: string
  name: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  model: string
  category: ProductCategory | string
  /** Genuine price in INR, or null for "Contact for price" */
  price: number | null
  description?: string
  specs: ProductSpecification[]
  useCases: string[]
  images: string[]
  relatedProjectIds?: string[]
  featured: boolean
}

// ============================================================================
// 5. Navigation & Analytics
// ============================================================================

export type NavChild = {
  label: string
  href: string
  description?: string
}

export type NavItem = {
  label: string
  href: string
  children?: NavChild[]
}

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
  timestamp?: string
}
