import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Link } from "react-router-dom"
import { ArrowRight, Zap, Music, Settings, Box } from "lucide-react"

// Two-stop accent gradient per category, built from real CSS variables —
// never magic hex, never template-string munging (the prior code's
// .replace("from-","") produced malformed linear-gradient() that silently failed).
const categories = [
  {
    id: "synthesizers",
    name: "Synthesizers",
    description: "Analog, digital, and hybrid synthesizers",
    count: 42,
    icon: Music,
    badge: "Featured",
    gradient: "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-emerald))",
    glow: "var(--shadow-glow-cyan)",
    href: "/products?category=synthesizers",
  },
  {
    id: "controllers",
    name: "Controllers",
    description: "MIDI keyboards, pad controllers, DAW controllers",
    count: 28,
    icon: Settings,
    badge: null,
    gradient: "linear-gradient(135deg, var(--color-accent-amber), var(--color-accent-coral))",
    glow: "var(--shadow-glow-amber)",
    href: "/products?category=controllers",
  },
  {
    id: "interfaces",
    name: "Audio Interfaces",
    description: "Thunderbolt, USB, PCIe interfaces",
    count: 18,
    icon: Zap,
    badge: null,
    gradient: "linear-gradient(135deg, var(--color-accent-coral), var(--color-accent-violet))",
    glow: "var(--shadow-glow-coral)",
    href: "/products?category=interfaces",
  },
  {
    id: "modular",
    name: "Modular / Eurorack",
    description: "Cases, modules, cables, power",
    count: 35,
    icon: Box,
    badge: "New",
    gradient: "linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))",
    glow: "var(--shadow-glow-violet)",
    href: "/products?category=modular",
  },
] as const

export function CategoriesSection() {
  return (
    <section
      className="py-20 lg:py-28 relative"
      aria-labelledby="categories-heading"
    >
      <div className="container">
        {/* Section header with eyebrow */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[var(--color-accent-violet)] tracking-[0.2em] text-xs font-medium uppercase mb-3 block">
            The Collection
          </span>
          <h2
            id="categories-heading"
            className="font-display font-bold text-4xl lg:text-5xl text-[var(--color-fg-primary)] mb-4 tracking-tight"
          >
            Shop by Category
          </h2>
          <p className="text-lg text-[var(--color-fg-secondary)] leading-relaxed">
            Explore our curated selection of professional music electronics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-amber)] font-medium transition-colors"
          >
            View All Categories
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  const Icon = category.icon

  return (
    <Link to={category.href} className="block focus-visible:outline-none">
      {/* Card is the link — the whole surface is one navigable affordance,
          so no nested <Button> interaction (that was invalid HTML / dead before). */}
      <Card variant="interactive" className="group h-full overflow-hidden relative">
        {/* Gradient wash background */}
        <div
          className="absolute inset-0 opacity-15 transition-opacity duration-500 group-hover:opacity-30"
          style={{ background: category.gradient }}
          aria-hidden="true"
        />

        <CardContent className="relative p-8 flex flex-col h-full">
          {/* Icon tile with per-category glow */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
            style={{
              background: category.gradient,
              boxShadow: category.glow,
            }}
          >
            <Icon className="w-8 h-8 text-[var(--color-fg-inverse)]" aria-hidden="true" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-display font-semibold text-xl text-[var(--color-fg-primary)]">
                {category.name}
              </h3>
              {category.badge && (
                <Badge variant="primary" className="text-[0.65rem] px-2 py-0.5">
                  {category.badge}
                </Badge>
              )}
            </div>
            <p className="text-[var(--color-fg-secondary)] text-sm mb-4">
              {category.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
            <Badge variant="outline" className="text-sm">
              {category.count} products
            </Badge>
            {/* Text link affordance (NOT a nested button inside an anchor) */}
            <span className="flex items-center gap-1 text-[var(--color-accent-cyan)] text-sm font-medium group-hover:text-[var(--color-accent-amber)] transition-colors">
              Explore
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
