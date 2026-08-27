import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import {
  ChevronDownIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "lucide-react"
import { useUIStore, useUIActions, type Theme } from "@/store/uiStore"
import { getCategorySummaries } from "@/data/products"
import { BUSINESS_CONFIG } from "@/config/business"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Services", to: "/services" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
]

export function Header() {
  const announcementDismissed = useUIStore((s) => s.announcementDismissed)
  const { dismissAnnouncement } = useUIActions()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {!announcementDismissed && (
        <div className="bg-primary text-primary-foreground">
          <div className="container-page flex items-center justify-center gap-2 py-1.5 text-xs sm:text-sm">
            <p>
              Direct audio solutions &amp; installation in Kottakkal · Call {BUSINESS_CONFIG.contact.phone.display} · WhatsApp {BUSINESS_CONFIG.contact.whatsapp.display}
            </p>
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={dismissAnnouncement}
              className="ml-2 rounded p-0.5 opacity-80 transition-opacity hover:opacity-100"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        </div>
      )}
      <div className="container-page">
        <HeaderNav />
      </div>
    </header>
  )
}

function HeaderNav() {
  return (
    <nav aria-label="Main navigation" className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
      <MobileMenu />

      <Link
        to="/"
        className="flex items-baseline gap-1 text-xl font-semibold tracking-tight"
        aria-label={`${BUSINESS_CONFIG.name} home`}
      >
        {BUSINESS_CONFIG.name}<span className="text-primary">.</span>
      </Link>

      <div className="hidden items-center gap-1 md:flex">
        <DesktopLinks />
        <CategoryMenu />
      </div>

      <div className="flex items-center gap-0.5">
        <ThemeToggle />
      </div>
    </nav>
  )
}

function DesktopLinks() {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
              isActive ? "text-foreground" : "text-muted-foreground"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}

function CategoryMenu() {
  const categories = getCategorySummaries()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-1 px-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground" />
        }
      >
        Categories
        <ChevronDownIcon className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Browse by category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categories.map(({ category, count }) => (
          <DropdownMenuItem key={category} render={<Link to={`/products?category=${encodeURIComponent(category)}`} />}>
            <span className="flex w-full items-center justify-between">
              <span>{category}</span>
              <span className="tnum text-xs text-muted-foreground">{count}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const THEME_CYCLE: Record<Theme, Theme> = { light: "dark", dark: "system", system: "light" }

function ThemeToggle() {
  const theme = useUIStore((s) => s.theme)
  const { setTheme } = useUIActions()
  const next = THEME_CYCLE[theme]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Switch theme (currently ${theme})`}
      title={`Theme: ${theme}`}
    >
      {theme === "dark" ? <MoonIcon className="size-4.5" /> : <SunIcon className="size-4.5" />}
    </Button>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)
  const categories = getCategorySummaries()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}>
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <nav aria-label="Mobile navigation" className="mt-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
          <p className="mt-4 px-3 pb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Categories
          </p>
          {categories.map(({ category, count }) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent hover:text-accent-foreground"
            >
              {category}
              <span className="tnum text-xs text-muted-foreground">{count}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
