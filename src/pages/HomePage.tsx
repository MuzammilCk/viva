import { Suspense } from "react"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturedProducts } from "@/components/sections/FeaturedProducts"
import { CategoriesSection } from "@/components/sections/CategoriesSection"
import { NewsletterSection } from "@/components/sections/NewsletterSection"
import { AboutPreview } from "@/components/sections/AboutPreview"
import { PageSkeleton } from "@/components/ui/PageSkeleton"

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<PageSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <CategoriesSection />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <AboutPreview />
      </Suspense>
      <NewsletterSection />
    </div>
  )
}