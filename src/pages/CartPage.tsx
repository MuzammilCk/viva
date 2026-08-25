import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRightIcon, ShoppingBagIcon } from "lucide-react"
import { toast } from "sonner"
import {
  FREE_SHIPPING_THRESHOLD,
  isValidPromoCode,
  shippingMethods,
  useCartActions,
  useCartDiscount,
  useCartItems,
  useCartPromoCode,
  useCartShipping,
  useCartShippingMethod,
  useCartSubtotal,
  useCartTax,
  useCartTotal,
} from "@/store/cartStore"
import type { ShippingMethod } from "@/types"
import { formatPrice } from "@/lib/format"
import { getProductById } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductArt } from "@/components/catalog/ProductArt"

export function CartPage() {
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const tax = useCartTax()
  const shipping = useCartShipping()
  const discount = useCartDiscount()
  const total = useCartTotal()
  const promoCode = useCartPromoCode()
  const shippingMethod = useCartShippingMethod()
  const { updateQuantity, removeItem, setPromoCode, setShippingMethod } = useCartActions()

  const [promoInput, setPromoInput] = useState(promoCode ?? "")

  function applyPromo() {
    if (!promoInput.trim()) {
      setPromoCode(undefined)
      return
    }
    if (isValidPromoCode(promoInput)) {
      setPromoCode(promoInput.trim())
      toast.success(`Promo code ${promoInput.trim().toUpperCase()} applied`)
    } else {
      toast.error("Invalid promo code", { description: "That code doesn't exist or has expired." })
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <ShoppingBagIcon className="size-10 text-muted-foreground" />
        <h1 className="font-display text-3xl tracking-tight">Your cart is empty</h1>
        <p className="max-w-sm text-muted-foreground">
          Looks like you haven't added anything yet. The catalog is one click away.
        </p>
        <Button render={<Link to="/products" />}>
          Browse products
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    )
  }

  return (
    <div className="container-page flex flex-col gap-8 py-10 sm:py-12">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Shopping cart</h1>
        <p className="text-muted-foreground">
          {items.reduce((sum, item) => sum + item.quantity, 0)} item(s) in your cart
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <ul className="flex flex-col divide-y rounded-xl border bg-card">
          {items.map((item) => {
            const product = getProductById(item.productId)
            if (!product) return null
            const variant = product.variants.find((v) => v.id === item.variantId)
            const unitPrice =
              variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.price
            return (
              <li key={item.id} className="flex flex-wrap items-start gap-4 p-4 sm:flex-nowrap sm:p-6">
                <Link to={`/products/${product.slug}`} className="size-20 shrink-0 rounded-md border bg-muted/40 p-2">
                  <ProductArt kind={product.artKind} finish={product.finishes[0]} />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {product.brand}
                  </p>
                  <Link to={`/products/${product.slug}`} className="font-medium hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{variant?.name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="flex flex-col items-end justify-between gap-3 sm:min-h-20">
                  <span className="tnum font-semibold">{formatPrice(unitPrice * item.quantity)}</span>
                  <div className="flex items-center rounded-md border">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="tnum min-w-7 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${product.name}`}
                      className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <aside aria-label="Order summary" className="flex flex-col gap-5 rounded-xl border bg-card p-6 lg:sticky lg:top-32">
          <p className="font-semibold">Order summary</p>

          <div className="flex flex-col gap-2">
            <label htmlFor="promo" className="text-sm font-medium">
              Promo code
            </label>
            <div className="flex gap-2">
              <Input
                id="promo"
                placeholder="e.g. WELCOME10"
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                onKeyDown={(event) => event.key === "Enter" && applyPromo()}
              />
              <Button variant="outline" onClick={applyPromo}>
                Apply
              </Button>
            </div>
            {promoCode && (
              <p className="text-xs text-muted-foreground">
                Applied: <span className="font-medium text-foreground">{promoCode}</span>{" "}
                <button
                  type="button"
                  className="underline hover:text-destructive"
                  onClick={() => {
                    setPromoCode(undefined)
                    setPromoInput("")
                  }}
                >
                  remove
                </button>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="shipping-method" className="text-sm font-medium">
              Shipping method
            </label>
            <Select value={shippingMethod?.id} onValueChange={(id) => setShippingMethod(shippingMethods.find((m) => m.id === id) as ShippingMethod)}>
              <SelectTrigger id="shipping-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {shippingMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name} · {method.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-muted-foreground">
                Free standard shipping starts at {formatPrice(FREE_SHIPPING_THRESHOLD)}.
              </p>
            )}
          </div>

          <Separator />

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tnum">{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd className="tnum">−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="tnum">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated tax</dt>
              <dd className="tnum">{formatPrice(tax)}</dd>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="tnum">{formatPrice(total)}</dd>
            </div>
          </dl>

          <Button size="lg" render={<Link to="/checkout" />}>Proceed to checkout</Button>
          <Button variant="ghost" size="sm" render={<Link to="/products" />}>Continue shopping</Button>
        </aside>
      </div>
    </div>
  )
}
