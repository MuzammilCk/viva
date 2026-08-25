import { Link } from "react-router-dom"
import { ShoppingBagIcon } from "lucide-react"
import { useUIStore, useUIActions } from "@/store/uiStore"
import {
  FREE_SHIPPING_THRESHOLD,
  useCartActions,
  useCartItems,
  useCartSubtotal,
} from "@/store/cartStore"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ProductArt } from "@/components/catalog/ProductArt"
import { formatPrice } from "@/lib/format"
import { getProductById } from "@/data/products"

export function CartSheet() {
  const cartOpen = useUIStore((state) => state.cartOpen)
  const { setCartOpen } = useUIActions()
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { updateQuantity, removeItem } = useCartActions()

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Nothing here yet."
              : `${items.reduce((sum, item) => sum + item.quantity, 0)} item(s) ready to go.`}
          </SheetDescription>
        </SheetHeader>

        {items.length > 0 && (
          <div className="px-4 pb-2">
            <p className="text-sm text-muted-foreground">
              {remainingForFreeShipping > 0 ? (
                <>
                  Add{" "}
                  <span className="tnum font-medium text-foreground">
                    {formatPrice(remainingForFreeShipping)}
                  </span>{" "}
                  for free standard shipping.
                </>
              ) : (
                "You've unlocked free standard shipping."
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Separator />

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBagIcon className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Browse the catalog and add some gear.</p>
              <Button
                variant="outline"
                size="sm"
                render={<Link to="/products" />}
                onClick={() => setCartOpen(false)}
              >
                Shop products
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y">
              {items.map((item) => {
                const product = getProductById(item.productId)
                if (!product) return null
                const variant = product.variants.find((v) => v.id === item.variantId)
                const unitPrice =
                  variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.price
                return (
                  <li key={item.id} className="flex gap-4 py-4">
                    <Link
                      to={`/products/${product.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="size-16 shrink-0 rounded-md border bg-muted/40 p-2"
                    >
                      <ProductArt kind={product.artKind} finish={product.finishes[0]} />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${product.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="truncate text-sm font-medium hover:underline"
                        >
                          {product.name}
                        </Link>
                        <span className="tnum shrink-0 text-sm font-medium">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{variant?.name}</p>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="flex items-center rounded-md border">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="px-2 py-0.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="tnum min-w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.name}`}
                            className="px-2 py-0.5 text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tnum font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button render={<Link to="/checkout" />} onClick={() => setCartOpen(false)}>
                Checkout
              </Button>
              <Button
                variant="ghost"
                size="sm"
                render={<Link to="/cart" />}
                onClick={() => setCartOpen(false)}
              >
                View full cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
