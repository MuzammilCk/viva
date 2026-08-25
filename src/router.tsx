import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom"
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
const CartPage = lazy(() => import("@/pages/CartPage").then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() =>
  import("@/pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage }))
)
const AccountPage = lazy(() =>
  import("@/pages/AccountPage").then((m) => ({ default: m.AccountPage }))
)
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
)

const layoutRoutes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/products/:slug", element: <ProductDetailPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/account", element: <AccountPage /> },
  { path: "/configure", element: <Navigate to="/products" replace /> },
  { path: "*", element: <NotFoundPage /> },
]

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: layoutRoutes,
  },
])
