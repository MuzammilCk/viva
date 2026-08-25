"use client"

import { useNavigate } from "react-router-dom"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { Drawer, useDrawers } from "@/components/ui/Drawer"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useCartStore } from "@/store/cartStore"
import { FREE_SHIPPING_THRESHOLD } from "@/store/cartStore"
import { getProductById } from "@/data/products"
import { formatPrice, cn } from "@/lib/utils"
import type { CartItem } from "@/types"

// ---------------------------------------------------------------------------
// CartDrawer
// ---------------------------------------------------------------------------
// A right-hand slide-in cart that shares the app's `<Drawer>` system
// (id="cart") and the persisted Zustand cart store. The Header's cart icon
// calls `openDrawer("cart")`; this component only needs to be mounted once.
//
// Line items hydrate product/variant metadata from `getProductById` at render
// (cheap, in-memory) so the drawer shows thumbnails, names and per-variant
// pricing without any new store plumbing.
// ---------------------------------------------------------------------------

export function CartDrawer() {
  // Visibility is driven entirely by the Drawer context (`openDrawer("cart")`
  // from Header/Footer). We only need closeDrawer for the drawer's own CTAs.
  const { closeDrawer } = useDrawers()
  const navigate = useNavigate()

  const items = useCartStore((s) => s.items)
  const itemCount = useCartStore((s) => s.itemCount)
  const subtotal = useCartStore((s) => s.subtotal)
  const tax = useCartStore((s) => s.tax)
  const shipping = useCartStore((s) => s.shipping)
  const discount = useCartStore((s) => s.discount)
  const total = useCartStore((s) => s.total)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const promoCode = useCartStore((s) => s.promoCode)

  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShipProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <Drawer id="cart" title="Your Cart" description={`${itemCount} item${itemCount === 1 ? "" : "s"}`} size="lg">
      {/* Body is rendered inside Drawer's own `flex-1 overflow-y-auto p-6`.
          We escape the gutter with -mx-6 where a band needs to span
          full-bleed, and keep the summary sticky so it stays in view. */}

      {/* Free-shipping progress bar */}
      {items.length > 0 && (
        <div className="-mx-6 -mt-6 border-b border-[var(--color-border-subtle)] px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-[var(--color-fg-secondary)]">
            <Truck className="h-4 w-4 text-[var(--color-accent-cyan)]" />
            {remainingForFreeShip > 0 ? (
              <span>
                Add <span className="font-semibold text-[var(--color-fg-primary)]">{formatPrice(remainingForFreeShip)}</span>{" "}
                more for <span className="text-[var(--color-success)]">free shipping</span>
              </span>
            ) : (
              <span className="text-[var(--color-success)] font-medium">You've unlocked free shipping! ✦</span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500 ease-out",
                remainingForFreeShip > 0
                  ? "bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-amber)]"
                  : "bg-[var(--color-success)]"
              )}
              style={{ width: `${freeShipProgress}%` }}
              role="progressbar"
              aria-label="Progress toward free shipping"
              aria-valuenow={Math.round(freeShipProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Item list */}
      {items.length === 0 ? (
        <EmptyCart
          onBrowse={() => {
            closeDrawer("cart")
            navigate("/products")
          }}
        />
      ) : (
        <ul className="space-y-4 py-4" aria-label="Cart items">
          {items.map((item) => (
            <CartLine
              key={item.id}
              item={item}
              onUpdateQty={(qty) => updateQuantity(item.id, qty)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </ul>
      )}

      {/* Summary + actions — sticky so the checkout CTA is always reachable */}
      {items.length > 0 && (
        <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/95 px-6 py-4 backdrop-blur-md">
          {/* Screen-reader-only live region: announces subtotal + free-ship
              eligibility when the user edits quantities. sr-only keeps it
              invisible; aria-live="polite" flushes after the edit. */}
          <p className="sr-only" aria-live="polite">
            {itemCount} item{itemCount === 1 ? "" : "s"}. Subtotal {formatPrice(subtotal)}.
            {remainingForFreeShip > 0
              ? ` Add ${formatPrice(remainingForFreeShip)} for free shipping.`
              : " Free shipping unlocked."}
          </p>
          <dl className="space-y-1.5 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 && (
              <Row
                label={
                  <span className="text-[var(--color-success)]">
                    Discount {promoCode ? `(${promoCode})` : ""}
                  </span>
                }
                value={<span className="text-[var(--color-success)]">−{formatPrice(discount)}</span>}
              />
            )}
            <Row
              label="Shipping"
              value={
                shipping === 0 ? (
                  <span className="text-[var(--color-success)]">Free</span>
                ) : (
                  formatPrice(shipping)
                )
              }
            />
            <Row label="Tax (est.)" value={formatPrice(tax)} />
          </dl>

          <div className="mt-3 flex items-baseline justify-between border-t border-[var(--color-border-subtle)] pt-3">
            <dt className="text-base font-semibold text-[var(--color-fg-primary)]">Total</dt>
            <dd className="text-lg font-bold text-[var(--color-fg-primary)] tabular-nums">
              {formatPrice(total)}
            </dd>
          </div>

          <div className="mt-4 space-y-2">
            <Button
              variant="primary"
              fullWidth
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
              onClick={() => {
                closeDrawer("cart")
                navigate("/checkout")
              }}
            >
              Checkout
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                closeDrawer("cart")
                navigate("/cart")
              }}
            >
              View Full Cart
            </Button>
          </div>

          <ul className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[var(--color-fg-secondary)]">
            <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--color-accent-cyan)]" /> Secure</li>
            <li className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5 text-[var(--color-accent-cyan)]" /> 30-day returns</li>
            <li className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-[var(--color-accent-cyan)]" /> 2-yr warranty</li>
          </ul>
        </div>
      )}
    </Drawer>
  )
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[var(--color-fg-secondary)]">{label}</dt>
      <dd className="font-medium text-[var(--color-fg-primary)] tabular-nums">{value}</dd>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Line item
// ──────────────────────────────────────────────────────────────────────────

function CartLine({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem
  onUpdateQty: (qty: number) => void
  onRemove: () => void
}) {
  const product = getProductById(item.productId)
  const variant = product?.variants?.find((v) => v.id === item.variantId)
  const maxQty = variant?.stockCount ?? undefined
  const name = product?.name ?? "Unknown product"
  const variantName = variant?.name
  const thumb = product?.images?.[0]
  const unitPrice = variant?.salePrice ?? variant?.price ?? product?.salePrice ?? product?.price ?? 0
  const lineTotal = unitPrice * item.quantity
  const lowStock = variant?.stockCount != null && variant.stockCount <= 3

  return (
    <li className="flex gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]/40 p-3">
      {/* Thumb */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
        {thumb ? (
          <img src={thumb} alt={variant?.name ?? name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-primary)]">
            <ShoppingBag className="h-6 w-6 text-[var(--color-fg-secondary)]" />
          </div>
        )}
      </div>

      {/* Meta + qty */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--color-fg-primary)]">{name}</p>
            {variantName && variantName !== name && (
              <p className="truncate text-xs text-[var(--color-fg-secondary)]">{variantName}</p>
            )}
          </div>
          <button
            onClick={onRemove}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--color-fg-secondary)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
            aria-label={`Remove ${name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between">
          {/* Qty stepper */}
          <div className="inline-flex items-center rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
            <button
              onClick={() => onUpdateQty(Math.max(1, item.quantity - 1))}
              className="flex h-8 w-8 items-center justify-center text-[var(--color-fg-secondary)] transition-colors hover:text-[var(--color-accent-cyan)] disabled:opacity-40"
              disabled={item.quantity <= 1}
              aria-label={`Decrease ${name} quantity`}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span
              className="w-8 text-center text-sm font-medium text-[var(--color-fg-primary)] tabular-nums"
              role="status"
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-[var(--color-fg-secondary)] transition-colors hover:text-[var(--color-accent-cyan)] disabled:opacity-40"
              disabled={maxQty != null && item.quantity >= maxQty}
              aria-label={`Increase ${name} quantity${maxQty != null ? `, max ${maxQty}` : ""}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--color-fg-primary)] tabular-nums">{formatPrice(lineTotal)}</p>
            {item.quantity > 1 && (
              <p className="text-[11px] text-[var(--color-fg-secondary)] tabular-nums">{formatPrice(unitPrice)} ea</p>
            )}
          </div>
        </div>

        {lowStock && (
          <Badge variant="warning" size="sm" className="mt-2 self-start">
            Only {variant?.stockCount} left
          </Badge>
        )}
      </div>
    </li>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────────────────────────────────

function EmptyCart({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-[var(--color-accent-cyan)]/10 blur-xl" aria-hidden="true" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
          <ShoppingBag className="h-9 w-9 text-[var(--color-accent-cyan)]" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-[var(--color-fg-primary)]">Your cart is empty</h3>
      <p className="mt-1 max-w-[16rem] text-sm text-[var(--color-fg-secondary)]">
        Explore hand-built synthesizers, controllers and modular gear — your selection lives here.
      </p>
      <Button
        variant="accent"
        icon={<ArrowRight className="h-4 w-4" />}
        iconPosition="right"
        onClick={onBrowse}
        className="mt-5"
      >
        Browse Gear
      </Button>
    </div>
  )
}
