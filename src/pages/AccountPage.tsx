import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Settings, Heart, Package, CreditCard, User, LogOut, Plus, MapPin, Shield, Zap, ChevronRight, Trash2, ShoppingBag } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatPrice, cn } from "@/lib/utils"
import { toast } from "@/store/uiStore"
import { useCartStore } from "@/store/cartStore"
import { useWishlistActions, useWishlistItems, useWishlistCount } from "@/store/wishlistStore"
import type { ProductData } from "@/data/products"

const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 2499,
    items: [{ name: "SynthLab Pro 8", quantity: 1, price: 2499 }],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "shipped",
    total: 599,
    items: [{ name: "KeyLab 61 MkII", quantity: 1, price: 599 }],
  },
  {
    id: "ORD-2023-045",
    date: "2023-12-20",
    status: "delivered",
    total: 899,
    items: [{ name: "Apollo Twin X", quantity: 1, price: 899 }],
  },
]

const mockAddresses = [
  {
    id: "1",
    type: "shipping",
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main Street",
    address2: "",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
    isDefault: true,
  },
  {
    id: "2",
    type: "billing",
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main Street",
    address2: "",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
    isDefault: true,
  },
]

const mockPaymentMethods = [
  { id: "1", type: "card", brand: "Visa", last4: "4242", expMonth: 12, expYear: 2025, isDefault: true },
  { id: "2", type: "card", brand: "Mastercard", last4: "5555", expMonth: 6, expYear: 2026, isDefault: false },
]

export function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const wishlistCount = useWishlistCount()

  // The Overview "Quick Action" cards switch to the matching sidebar tab, so we
  // expose a tab-switcher to OverviewTab.
  const handleQuickAction = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]">
        <div className="container py-6">
          <h1 className="font-display font-bold text-3xl text-[var(--color-fg-primary)]">
            My Account
          </h1>
        </div>
      </header>

      <main className="container py-10 lg:py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-0">
                <nav className="space-y-1 p-2">
                  {[
                    { id: "overview", label: "Overview", icon: User },
                    { id: "orders", label: "Orders", icon: Package },
                    { id: "wishlist", label: "Wishlist", icon: Heart },
                    { id: "addresses", label: "Addresses", icon: MapPin },
                    { id: "payment", label: "Payment Methods", icon: CreditCard },
                    { id: "settings", label: "Settings", icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                        activeTab === tab.id
                          ? "bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]"
                          : "text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-tertiary)]"
                      )}
                    >
                      <tab.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
                <div className="border-t border-[var(--color-border-subtle)] p-2">
                  <button
                    onClick={() => {
                      // No auth backend yet — surface the action so the CTA
                      // isn't a dead end, but stay honest that it's a stub.
                      toast.info(
                        "Sign out",
                        "Account sessions aren't backed by a server yet. Your cart and wishlist stay saved on this device."
                      )
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "overview" && (
              <OverviewTab wishlistCount={wishlistCount} onQuickAction={handleQuickAction} />
            )}
            {activeTab === "orders" && <OrdersTab orders={mockOrders} />}
            {activeTab === "wishlist" && <WishlistTab />}
            {activeTab === "addresses" && <AddressesTab addresses={mockAddresses} />}
            {activeTab === "payment" && <PaymentTab methods={mockPaymentMethods} />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </main>
    </div>
  )
}

function OverviewTab({
  wishlistCount,
  onQuickAction,
}: {
  wishlistCount: number
  onQuickAction: (tab: string) => void
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[var(--color-fg-secondary)]">
            Manage your account, track orders, and save your favorite gear.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
            <StatCard icon={Package} value="3" label="Total Orders" />
            <StatCard icon={Heart} value={String(wishlistCount)} label="Wishlist Items" />
            <StatCard icon={Shield} value="Active" label="Warranty Status" />
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        <QuickActionCard
          icon={Package}
          title="Recent Orders"
          description="View and track your recent purchases"
          action="View Orders"
          onClick={() => onQuickAction("orders")}
        />
        <QuickActionCard
          icon={Heart}
          title="Wishlist"
          description="Save items for later"
          action="View Wishlist"
          onClick={() => onQuickAction("wishlist")}
        />
        <QuickActionCard
          icon={MapPin}
          title="Addresses"
          description="Manage shipping and billing addresses"
          action="Manage Addresses"
          onClick={() => onQuickAction("addresses")}
        />
        <QuickActionCard
          icon={CreditCard}
          title="Payment Methods"
          description="Update your saved payment methods"
          action="Manage Payments"
          onClick={() => onQuickAction("payment")}
        />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="text-center p-4 rounded-lg bg-[var(--color-bg-tertiary)]">
      <div className="w-6 h-6 mx-auto mb-2 text-[var(--color-accent-cyan)]">
        <Icon className="w-6 h-6" />
      </div>
      <div className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">{value}</div>
      <div className="text-sm text-[var(--color-fg-secondary)]">{label}</div>
    </div>
  )
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group h-full text-left rounded-xl p-6",
        "bg-[var(--color-bg-card)] border border-[var(--color-border-default)] shadow-[var(--shadow-inner)]",
        "transition-[background-color,border-color,box-shadow,transform] duration-200",
        "cursor-pointer",
        "hover:border-[var(--color-accent-cyan)] hover:shadow-[var(--shadow-glow-cyan)] hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-secondary)]"
      )}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[var(--color-accent-cyan)]/10">
        <Icon className="w-6 h-6 text-[var(--color-accent-cyan)]" />
      </div>
      <h3 className="font-semibold text-[var(--color-fg-primary)] mb-1">{title}</h3>
      <p className="text-[var(--color-fg-secondary)] text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between text-[var(--color-accent-cyan)] font-medium">
        <span>{action}</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}

function OrdersTab({ orders }: { orders: typeof mockOrders }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">Order History</h2>
        <span className="text-sm text-[var(--color-fg-secondary)]">{orders.length} orders</span>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order }: { order: typeof mockOrders[0] }) {
  const statusColors: Record<string, string> = {
    delivered: "text-[var(--color-success)] bg-[var(--color-success)]/10",
    shipped: "text-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10",
    processing: "text-[var(--color-accent-amber)] bg-[var(--color-accent-amber)]/10",
    cancelled: "text-[var(--color-error)] bg-[var(--color-error)]/10",
  }

  return (
    <Card variant="outlined">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg opacity-30 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-cyan-dim))" }}
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-display font-bold text-lg text-[var(--color-fg-primary)]">{order.id}</span>
                <span className={cn("px-2 py-0.5 text-xs font-medium rounded", statusColors[order.status])}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-[var(--color-fg-secondary)]">{new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-display font-bold text-xl text-[var(--color-fg-primary)]">{formatPrice(order.total)}</p>
              <p className="text-xs text-[var(--color-fg-muted)]">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info(
                  `Order ${order.id}`,
                  "Order detail tracking isn't backed by a server yet. Your recent order history is shown above."
                )
              }
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WishlistTab() {
  const navigate = useNavigate()
  const items = useWishlistItems()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">Wishlist</h2>
        <span className="text-sm text-[var(--color-fg-secondary)]">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>
      {items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-12 h-12 mx-auto text-[var(--color-fg-muted)] mb-4" />
            <h3 className="font-semibold text-[var(--color-fg-primary)] mb-2">Your wishlist is empty</h3>
            <p className="text-[var(--color-fg-secondary)] mb-6">Save items you love for later</p>
            <Button onClick={() => navigate("/products")}>Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((product) => (
            <WishlistItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function WishlistItem({ product }: { product: ProductData }) {
  const { addItem } = useCartStore()
  const { remove: removeFromWishlist } = useWishlistActions()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: product.variants[0]?.id ?? "default",
      quantity: 1,
    })
    toast.success("Added to cart", `${product.name} has been added to your cart from your wishlist.`)
  }

  const handleRemove = () => {
    removeFromWishlist(product.id)
    toast.info("Removed from wishlist", `${product.name} was removed from your wishlist.`)
  }

  return (
    <Card variant="interactive" className="flex gap-4">
      <button
        type="button"
        onClick={() => navigate(`/products/${product.slug}`)}
        aria-label={`View ${product.name}`}
        className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)] cursor-pointer"
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className="w-10 h-10 rounded opacity-30"
            style={{ background: "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-cyan-dim))" }}
          />
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <button
          type="button"
          onClick={() => navigate(`/products/${product.slug}`)}
          className="block text-left font-semibold text-[var(--color-fg-primary)] mb-1 line-clamp-1 hover:text-[var(--color-accent-cyan)] transition-colors"
        >
          {product.name}
        </button>
        <p className="text-[var(--color-fg-secondary)] text-sm mb-2">{product.category}</p>
        <p className="font-bold text-[var(--color-fg-primary)]">{formatPrice(product.salePrice ?? product.price)}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button size="sm" variant="primary" icon={<ShoppingBag className="w-4 h-4" />} onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button size="sm" variant="ghost" icon={<Trash2 className="w-4 h-4" />} onClick={handleRemove}>
          Remove
        </Button>
      </div>
    </Card>
  )
}

function AddressesTab({ addresses }: { addresses: typeof mockAddresses }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">Addresses</h2>
        <Button
          className="gap-2"
          onClick={() => toast.info("Add address", "Address management isn't backed by a server yet.")}
        >
          <Plus className="w-4 h-4" />
          Add Address
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} isDefault={address.isDefault} />
        ))}
      </div>
    </div>
  )
}

function AddressCard({ address, isDefault }: { address: typeof mockAddresses[0]; isDefault: boolean }) {
  return (
    <Card variant={isDefault ? "interactive" : "outlined"} className="relative">
      {isDefault && (
        <div className="absolute top-3 right-3">
          <Badge variant="primary" className="text-xs">Default</Badge>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-[var(--color-fg-primary)]">{address.firstName} {address.lastName}</p>
            <p className="text-sm text-[var(--color-fg-muted)] capitalize">{address.type}</p>
          </div>
        </div>
        <address className="not-italic text-[var(--color-fg-secondary)] text-sm space-y-1">
          <div>{address.address1}</div>
          {address.address2 && <div>{address.address2}</div>}
          <div>{address.city}, {address.state} {address.postalCode}</div>
          <div>{address.country}</div>
        </address>
        <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => toast.info("Edit address", "Address editing isn't backed by a server yet.")}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--color-error)]"
            onClick={() => toast.info("Delete address", "Address deletion isn't backed by a server yet.")}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentTab({ methods }: { methods: typeof mockPaymentMethods }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">Payment Methods</h2>
        <Button
          className="gap-2"
          onClick={() => toast.info("Add card", "Adding payment methods isn't backed by a server yet.")}
        >
          <Plus className="w-4 h-4" />
          Add Card
        </Button>
      </div>
      <div className="space-y-3">
        {methods.map((method) => (
          <PaymentCard key={method.id} method={method} isDefault={method.isDefault} />
        ))}
      </div>
    </div>
  )
}

function PaymentCard({ method, isDefault }: { method: typeof mockPaymentMethods[0]; isDefault: boolean }) {
  // Per-brand accent gradient, sourced from design tokens instead of raw
  // Tailwind palette utilities (from-blue-600 to-blue-800 etc.) so the brand
  // swatch stays on-palette in light/dark and never reintroduces hex.
  const brandGradient: Record<string, { from: string; to: string }> = {
    Visa: { from: "var(--color-accent-cyan)", to: "var(--color-accent-cyan-dim)" },
    Mastercard: { from: "var(--color-accent-coral)", to: "var(--color-accent-amber)" },
    Amex: { from: "var(--color-accent-emerald)", to: "var(--color-accent-violet)" },
  }
  const gradient = brandGradient[method.brand] ?? {
    from: "var(--color-bg-tertiary)",
    to: "var(--color-bg-tertiary)",
  }

  return (
    <Card variant={isDefault ? "interactive" : "outlined"} className="relative">
      {isDefault && (
        <div className="absolute top-3 right-3">
          <Badge variant="primary" className="text-xs">Default</Badge>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-12 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})` }}
            >
              {method.brand}
            </div>
            <div>
              <p className="font-semibold text-[var(--color-fg-primary)]">•••• {method.last4}</p>
              <p className="text-sm text-[var(--color-fg-muted)]">Expires {method.expMonth.toString().padStart(2, "0")}/{method.expYear.toString().slice(-2)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Set default", `Default payment switching isn't backed by a server yet.`)}
              >
                Set Default
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--color-error)]"
              onClick={() => toast.info("Remove card", "Removing payment methods isn't backed by a server yet.")}
            >
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SettingsTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Doe" />
          </div>
          <Input label="Email" type="email" placeholder="john@example.com" />
          <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle label="Order Updates" description="Receive updates on your orders" defaultChecked />
          <NotificationToggle label="Promotional Emails" description="Get notified about sales and new products" defaultChecked />
          <NotificationToggle label="Newsletter" description="Weekly synth news and tutorials" defaultChecked />
          <NotificationToggle label="Price Drop Alerts" description="Notify me when wishlist items go on sale" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => toast.info("Change password", "Password changes aren't backed by a server yet.")}
          >
            <Shield className="w-4 h-4" />
            Change Password
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => toast.info("Two-factor authentication", "Enabling 2FA isn't backed by a server yet.")}
          >
            <Zap className="w-4 h-4" />
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationToggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label className="flex items-center justify-between cursor-pointer p-4 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card)] transition-colors">
      <div>
        <p className="font-medium text-[var(--color-fg-primary)]">{label}</p>
        <p className="text-sm text-[var(--color-fg-secondary)]">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="w-5 h-5 rounded border-[var(--color-border-default)] text-[var(--color-accent-cyan)] focus:ring-[var(--color-focus-ring)]"
      />
    </label>
  )
}