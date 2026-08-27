import { Link } from "react-router-dom"
import {
  SparklesIcon,
  HeadphonesIcon,
  WrenchIcon,
  ActivityIcon,
  LayersIcon,
  ArrowRightIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const ENTRY_MODES = [
  {
    icon: SparklesIcon,
    tag: "Mode A: Complete Solution",
    title: "Complete Audio Engineering",
    description:
      "You have an empty vehicle cabin, home room, or commercial space. We evaluate the acoustic structure, select matching components, and deliver a turn-key solution.",
    href: "/services#complete-audio-solutions",
  },
  {
    icon: HeadphonesIcon,
    tag: "Mode B: Guided Recommendation",
    title: "Product Recommendation & Sourcing",
    description:
      "You know the sound outcome you want (tighter bass, clearer vocals, louder stage). We recommend compatible components, demonstrate options, and source genuine hardware.",
    href: "/services#product-recommendation-supply",
  },
  {
    icon: WrenchIcon,
    tag: "Mode C: Precision Installation",
    title: "Installation, Damping & Fitment",
    description:
      "You already bought components or have existing equipment. We provide clean wiring, custom mounting baffles, butyl acoustic damping, and factory-finish integration.",
    href: "/services#installation-integration",
  },
  {
    icon: ActivityIcon,
    tag: "Mode D: Systematic Diagnosis",
    title: "Repair & Electronics Diagnosis",
    description:
      "System cutting out, distortion, channel imbalance, or amplifier protection mode? We systematically test power supplies, wiring, and circuit components on the bench.",
    href: "/services#repair-diagnosis",
  },
  {
    icon: LayersIcon,
    tag: "Mode E: Custom Fabrication",
    title: "Custom Builds & Acoustic Fabrication",
    description:
      "When standard off-the-shelf enclosures don't fit your vehicle geometry or aesthetic needs, we fabricate custom sealed/ported fiberglass and wood enclosures.",
    href: "/services#custom-solutions",
  },
]

export function WhatWeSolveSection() {
  return (
    <section aria-labelledby="what-we-solve-heading" className="border-b bg-secondary/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            What VIVA Solves
          </p>
          <h2
            id="what-we-solve-heading"
            className="font-display mt-1.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Every requirement starts with an outcome, not a SKU.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Whether you arrive with a clear component list or simply know the sound you want to achieve, we meet you at your exact stage of planning.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRY_MODES.map((mode, index) => {
            const Icon = mode.icon
            return (
              <div
                key={mode.title}
                className={`group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-2xs transition-all hover:border-ring/40 hover:shadow-xs ${
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground/80">
                      {mode.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {mode.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    to={mode.href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Learn about this approach
                    <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
