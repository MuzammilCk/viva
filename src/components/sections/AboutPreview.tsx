import { Link } from "react-router-dom"
import { ArrowRightIcon, MapPinIcon, CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUSINESS_CONFIG } from "@/config/business"

export function AboutPreview() {
  return (
    <section aria-labelledby="about-heading" className="border-b">
      <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col items-start gap-5">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Our Philosophy
          </p>
          <h2 id="about-heading" className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
            Tell us your audio goal. We handle the design, wiring, and tuning.
          </h2>
          <Button variant="outline" render={<Link to="/products" />}>
            Explore equipment
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        <div className="flex flex-col gap-6 border-l pl-8">
          <p className="font-display text-xl italic leading-relaxed text-muted-foreground sm:text-2xl">
            &ldquo;We don&apos;t just sell boxes. Every installation—from a custom car subwoofer box to complete architectural audio—is measured, wired, and tuned with hands-on precision in Kottakkal.&rdquo;
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 text-primary">
                <MapPinIcon className="size-4" />
                <p className="font-semibold text-sm text-foreground">Local Kottakkal Workshop</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {BUSINESS_CONFIG.contact.address.full}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2Icon className="size-4" />
                <p className="font-semibold text-sm text-foreground">Hands-on Execution</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Direct specialist diagnosis, custom tuning, and component-level repair.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
