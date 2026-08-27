import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/catalog/ProductCard"
import { getFeaturedProducts } from "@/data/products"

export function FeaturedProductsSection() {
  const products = getFeaturedProducts().slice(0, 3)

  return (
    <section aria-labelledby="featured-products-heading" className="border-b bg-secondary/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end pb-10">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Selected Equipment
            </p>
            <h2
              id="featured-products-heading"
              className="font-display mt-1.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Components we supply, install &amp; recommend.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A curated selection of genuine speakers, amplifiers, subwoofers, and wiring hardware backed by hands-on installation support in Kottakkal.
            </p>
          </div>

          <Button variant="outline" size="sm" render={<Link to="/products" />}>
            View Entire Catalog
            <ArrowRightIcon className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
