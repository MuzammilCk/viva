import { Outlet } from "react-router-dom"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/Skeleton"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CartDrawer } from "@/components/shop/CartDrawer"
import { useUIStore } from "@/store/uiStore"
import { cn } from "@/lib/utils"

/**
 * MainLayout — the persistent app shell.
 *
 * Structure: fixed Header (nav row + optional dismissible announcement
 * strip) → ambient backdrop → <main> with the routed <Outlet/> → Footer.
 * A single <CartDrawer/> is mounted here; Header/Footer open it via the
 * shared Drawer context (`openDrawer("cart")`).
 *
 * The main element's top padding tracks the announcement strip so content
 * is never hidden behind the fixed header when the strip is present, and
 * reclaims that space once dismissed.
 */
export function MainLayout() {
  const announcementDismissed = useUIStore((s) => s.announcementDismissed)
  // h-16 (64px) base nav row on mobile, h-20 (80px) on lg.
  // Announcement strip ≈ 33px when present.
  const padClass = announcementDismissed
    ? "pt-16 lg:pt-20"
    : "pt-[6.1rem] lg:pt-[7.1rem]"

  return (
    <>
      <Header />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] px-4 py-2 bg-[var(--color-accent-cyan)] text-[var(--color-fg-inverse)] rounded-lg font-medium"
      >
        Skip to main content
      </a>

      {/* Ambient backdrop — a faint dot grid + radial cyan glow that sits
          behind every page. Pointer-events-none keeps it decorative. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.06),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(160,160,176,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <main className={cn("relative min-h-screen", padClass)} id="main-content">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />

      {/* Global slide-in cart — mounted once, opened via Drawer context */}
      <CartDrawer />
    </>
  )
}

function PageSkeleton() {
  return (
    <div className="container py-12 animate-pulse">
      <div className="space-y-8">
        <Skeleton className="h-8 w-1/4 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-4 w-1/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
