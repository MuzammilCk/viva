import { createBrowserRouter, type RouteObject } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { ProductsPage } from "@/pages/ProductsPage"
import { ProductDetailPage } from "@/pages/ProductDetailPage"
import { CartPage } from "@/pages/CartPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { AccountPage } from "@/pages/AccountPage"
import { ConfigurePage } from "@/pages/ConfigurePage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { ErrorPage } from "@/pages/ErrorPage"
import { MainLayout } from "@/components/layout/MainLayout"

const layoutRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/products/:slug",
    element: <ProductDetailPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/account",
    element: <AccountPage />,
  },
  {
    path: "/configure",
    element: <ConfigurePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]

const rootRoute: RouteObject = {
  element: <MainLayout />,
  errorElement: <ErrorPage />,
  children: layoutRoutes,
}

export const router = createBrowserRouter([rootRoute])

export const routes = router