import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import {
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  MoonIcon,
  ShoppingBagIcon,
  SunIcon,
  XIcon,
} from "lucide-react"
import { useUIStore, useUIActions, type Theme } from "@/store/uiStore"
import { useCartCount } from "@/store/cartStore"
import { useWishlistCount } from "@/store/wishlistStore"
import { getCategorySummaries } from "@/data/products"
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
  { label: "Products", to: "/products" },
  { label: "Account", to: "/account" },
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
              Free standard shipping on orders over $150 · 30-day returns · 2-year warranty
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
        aria-label="SynthLab home"
      >
        SynthLab<span className="text-primary">.</span>
      </Link>

      <div className="hidden items-center gap-1 md:flex">
        <DesktopLinks />
        <CategoryMenu />
      </div>

      <div className="flex items-center gap-0.5">
        <ThemeToggle />
        <WishlistLink />
        <CartButton />
      </div>
    </nav>
  )
}

function DesktopLinks() {
  return (
    <>
      {NAV_LINKS.filter((link) => link.label !== "Account").map((link) => (
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

function WishlistLink() {
  const count = useWishlistCount()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Wishlist (${count} saved)`}
      render={<Link to="/account" state={{ tab: "wishlist" }} className="relative" />}
    >
      <HeartIcon className="size-4.5" />
      {count > 0 && (
        <span className="tnum absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Button>
  )
}

function CartButton() {
  const count = useCartCount()
  const { setCartOpen } = useUIActions()
  return (
    <Button variant="ghost" size="icon" aria-label={`Open cart (${count} items)`} onClick={() => setCartOpen(true)} className="relative">
      <ShoppingBagIcon className="size-4.5" />
      {count > 0 && (
        <span className="tnum absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
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
