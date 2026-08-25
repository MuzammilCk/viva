import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Award, Users, Music, Zap, Truck } from "lucide-react"

const stats = [
  { value: "15K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Products Curated", icon: Music },
  { value: "99%", label: "Satisfaction Rate", icon: Award },
  { value: "24h", label: "Fast Shipping", icon: Truck },
]

const features = [
  {
    icon: Zap,
    title: "Expert Curation",
    desc: "Every instrument is tested and approved by working musicians before it hits our shelves.",
  },
  {
    icon: Music,
    title: "Pro Audio Focus",
    desc: "We specialize in professional-grade gear for studio, stage, and sound design.",
  },
  {
    icon: Award,
    title: "Lifetime Support",
    desc: "Free firmware updates, setup assistance, and repair coordination for the life of your gear.",
  },
]

export function AboutPreview() {
  const navigate = useNavigate()
  return (
    <section className="py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="container">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 lg:p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-[var(--color-accent-cyan)]/10">
                <stat.icon className="w-7 h-7 text-[var(--color-accent-cyan)]" />
              </div>
              <div className="font-display font-bold text-4xl lg:text-5xl text-[var(--color-fg-primary)] mb-1">
                {stat.value}
              </div>
              <div className="text-[var(--color-fg-secondary)] text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)] px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              <span>Why SynthLab?</span>
            </div>

            <h2 id="about-heading" className="font-display font-bold text-4xl lg:text-5xl text-[var(--color-fg-primary)] mb-6">
              Built by musicians, for musicians
            </h2>

            <p className="text-[var(--color-fg-secondary)] text-lg mb-6 leading-relaxed">
              We started SynthLab because we couldn't find a shop that truly understood
              the needs of electronic musicians. No marketing fluff, no upsells — just
              honest recommendations, fair prices, and gear that inspires.
            </p>

            <p className="text-[var(--color-fg-secondary)] mb-8">
              Every piece of equipment we sell has been played, patched, and pushed to
              its limits by our team. We know the difference between spec sheets and
              real-world performance.
            </p>

            <Link to="/about" className="inline-flex items-center gap-2 text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-amber)] font-medium transition-colors">
              Our Story
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid gap-6">
            {features.map((feature, i) => (
              <Card key={i} variant="outlined" className="p-6">
                <CardContent className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--color-accent-cyan)]/10">
                    <feature.icon className="w-6 h-6 text-[var(--color-accent-cyan)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-fg-primary)] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--color-fg-secondary)] text-sm">
                      {feature.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate("/contact")}
            className="gap-2"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="mt-4 text-[var(--color-fg-secondary)]">
            Have questions? Our team of synth experts is here to help.
          </p>
        </div>
      </div>
    </section>
  )
}