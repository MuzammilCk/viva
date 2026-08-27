import { Link } from "react-router-dom"
import { MapPinIcon, MessageCircleIcon, PhoneIcon } from "lucide-react"
import { getCategorySummaries } from "@/data/products"
import { BUSINESS_CONFIG } from "@/config/business"

const SUPPORT_LINKS = [
  { label: "Audio Consultation", href: "/products" },
  { label: "Installation & Tuning", href: "/products" },
  { label: "Repairs & Upgrades", href: "/products" },
  { label: "Contact Us", href: "/products" },
]

const COMPANY_LINKS = [
  { label: `About ${BUSINESS_CONFIG.name}`, href: "/" },
  { label: "Products", href: "/products" },
]

export function Footer() {
  const categories = getCategorySummaries()

  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
            {BUSINESS_CONFIG.name}<span className="text-primary">.</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {BUSINESS_CONFIG.description}
          </p>
          <p className="text-xs text-muted-foreground/80">
            {BUSINESS_CONFIG.hours.summary}
          </p>
        </div>

        <nav aria-label="Shop categories">
          <p className="pb-3 text-sm font-semibold">Categories</p>
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

        <nav aria-label="Services & Support">
          <p className="pb-3 text-sm font-semibold">Solutions</p>
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
          <p className="pb-3 text-sm font-semibold">Contact &amp; Location</p>
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
            <a
              href={BUSINESS_CONFIG.contact.phone.tel}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <PhoneIcon className="size-3.5 shrink-0" />
              <span>Call: {BUSINESS_CONFIG.contact.phone.display}</span>
            </a>
            <a
              href={BUSINESS_CONFIG.contact.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <MessageCircleIcon className="size-3.5 shrink-0" />
              <span>WhatsApp: {BUSINESS_CONFIG.contact.whatsapp.display}</span>
            </a>
            <span className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-3.5 shrink-0" />
              <span>{BUSINESS_CONFIG.contact.address.full}</span>
            </span>
          </address>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.</p>
          <p>{BUSINESS_CONFIG.legalNotice}</p>
        </div>
      </div>
    </footer>
  )
}

