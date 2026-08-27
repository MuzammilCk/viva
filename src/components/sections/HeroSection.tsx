import { Link } from "react-router-dom"
import { ArrowRightIcon, WrenchIcon, SparklesIcon, ShieldCheckIcon, PhoneIcon, MessageCircleIcon, PackageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatProductPrice } from "@/lib/format"
import { getFeaturedProducts } from "@/data/products"
import { BUSINESS_CONFIG } from "@/config/business"

export function HeroSection() {
  const heroProduct = getFeaturedProducts()[0]
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    BUSINESS_CONFIG.contact.whatsapp.defaultMessage
  )}`

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_75%_20%,var(--accent),transparent)] opacity-70"
      />
      <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 text-xs">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            Audio Solutions &amp; Installations · Kottakkal
          </Badge>
          <h1
            id="hero-heading"
            className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Sound engineered for every journey and space.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {BUSINESS_CONFIG.tagline} Custom car audio, home theatres, commercial sound systems, and component repairs executed directly by specialists in Kottakkal.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}>
              <MessageCircleIcon className="size-4" data-icon="inline-start" />
              Discuss on WhatsApp
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/products" />}>
              Browse Equipment
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-3.5 text-primary" />
              <span>Call: {BUSINESS_CONFIG.contact.phone.display}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{BUSINESS_CONFIG.hours.summary}</span>
            </div>
          </div>
        </div>

        {heroProduct && (
          <Link
            to={`/products/${heroProduct.slug}`}
            className="group relative block rounded-xl border bg-card p-8 shadow-xs transition-all hover:border-ring/40 hover:shadow-md"
          >
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
              <Badge>Featured Equipment</Badge>
            </div>
            <div className="aspect-[4/3] rounded-lg bg-gradient-to-b from-muted/50 to-muted p-6 transition-transform duration-500 group-hover:scale-[1.02]">
              {heroProduct.images && heroProduct.images.length > 0 ? (
                <img
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center select-none">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-2xs">
                    <PackageIcon className="size-6 stroke-[1.5]" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {heroProduct.category}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-end justify-between pt-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {heroProduct.brand} · {heroProduct.category}
                </p>
                <p className="pt-0.5 font-medium">{heroProduct.name}</p>
              </div>
              <p className="tnum font-semibold text-foreground">
                {formatProductPrice(heroProduct.price)}
              </p>
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
      icon: SparklesIcon,
      title: "Custom Acoustic Design",
      description: "Tailored component matching and tuning for vehicle cabins, living spaces, and venues.",
    },
    {
      icon: WrenchIcon,
      title: "Expert Installation & Repair",
      description: "Precision wiring, damping, amplifier tuning, and component-level electronics servicing.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Direct Specialist Support",
      description: "Direct guidance and support from experienced technicians in Kottakkal without intermediaries.",
    },
  ]

  return (
    <section aria-label="Why choose VIVA Business Team" className="border-b bg-secondary/40">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        {props.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="rounded-full border bg-background p-2.5 shadow-2xs">
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
