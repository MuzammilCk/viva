import { Link } from "react-router-dom"
import { ArrowRightIcon, ShieldCheckIcon, StarIcon, TruckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductArt } from "@/components/catalog/ProductArt"
import { formatPrice } from "@/lib/format"
import { getFeaturedProducts } from "@/data/products"

export function HeroSection() {
  const heroProduct = getFeaturedProducts()[0]

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_75%_20%,var(--accent),transparent)] opacity-70"
      />
      <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
            <StarIcon className="size-3 fill-warning text-warning" />
            Rated 4.7/5 by 2,300+ musicians
          </Badge>
          <h1 id="hero-heading" className="font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Gear that gets your ideas out of your head.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Synthesizers, MIDI controllers, interfaces and modular systems — hand-picked,
            bench-tested and backed by people who actually make music.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link to="/products" />}>
              Shop all products
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/products?category=Eurorack%20Modular" />}>
              Explore modular
            </Button>
          </div>
          <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-4 pt-2">
            {[
              ["30-day", "no-questions returns"],
              ["$150+", "free standard shipping"],
              ["2-year", "warranty included"],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="sr-only">{label}</dt>
                <dd className="tnum text-lg font-semibold">{value}</dd>
                <dd className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {heroProduct && (
          <Link
            to={`/products/${heroProduct.slug}`}
            className="group relative block rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
              <Badge>{heroProduct.badge ?? "Featured"}</Badge>
            </div>
            <div className="aspect-[4/3] rounded-lg bg-gradient-to-b from-muted/50 to-muted p-6 transition-transform duration-500 group-hover:scale-[1.02]">
              <ProductArt kind={heroProduct.artKind} finish={heroProduct.finishes[0]} label={heroProduct.name} />
            </div>
            <div className="flex items-end justify-between pt-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {heroProduct.brand}
                </p>
                <p className="pt-0.5 font-medium">{heroProduct.name}</p>
              </div>
              <p className="tnum font-semibold">{formatPrice(heroProduct.salePrice ?? heroProduct.price)}</p>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}

export function ValueProps() {
  const props = [
    {
      icon: TruckIcon,
      title: "Fast, free shipping",
      description: "Free standard shipping over $150, dispatched same day before 3pm.",
    },
    {
      icon: ShieldCheckIcon,
      title: "2-year warranty",
      description: "Every product covered as standard, with hassle-free replacements.",
    },
    {
      icon: StarIcon,
      title: "Expert advice",
      description: "Questions before you buy? Our team of producers replies within hours.",
    },
  ]

  return (
    <section aria-label="Why shop with SynthLab" className="border-b bg-secondary/40">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        {props.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="rounded-full border bg-background p-2.5">
              <Icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
