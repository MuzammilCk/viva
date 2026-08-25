import { useState } from "react"
import { Grid } from "@/components/ui/Grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle, Truck, Shield, X } from "lucide-react"
import { useCartStore, shippingMethods, FREE_SHIPPING_THRESHOLD, isValidPromoCode } from "@/store/cartStore"
import { toast } from "@/store/uiStore"
import { formatPrice, cn } from "@/lib/utils"
import { Link, useNavigate } from "react-router-dom"
import { getProductById } from "@/data/products"

export function CartPage() {
  const { items, subtotal, tax, shipping, discount, total, updateQuantity, removeItem, setPromoCode, promoCode, shippingMethod, setShippingMethod } = useCartStore()
  const navigate = useNavigate()

  // The store is the single source of truth for shipping methods + the free-
  // shipping threshold (FREE_SHIPPING_THRESHOLD = 150). The shippingMethods
  // array and threshold are imported, not redeclared, so the cart, drawer and
  // checkout can never disagree again.
  const isFreeShipping = shipping === 0
  const isStandard = !shippingMethod || shippingMethod.id === "standard"
  // Hint only matters for standard ground that hasn't hit the threshold and
  // isn't already free via a FREESHIP promo code.
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const showFreeShipHint = !isFreeShipping && isStandard

  const [promoInput, setPromoInput] = useState(promoCode ?? "")

  const handleApplyPromo = () => {
    const code = promoInput.trim()
    if (!code) {
      toast.warning("Enter a promo code", "Type a code like WELCOME10, SYNTH20, MODULAR15 or FREESHIP.")
      return
    }
    if (!isValidPromoCode(code)) {
      toast.error("Invalid promo code", `"${code}" isn't a recognised code. Try WELCOME10, SYNTH20, MODULAR15 or FREESHIP.`)
      return
    }
    const upper = code.toUpperCase()
    setPromoCode(upper)
    const pct = upper === "WELCOME10" ? "10%" : upper === "SYNTH20" ? "20%" : upper === "MODULAR15" ? "15%" : null
    const label = upper === "FREESHIP" ? "Free shipping unlocked on this order!" : pct ? `${pct} off your subtotal` : "Discount applied"
    toast.success("Promo applied", `${upper} — ${label}`)
  }

  const handleRemovePromo = () => {
    setPromoCode(undefined)
    setPromoInput("")
    toast.info("Promo removed", "Promo code cleared from your order.")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[var(--color-bg-secondary)]">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-[var(--color-bg-tertiary)] flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-[var(--color-fg-muted)]" />
          </div>
          <h1 className="font-display font-bold text-3xl text-[var(--color-fg-primary)] mb-3">
            Your cart is empty
          </h1>
          <p className="text-[var(--color-fg-secondary)] mb-8">
            Looks like you haven't added any gear yet. Time to change that.
          </p>
          <Button size="lg" className="gap-2" onClick={() => navigate("/products")}>
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]">
        <div className="container py-6">
          <h1 className="font-display font-bold text-3xl text-[var(--color-fg-primary)]">
            Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
          </h1>
        </div>
      </header>

      <main className="container py-10 lg:py-16">
        <Grid columns={{ base: 1, lg: 3 }} gap="xl">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-fg-secondary)]">Subtotal</span>
                    <span className="font-medium text-[var(--color-fg-primary)]">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-[var(--color-success)]">
                      <span>Discount ({promoCode})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-fg-secondary)]">Estimated Tax</span>
                    <span className="font-medium text-[var(--color-fg-primary)]">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-fg-secondary)]">Shipping</span>
                    <span className="font-medium text-[var(--color-fg-primary)]">
                      {isFreeShipping ? (
                        <span className="text-[var(--color-success)]">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {showFreeShipHint ? (
                    <p className="text-xs text-[var(--color-accent-amber)]">
                      Add {formatPrice(remainingForFreeShip)} more for free standard shipping.
                    </p>
                  ) : isFreeShipping ? (
                    <p className="text-xs text-[var(--color-success)] font-medium">
                      Free shipping unlocked ✦
                    </p>
                  ) : null}

                  <div className="border-t border-[var(--color-border-subtle)] pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-[var(--color-fg-primary)]">Total</span>
                      <span className="text-[var(--color-fg-primary)]">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="border-t border-[var(--color-border-subtle)] pt-4">
                  <label htmlFor="promo" className="block text-sm font-medium text-[var(--color-fg-secondary)] mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      type="text"
                      placeholder="Try WELCOME10, SYNTH20, MODULAR15, FREESHIP"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyPromo() } }}
                      className="flex-1"
                      aria-label="Promo code"
                    />
                    {promoCode ? (
                      <Button variant="outline" size="sm" onClick={handleRemovePromo} className="gap-1">
                        <X className="w-4 h-4" /> Remove
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleApplyPromo}>Apply</Button>
                    )}
                  </div>
                  {promoCode && (
                    <p className="mt-2 text-sm text-[var(--color-success)]">
                      {discount > 0 ? `Applied! Saved ${formatPrice(discount)}` : "Applied — free shipping on this order."}
                    </p>
                  )}
                  {!promoCode && (
                    <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                      Codes: WELCOME10 (10%), SYNTH20 (20%), MODULAR15 (15%), FREESHIP (free shipping).
                    </p>
                  )}
                </div>

                {/* Shipping Method */}
                <div className="border-t border-[var(--color-border-subtle)] pt-4">
                  <label className="block text-sm font-medium text-[var(--color-fg-secondary)] mb-3">
                    Shipping Method
                  </label>
                  <div className="space-y-2">
                    {shippingMethods.map((option) => {
                      const optionFree = isFreeShipping && (option.id === "standard" || promoCode?.toUpperCase() === "FREESHIP")
                      return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                          shippingMethod?.id === option.id
                            ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/5"
                            : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]"
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingMethod?.id === option.id}
                          onChange={() => setShippingMethod(option)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[var(--color-fg-primary)]">{option.name}</span>
                            <span className="font-bold text-[var(--color-fg-primary)]">
                              {optionFree ? "FREE" : formatPrice(option.price)}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--color-fg-muted)]">{option.estimatedDays} business days</span>
                        </div>
                        <CheckCircle className={cn(
                          "w-5 h-5",
                          shippingMethod?.id === option.id
                            ? "text-[var(--color-accent-cyan)]"
                            : "text-transparent"
                        )} />
                      </label>
                      )
                    })}
                  </div>
                </div>

                {/* Checkout Button */}
                <Button size="lg" className="w-full gap-2 py-4 text-lg" onClick={() => navigate("/checkout")}>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-center text-xs text-[var(--color-fg-muted)]">
                  Secure checkout powered by Stripe
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 text-xs text-[var(--color-fg-muted)] border-t border-[var(--color-border-subtle)] pt-4">
                  <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span>Secure</span></div>
                  <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /><span>Encrypted</span></div>
                  <div className="flex items-center gap-1"><Truck className="w-3 h-3" /><span>Tracked</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="text-center mt-6">
              <Link to="/products" className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-amber)] font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </Grid>
      </main>
    </div>
  )
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: { item: any; onUpdateQuantity: (id: string, qty: number) => void; onRemove: (id: string) => void }) {
  const product = getProductById(item.productId)

  if (!product) {
    return (
      <Card variant="interactive" className="flex gap-4 p-4">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded opacity-30" style={{
              background: "linear-gradient(135deg, var(--color-accent-cyan), transparent)",
              boxShadow: "var(--shadow-glow-cyan)",
            }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--color-fg-primary)] mb-1 line-clamp-1">Unknown Product</h3>
          <p className="text-[var(--color-fg-primary)] font-bold">N/A</p>
        </div>
      </Card>
    )
  }

  // Per-category accent — sourced from design tokens (no raw hex literals).
  const accentByCategory: Record<string, string> = {
    "Synthesizers": "var(--color-accent-cyan)",
    "Controllers": "var(--color-accent-amber)",
    "Audio Interfaces": "var(--color-accent-coral)",
    "Modular": "var(--color-accent-violet)",
    "Accessories": "var(--color-accent-emerald)",
  }
  const glowByCategory: Record<string, string> = {
    "Synthesizers": "var(--shadow-glow-cyan)",
    "Controllers": "var(--shadow-glow-amber)",
    "Audio Interfaces": "var(--shadow-glow-coral)",
  }
  const accent = accentByCategory[product.category] ?? "var(--color-accent-cyan)"
  const glow = glowByCategory[product.category]

  return (
    <Card variant="interactive" className="flex gap-4 p-4">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-tertiary)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded opacity-30" style={{
            background: `linear-gradient(135deg, ${accent}, transparent)`,
            boxShadow: glow,
          }} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.slug}`} className="font-semibold text-[var(--color-fg-primary)] hover:text-[var(--color-accent-cyan)] transition-colors mb-1 line-clamp-1 block">
          {product.name}
        </Link>
        <p className="text-[var(--color-fg-primary)] font-bold">{formatPrice(product.salePrice || product.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="w-8 h-8 rounded-lg border border-[var(--color-border-default)] flex items-center justify-center hover:bg-[var(--color-bg-tertiary)]"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg border border-[var(--color-border-default)] flex items-center justify-center hover:bg-[var(--color-bg-tertiary)]"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="font-bold text-[var(--color-fg-primary)]">{formatPrice((product.salePrice || product.price) * item.quantity)}</span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-[var(--color-fg-muted)] hover:text-[var(--color-error)] transition-colors p-1"
          aria-label="Remove from cart"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </Card>
  )
}