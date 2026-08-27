import { Link } from "react-router-dom"
import {
  ArrowRightIcon,
  SparklesIcon,
  ShoppingBagIcon,
  WrenchIcon,
  ActivityIcon,
  LayersIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SERVICES } from "@/data/services"
import type { Service } from "@/types"

function getServiceIcon(slug: string) {
  switch (slug) {
    case "complete-audio-solutions":
      return <SparklesIcon className="size-5 text-primary" />
    case "product-recommendation-supply":
      return <ShoppingBagIcon className="size-5 text-primary" />
    case "installation-integration":
      return <WrenchIcon className="size-5 text-primary" />
    case "repair-diagnosis":
      return <ActivityIcon className="size-5 text-primary" />
    case "custom-solutions":
      return <LayersIcon className="size-5 text-primary" />
    case "tuning-upgrades-maintenance":
      return <SlidersHorizontalIcon className="size-5 text-primary" />
    default:
      return <SparklesIcon className="size-5 text-primary" />
  }
}

export function CapabilitiesSection() {
  return (
    <section aria-labelledby="capabilities-heading" className="border-b bg-secondary/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Core Capabilities
            </p>
            <h2
              id="capabilities-heading"
              className="font-display mt-1.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Six specialized services under one roof.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              From fresh architectural layouts to fine electronic tuning and bench repairs, every service is personally delivered by our Kottakkal workshop.
            </p>
          </div>

          <Button variant="outline" size="sm" render={<Link to="/services" />}>
            View All Details
            <ArrowRightIcon className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service: Service) => {
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-2xs transition-all hover:border-ring/40 hover:shadow-xs"
              >
                <div>
                  <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
                    {getServiceIcon(service.slug)}
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>

                  {service.applicableEnvironments && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {service.applicableEnvironments.slice(0, 3).map((env) => (
                        <span
                          key={env}
                          className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {env}
                        </span>
                      ))}
                      {service.applicableEnvironments.length > 3 && (
                        <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          +{service.applicableEnvironments.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t">
                  <Link
                    to={`/services#${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    View service details
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
