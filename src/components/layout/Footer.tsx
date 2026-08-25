import { Link } from "react-router-dom"
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"
import { getCategorySummaries } from "@/data/products"

const SUPPORT_LINKS = [
  { label: "Shipping & delivery", href: "/products" },
  { label: "Returns & warranty", href: "/products" },
  { label: "Payment options", href: "/products" },
  { label: "Contact support", href: "/products" },
]

const COMPANY_LINKS = [
  { label: "About SynthLab", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Cart", href: "/cart" },
]

export function Footer() {
  const categories = getCategorySummaries()

  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
            SynthLab<span className="text-primary">.</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Independent music-electronics retailer since 2016. Synthesizers, controllers,
            interfaces and modular gear — tested by people who make music every day.
          </p>
        </div>

        <nav aria-label="Shop categories">
          <p className="pb-3 text-sm font-semibold">Shop</p>
          <ul className="flex flex-col gap-2">
            {categories.map(({ category }) => (
              <li key={category}>
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Support">
          <p className="pb-3 text-sm font-semibold">Support</p>
          <ul className="flex flex-col gap-2">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="pb-3 text-sm font-semibold">Company</p>
          <ul className="flex flex-col gap-2 pb-4">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <address className="flex flex-col gap-2 not-italic text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <PhoneIcon className="size-3.5 shrink-0" /> +1 (555) 012-8899
            </span>
            <a href="mailto:support@synthlab.shop" className="flex items-center gap-2 hover:text-foreground">
              <MailIcon className="size-3.5 shrink-0" /> support@synthlab.shop
            </a>
            <span className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-3.5 shrink-0" />
              440 Signal Path Ave, Portland, OR 97209
            </span>
          </address>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SynthLab Electronics. All rights reserved.</p>
          <p>Prices include a 2-year SynthLab warranty at no extra cost.</p>
        </div>
      </div>
    </footer>
  )
}
