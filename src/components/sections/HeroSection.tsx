import { Link } from "react-router-dom"
import {
  ArrowRightIcon,
  PhoneIcon,
  MessageCircleIcon,
  WrenchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BUSINESS_CONFIG } from "@/config/business"

export function HeroSection() {
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    BUSINESS_CONFIG.contact.whatsapp.defaultMessage
  )}`

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background to-secondary/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_70%_20%,var(--accent),transparent)] opacity-60"
      />
      <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
        {/* Left narrative & value proposition */}
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <Badge variant="outline" className="gap-2 rounded-full px-3.5 py-1 text-xs font-medium border-primary/30 bg-primary/5">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            Audio Solutions &amp; Installations · Kottakkal, Kerala
          </Badge>

          <h1
            id="hero-heading"
            className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground"
          >
            Tell us what you want to achieve. We design the system and make it work.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Custom car audio, high-output bus systems, home theatres, café soundscapes, and component-level repairs. Designed, installed, and tuned directly by one specialist in Kottakkal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              className="gap-2 shadow-xs"
              render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <MessageCircleIcon className="size-4" />
              Discuss on WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link to="/services" />}
            >
              Explore Capabilities
              <ArrowRightIcon className="size-4" data-icon="inline-end" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-muted-foreground border-t w-full">
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-3.5 text-primary" />
              <span>Call: <strong className="font-semibold text-foreground">{BUSINESS_CONFIG.contact.phone.display}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              <span>{BUSINESS_CONFIG.hours.summary}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              <span>Kottakkal, Malappuram</span>
            </div>
          </div>
        </div>

        {/* Right interactive / snapshot card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl border bg-card/90 p-6 sm:p-8 shadow-xs backdrop-blur-xs">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  The VIVA Approach
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Expert Execution</span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3.5 rounded-xl border bg-background/60 p-3.5 transition-colors hover:bg-background">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SparklesIcon className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Acoustic Space Analysis</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    Engineered to your specific cabin or room geometry, reflection points, and budget.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border bg-background/60 p-3.5 transition-colors hover:bg-background">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WrenchIcon className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Clean Integration &amp; Damping</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    OFC power cabling, solid grounding, fuse protection, and butyl rattle suppression.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border bg-background/60 p-3.5 transition-colors hover:bg-background">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SlidersHorizontalIcon className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Precision Ear Tuning</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    Crossover setting, time alignment, and gain calibration for balanced sound.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border bg-background/60 p-3.5 transition-colors hover:bg-background">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Single-Expert Accountability</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    Direct communication with the specialist doing the hands-on work. No middleman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
