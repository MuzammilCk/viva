import { HeroSection, ValueProps } from "@/components/sections/HeroSection"
import { CategoriesSection } from "@/components/sections/CategoriesSection"
import { FeaturedProducts } from "@/components/sections/FeaturedProducts"
import { AboutPreview } from "@/components/sections/AboutPreview"
import { NewsletterSection } from "@/components/sections/NewsletterSection"

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueProps />
      <FeaturedProducts />
      <CategoriesSection />
      <AboutPreview />
      <NewsletterSection />
    </>
  )
}
