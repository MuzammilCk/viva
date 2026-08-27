/**
 * VIVA Business Team — Structured Data / Schema.org
 *
 * LocalBusiness JSON-LD schema generation strictly sourced from BUSINESS_CONFIG.
 * Includes legal name "RIMS" as alternateName for NAP (Name, Address, Phone) consistency.
 *
 * Sourced from Phase 11 of docs/planning/06-viva-refactor-blueprint.md.
 */

import { BUSINESS_CONFIG } from "@/config/business"

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS_CONFIG.name,
    alternateName: BUSINESS_CONFIG.legalName,
    description: BUSINESS_CONFIG.description,
    telephone: BUSINESS_CONFIG.contact.phone.number,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_CONFIG.contact.address.full,
      addressLocality: BUSINESS_CONFIG.contact.address.town,
      addressRegion: BUSINESS_CONFIG.contact.address.district,
      postalCode: BUSINESS_CONFIG.contact.address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "10.9984", // Kottakkal coordinates
      longitude: "75.9996",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Kottakkal",
      },
      {
        "@type": "AdministrativeArea",
        name: "Malappuram",
      },
      {
        "@type": "State",
        name: "Kerala",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        description: BUSINESS_CONFIG.hours.summary,
      },
    ],
    priceRange: "$$",
  }
}
