import {
  ShieldCheckIcon,
  WrenchIcon,
  SlidersIcon,
  PhoneCallIcon,
  MapPinIcon,
} from "lucide-react"
import { BUSINESS_CONFIG } from "@/config/business"

const TRUST_PILLARS = [
  {
    icon: WrenchIcon,
    title: "One-Expert Craftsmanship",
    description:
      "Every project—from vehicle door speaker fitment to commercial multi-zone audio—is personally scoped, wired, and tuned by one dedicated audio specialist in Kottakkal. No junior subcontractors.",
  },
  {
    icon: SlidersIcon,
    title: "Acoustic-First Engineering",
    description:
      "We do not sell pre-boxed generic packages. Every recommendation is tailored to the acoustic reflection, damping, and volume demands of your specific room or vehicle cabin.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Iterative, Transparent Proposals",
    description:
      "Quotations are structured proposals where components can be customized or swapped to match your budget. We explain where premium gear makes an audible difference and where standard hardware is sufficient.",
  },
  {
    icon: PhoneCallIcon,
    title: "Direct Ongoing Support",
    description:
      "Audio systems are an ongoing investment. VIVA remains directly available for equalizer re-tuning, system upgrades, warranty facilitation, and bench electronics repairs.",
  },
]

export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="border-b py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col items-start gap-4 lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Why Choose VIVA
            </p>
            <h2
              id="trust-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Direct specialist accountability on every project.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Anyone can order audio hardware online, but making components perform together harmoniously in a real vehicle or room requires field experience, proper wiring, and precision tuning.
            </p>

            <div className="mt-4 rounded-xl border bg-secondary/40 p-4 w-full">
              <div className="flex items-start gap-3">
                <MapPinIcon className="size-4 text-primary mt-0.5 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Workshop Location</p>
                  <p className="text-muted-foreground">{BUSINESS_CONFIG.contact.address.full}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{BUSINESS_CONFIG.hours.summary}</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground/70">
              {BUSINESS_CONFIG.legalNotice}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {TRUST_PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-2xs"
                >
                  <div>
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-3.5 text-sm font-semibold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
