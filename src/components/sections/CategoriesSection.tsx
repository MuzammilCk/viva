import { Link } from "react-router-dom"
import {
  ArrowUpRightIcon,
  SpeakerIcon,
  SlidersIcon,
  Volume2Icon,
  RadioIcon,
  MicIcon,
  CableIcon,
  LayersIcon,
} from "lucide-react"
import { getCategorySummaries } from "@/data/products"
import type { ProductCategory } from "@/types"

function getCategoryIcon(category: ProductCategory | string) {
  switch (category) {
    case "Speakers":
      return <SpeakerIcon className="size-8 stroke-[1.5] text-primary" />
    case "Amplifiers":
      return <SlidersIcon className="size-8 stroke-[1.5] text-primary" />
    case "Woofers/Subwoofers":
      return <Volume2Icon className="size-8 stroke-[1.5] text-primary" />
    case "Tweeters":
      return <RadioIcon className="size-8 stroke-[1.5] text-primary" />
    case "Microphones":
      return <MicIcon className="size-8 stroke-[1.5] text-primary" />
    case "Wiring & Accessories":
      return <CableIcon className="size-8 stroke-[1.5] text-primary" />
    default:
      return <LayersIcon className="size-8 stroke-[1.5] text-primary" />
  }
}

export function CategoriesSection() {
  const summaries = getCategorySummaries()

  return (
    <section aria-labelledby="categories-heading" className="border-b bg-secondary/40">
      <div className="container-page py-16 sm:py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Equipment Catalog
        </p>
        <h2 id="categories-heading" className="font-display pt-1 pb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
          Browse by audio category
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {summaries.map(({ category, count }) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-ring/40 hover:shadow-xs"
            >
              <div className="aspect-[5/4] border-b bg-gradient-to-b from-muted/30 to-muted/10 p-6 flex flex-col items-center justify-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-background/90 shadow-2xs transition-transform duration-300 group-hover:scale-110">
                  {getCategoryIcon(category)}
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium leading-tight text-foreground">{category}</p>
                  <p className="tnum mt-0.5 text-xs text-muted-foreground">{count} items</p>
                </div>
                <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
