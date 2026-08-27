import { Suspense } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { StickyContactBar } from "@/components/layout/StickyContactBar"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Skeleton } from "@/components/ui/skeleton"

function RouteFallback() {
  return (
    <div className="container-page flex flex-col gap-8 py-12">
      <Skeleton className="h-9 w-64 max-w-full" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/3] rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col pb-16 sm:pb-0">
      <ScrollToTop />
      <Header />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <StickyContactBar />
    </div>
  )
}
