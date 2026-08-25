import { Link } from "react-router-dom"
import type { SVGProps } from "react"
import {
  X,
  Mail,
  Zap,
  Truck,
  Shield,
  Headphones,
} from "lucide-react"

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  )
}

const footerLinks = {
  product: [
    { label: "Synthesizers", href: "/products?category=synthesizers" },
    { label: "Controllers", href: "/products?category=controllers" },
    { label: "Audio Interfaces", href: "/products?category=interfaces" },
    { label: "Modular", href: "/products?category=modular" },
    { label: "Accessories", href: "/products?category=accessories" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=popular" },
    { label: "On Sale", href: "/products?sale=true" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Partners", href: "/partners" },
    { label: "Sustainability", href: "/sustainability" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Warranty", href: "/warranty" },
    { label: "Repairs", href: "/repairs" },
    { label: "Manuals", href: "/manuals" },
    { label: "Track Order", href: "/track-order" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
}

const socialLinks = [
  { icon: X, href: "https://twitter.com/synthlab", label: "Twitter" },
  { icon: GithubIcon, href: "https://github.com/synthlab", label: "GitHub" },
  { icon: YoutubeIcon, href: "https://youtube.com/synthlab", label: "YouTube" },
  { icon: InstagramIcon, href: "https://instagram.com/synthlab", label: "Instagram" },
  { icon: Mail, href: "mailto:hello@synthlab.com", label: "Email" },
]

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $199" },
  { icon: Shield, title: "3-Year Warranty", desc: "On all new gear" },
  { icon: Headphones, title: "Expert Support", desc: "Musicians helping musicians" },
  { icon: Zap, title: "Fast Processing", desc: "Ships within 24 hours" },
]

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)]">
      {/* Features Bar */}
      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-bg-primary)]/50 border border-[var(--color-border-subtle)] transition-all hover:border-[var(--color-border-default)]"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-accent-cyan)]/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-[var(--color-accent-cyan)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-fg-primary)]">{feature.title}</h3>
                <p className="text-sm text-[var(--color-fg-muted)]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6" aria-label="SynthLab Home">
              <svg className="w-10 h-10 text-[var(--color-accent-cyan)]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="6" fill="currentColor" opacity="0.1" />
                <path
                  d="M8 12h16M8 16h12M8 20h8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">SynthLab</span>
            </Link>
            <p className="text-[var(--color-fg-secondary)] max-w-xs mb-6 leading-relaxed">
              Professional music electronics for the modern synthesist.
              Curated instruments, expert knowledge, and a community that speaks your language.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-bg-tertiary)] text-[var(--color-fg-muted)] hover:text-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)]/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <nav aria-label="Product links">
            <h4 className="font-semibold text-[var(--color-fg-primary)] mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Links */}
          <nav aria-label="Company links">
            <h4 className="font-semibold text-[var(--color-fg-primary)] mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support links">
            <h4 className="font-semibold text-[var(--color-fg-primary)] mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal links">
            <h4 className="font-semibold text-[var(--color-fg-primary)] mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[var(--color-fg-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-[var(--color-fg-primary)] mb-4">Newsletter</h4>
            <p className="text-sm text-[var(--color-fg-secondary)] mb-4">
              Get the latest synth news, tutorials, and exclusive offers.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-fg-primary)] placeholder-[var(--color-fg-muted)] focus:outline-none focus:border-[var(--color-accent-cyan)] focus:ring-2 focus:ring-[var(--color-accent-cyan)]/20 transition-all"
                  aria-label="Email address"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[var(--color-accent-cyan)] text-[var(--color-fg-inverse)] font-medium rounded-lg hover:bg-[var(--color-accent-cyan-dim)] transition-colors"
              >
                Subscribe
              </button>
              <p className="text-xs text-[var(--color-fg-muted)] text-center">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border-subtle)]">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-fg-muted)]">
              © {new Date().getFullYear()} SynthLab. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--color-fg-muted)]">
              <span>Made with</span>
              <span className="flex items-center gap-1 text-[var(--color-accent-coral)]">
                <Zap className="w-3 h-3" />
                <span>by musicians</span>
              </span>
              <span>for musicians</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}