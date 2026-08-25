import { Link, useLocation } from "react-router-dom"
import { Menu, X, ShoppingCart, User, Sun, Moon, Monitor, Sparkles } from "lucide-react"
import { useUIStore } from "@/store/uiStore"
import { useCartStore } from "@/store/cartStore"
import { cn } from "@/lib/utils"
import { Drawer, useDrawers } from "@/components/ui/Drawer"

export function Header() {
  const location = useLocation()
  const { theme, toggleTheme, announcementDismissed, dismissAnnouncement } = useUIStore()
  const { openDrawer, closeDrawer, isOpen } = useDrawers()
  const { itemCount } = useCartStore()
  const mobileMenuOpen = isOpen("mobile-nav")
  const announcementOpen = !announcementDismissed

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/products?category=synthesizers", label: "Synthesizers" },
    { href: "/products?category=controllers", label: "Controllers" },
    { href: "/products?category=interfaces", label: "Audio Interfaces" },
    { href: "/products?category=modular", label: "Modular" },
    { href: "/configure", label: "Configure" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-[var(--z-sticky)] bg-[var(--color-bg-primary)]/90 backdrop-blur-xl border-b border-[var(--color-border-subtle)]">
      {/* Announcement / trust strip — sits above the main nav row */}
      {announcementOpen && (
        <div className="border-b border-[var(--color-border-subtle)] bg-gradient-to-r from-[var(--color-bg-secondary)] via-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)]">
          <div className="container">
            <div className="flex items-center justify-between gap-4 py-1.5 text-xs">
              <div className="flex min-w-0 items-center gap-2 text-[var(--color-fg-secondary)]">
                <Sparkles className="hidden h-3.5 w-3.5 flex-shrink-0 text-[var(--color-accent-cyan)] sm:block" />
                <span className="truncate">
                  <span className="font-semibold text-[var(--color-fg-primary)]">Free shipping over $150</span>
                  <span className="px-2 text-[var(--color-border-strong)]">·</span>
                  <span className="hidden sm:inline">Hand-built in Berlin</span>
                  <span className="px-2 text-[var(--color-border-strong)] hidden sm:inline">·</span>
                  <span className="hidden sm:inline">2-year warranty</span>
                </span>
              </div>
              <button
                onClick={dismissAnnouncement}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[var(--color-fg-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-fg-primary)]"
                aria-label="Dismiss announcement"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="SynthLab Home">
            <svg className="w-8 h-8 text-[var(--color-accent-cyan)]" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="currentColor" opacity="0.1" />
              <path
                d="M8 12h16M8 16h12M8 20h8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="24" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="font-display font-bold text-xl text-[var(--color-fg-primary)] hidden sm:block">
              SynthLab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)]",
                  "hover:bg-[var(--color-bg-tertiary)]",
                  location.pathname === item.href || location.pathname.startsWith(item.href + "?")
                    ? "text-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10"
                    : ""
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </button>

            {/* Cart — opens slide-in drawer (full cart still at /cart) */}
            <button
              onClick={() => openDrawer("cart")}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              aria-label={itemCount > 0 ? `Open cart with ${itemCount} items` : "Open cart"}
              aria-haspopup="dialog"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-5 rounded-full bg-[var(--color-accent-cyan)] text-[var(--color-fg-inverse)] text-xs font-medium px-1 shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link to="/account" className="flex items-center justify-center w-10 h-10 rounded-lg text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => mobileMenuOpen ? closeDrawer("mobile-nav") : openDrawer("mobile-nav")}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        id="mobile-nav"
        title="Navigation"
        className="w-full max-w-sm"
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => closeDrawer("mobile-nav")}
              className={cn(
                "px-4 py-3 text-base font-medium rounded-lg transition-all",
                "text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)]",
                "hover:bg-[var(--color-bg-tertiary)]",
                location.pathname === item.href || location.pathname.startsWith(item.href + "?")
                  ? "text-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10"
                  : ""
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[var(--color-border-subtle)] mt-4 pt-4 space-y-2">
          <button
            onClick={() => {
              closeDrawer("mobile-nav")
              openDrawer("cart")
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            aria-label={itemCount > 0 ? `Open cart with ${itemCount} items` : "Open cart"}
            aria-haspopup="dialog"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {itemCount > 0 && (
              <span className="ml-auto flex items-center justify-center min-w-[18px] h-5 rounded-full bg-[var(--color-accent-cyan)] text-[var(--color-fg-inverse)] text-xs font-medium px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
          <Link
            to="/account"
            onClick={() => closeDrawer("mobile-nav")}
            className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <User className="w-5 h-5" />
            Account
          </Link>
        </div>
      </Drawer>
    </header>
  )
}