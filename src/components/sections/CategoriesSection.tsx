import { Link } from "react-router-dom"
import { ArrowUpRightIcon } from "lucide-react"
import { ProductArt } from "@/components/catalog/ProductArt"
import { getAllProducts, getCategorySummaries } from "@/data/products"
import type { ProductArtKind, ProductCategory } from "@/types"

const CATEGORY_ART: Record<ProductCategory, { kind: ProductArtKind; finishId: string }> = {
  Synthesizers: { kind: "synthesizer", finishId: "graphite" },
  Controllers: { kind: "controller", finishId: "black" },
  "Audio Interfaces": { kind: "interface", finishId: "silver" },
  "Eurorack Modular": { kind: "modular", finishId: "indigo" },
  Accessories: { kind: "accessory", finishId: "amber" },
}

export function CategoriesSection() {
  const summaries = getCategorySummaries()
  const allProducts = getAllProducts()

  return (
    <section aria-labelledby="categories-heading" className="border-b bg-secondary/40">
      <div className="container-page py-16 sm:py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Find your instrument
        </p>
        <h2 id="categories-heading" className="font-display pt-1 pb-10 text-3xl tracking-tight sm:text-4xl">
          Shop by category
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {summaries.map(({ category, count }) => {
            const art = CATEGORY_ART[category]
            const finish =
              allProducts.find((p) => p.category === category)?.finishes.find(
                (f) => f.id === art.finishId
              ) ?? allProducts.find((p) => p.category === category)?.finishes[0]
            return (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md"
              >
                <div className="aspect-[5/4] border-b bg-gradient-to-b from-transparent to-muted/60 p-4">
                  {finish && <ProductArt kind={art.kind} finish={finish} />}
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium leading-tight">{category}</p>
                    <p className="tnum text-xs text-muted-foreground">{count} products</p>
                  </div>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
