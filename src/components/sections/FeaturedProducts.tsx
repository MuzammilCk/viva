import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/catalog/ProductCard"
import { getFeaturedProducts } from "@/data/products"

export function FeaturedProducts() {
  const products = getFeaturedProducts()

  return (
    <section aria-labelledby="featured-heading" className="border-b">
      <div className="container-page py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4 pb-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Hand-picked this month
            </p>
            <h2 id="featured-heading" className="font-display pt-1 text-3xl tracking-tight sm:text-4xl">
              Featured gear
            </h2>
          </div>
          <Button variant="outline" size="sm" render={<Link to="/products" />}>
            All products
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
