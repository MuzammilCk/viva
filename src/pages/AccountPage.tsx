import { useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { HeartIcon, PackageIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"
import { getAllProducts } from "@/data/products"
import { useWishlistActions, useWishlistIds } from "@/store/wishlistStore"
import type { Order } from "@/types"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProductCard } from "@/components/catalog/ProductCard"

const DEMO_ORDERS: Order[] = [
  {
    id: "o1",
    orderNumber: "SL-1042",
    status: "delivered",
    items: [
      { productId: "6", variantId: "6-standard", name: "Patch Cables 30cm (6-pack)", sku: "SL-PC30", quantity: 2, unitPrice: 24 },
      { productId: "5", variantId: "5-standard", name: "MiniLab 3", sku: "ART-ML3", quantity: 1, unitPrice: 129 },
    ],
    subtotal: 177,
    tax: 14.16,
    shipping: 0,
    discount: 0,
    total: 191.16,
    shippingAddress: {
      id: "a1",
      type: "shipping",
      isDefault: true,
      firstName: "Alex",
      lastName: "Rivera",
      street1: "88 Modulation Way",
      city: "Portland",
      state: "OR",
      postalCode: "97209",
      country: "USA",
    },
    paymentStatus: "paid",
    createdAt: "2026-07-18T10:24:00Z",
    trackingNumber: "1Z999AA10123456784",
  },
]

export function AccountPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialTab = (location.state as { tab?: string } | null)?.tab === "wishlist" ? "wishlist" : "orders"
  const [tab, setTab] = useState(initialTab)

  return (
    <div className="container-page flex flex-col gap-8 py-10 sm:py-12">
      <header className="flex flex-wrap items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-2xl tracking-tight sm:text-3xl">Welcome back, Alex</h1>
          <p className="text-sm text-muted-foreground">alex.rivera@example.com · Member since 2023</p>
        </div>
      </header>

      <Tabs value={tab} onValueChange={(value) => {
        setTab(value)
        navigate("/account", { replace: true })
      }}>
        <TabsList>
          <TabsTrigger value="orders" className="gap-2">
            <PackageIcon className="size-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-2">
            <HeartIcon className="size-4" />
            Wishlist
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="size-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="pt-6">
          <OrdersPanel />
        </TabsContent>
        <TabsContent value="wishlist" className="pt-6">
          <WishlistPanel />
        </TabsContent>
        <TabsContent value="profile" className="pt-6">
          <ProfilePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrdersPanel() {
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {DEMO_ORDERS.map((order) => (
        <article key={order.id} className="rounded-xl border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div>
              <p className="tnum font-medium">{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                Placed {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </p>
            </div>
            <Badge
              variant={order.status === "delivered" ? "secondary" : "default"}
              className="capitalize"
            >
              {order.status}
            </Badge>
          </div>
          <Separator className="mb-4" />
          <ul className="flex flex-col gap-1 pb-4 text-sm">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.sku}`} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {item.name} × <span className="tnum">{item.quantity}</span>
                </span>
                <span className="tnum">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="tnum font-semibold">{formatPrice(order.total)}</span>
          </div>
        </article>
      ))}
      <p className="text-sm text-muted-foreground">
        Need help with an order?{" "}
        <a href="mailto:support@synthlab.shop" className="font-medium underline hover:text-primary">
          Contact support
        </a>
      </p>
    </div>
  )
}

function WishlistPanel() {
  const ids = useWishlistIds()
  const products = useMemo(
    () =>
      getAllProducts().filter((product) => ids.includes(product.id)),
    [ids]
  )
  const { clear } = useWishlistActions()

  if (products.length === 0) {
    return (
      <div className="flex max-w-md flex-col items-start gap-4 rounded-xl border border-dashed p-10">
        <HeartIcon className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground">
            Tap the heart on any product to save it for later.
          </p>
        </div>
        <Button size="sm" variant="outline" render={<Link to="/products" />}>
          Discover gear
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} saved product(s)</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clear()
            toast.success("Wishlist cleared")
          }}
        >
          Clear wishlist
        </Button>
      </div>
      <div className={cn("grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3")}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

function ProfilePanel() {
  return (
    <dl className="flex max-w-md flex-col divide-y rounded-xl border bg-card [&>div]:flex [&>div]:justify-between [&>div]:gap-6 [&>div]:px-5 [&>div]:py-3.5 [&_dt]:text-muted-foreground [&_dd]:text-right [&_dt]:text-sm">
      <div>
        <dt>Name</dt>
        <dd>Alex Rivera</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>alex.rivera@example.com</dd>
      </div>
      <div>
        <dt>Default address</dt>
        <dd>
          88 Modulation Way, Portland OR
        </dd>
      </div>
      <div>
        <dt>Payment method</dt>
        <dd>Visa ending 4242</dd>
      </div>
    </dl>
  )
}
