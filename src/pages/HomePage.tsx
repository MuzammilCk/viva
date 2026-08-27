import { HeroSection } from "@/components/sections/HeroSection"
import { WhatWeSolveSection } from "@/components/sections/WhatWeSolveSection"
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection"
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection"
import { EnvironmentsSection } from "@/components/sections/EnvironmentsSection"
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection"
import { TrustSection } from "@/components/sections/TrustSection"
import { ClosingCtaSection } from "@/components/sections/ClosingCtaSection"

/**
 * HomePage for VIVA Business Team
 *
 * Implements the 8-block sequence from docs/planning/04-viva-website-architecture.md §1:
 * 1. Brand statement / value proposition (Hero)
 * 2. What VIVA solves (Entry modes A–E as scannable outcomes)
 * 3. Featured work (Curated projects without visible count)
 * 4. Capabilities (Six service categories)
 * 5. Environments served (Vehicles and non-vehicle spaces)
 * 6. Selected products (Curated hardware with real pricing / contact for price)
 * 7. Trust/expertise signals (Qualitative range + single-technician execution)
 * 8. Direct Call/WhatsApp CTA (Closing conversion action)
 */
export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Block 1: Brand statement / Value proposition */}
      <HeroSection />

      {/* Block 2: What VIVA solves */}
      <WhatWeSolveSection />

      {/* Block 3: Featured work */}
      <FeaturedWorkSection />

      {/* Block 4: Capabilities / Service categories */}
      <CapabilitiesSection />

      {/* Block 5: Environments served */}
      <EnvironmentsSection />

      {/* Block 6: Selected products */}
      <FeaturedProductsSection />

      {/* Block 7: Trust / Expertise signals */}
      <TrustSection />

      {/* Block 8: Direct Call/WhatsApp CTA */}
      <ClosingCtaSection />
    </div>
  )
}
