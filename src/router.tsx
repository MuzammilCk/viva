import { createBrowserRouter, type RouteObject } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { ErrorPage } from "@/pages/ErrorPage"
import { lazy } from "react"

const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })))
const ProductsPage = lazy(() =>
  import("@/pages/ProductsPage").then((m) => ({ default: m.ProductsPage }))
)
const ProductDetailPage = lazy(() =>
  import("@/pages/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage }))
)
const ServicesPage = lazy(() =>
  import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage }))
)
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
)

const layoutRoutes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/products/:slug", element: <ProductDetailPage /> },
  { path: "*", element: <NotFoundPage /> },
]

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: layoutRoutes,
  },
])
