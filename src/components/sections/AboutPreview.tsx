import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutPreview() {
  return (
    <section aria-labelledby="about-heading" className="border-b">
      <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col items-start gap-5">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Our story
          </p>
          <h2 id="about-heading" className="font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
            Built by musicians, for musicians.
          </h2>
          <Button variant="outline" render={<Link to="/products" />}>
            Meet the gear
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>

        <div className="flex flex-col gap-6 border-l pl-8">
          <p className="font-display text-xl italic leading-relaxed text-muted-foreground sm:text-2xl">
            &ldquo;We started SynthLab in a rehearsal space, selling repaired synths out of a
            single rack. Ten years later we stock the brands we trust — and we still test every
            unit before it ships.&rdquo;
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["10 yrs", "in business"],
              ["12k+", "orders shipped"],
              ["48h", "support response"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border bg-card p-4">
                <p className="tnum text-2xl font-semibold">{value}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
