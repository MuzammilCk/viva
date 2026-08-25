import { Link } from "react-router-dom"
import { HeartIcon, StarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductArt } from "@/components/catalog/ProductArt"
import { useCartActions } from "@/store/cartStore"
import { useWishlistActions, useWishlisted } from "@/store/wishlistStore"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartActions()
  const { toggle } = useWishlistActions()
  const wishlisted = useWishlisted(product.id)
  const finish = product.finishes[0]
  const onSale = Boolean(product.salePrice)

  return (
    <div className="group relative flex flex-col">
      <Button
        variant="ghost"
        size="icon"
        aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        onClick={() => toggle(product.id)}
        className={cn(
          "absolute right-3 top-3 z-10 rounded-full bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
          wishlisted && "opacity-100 text-primary"
        )}
      >
        <HeartIcon className={cn("size-4", wishlisted && "fill-current")} />
      </Button>

      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-lg border bg-muted/40 p-6 transition-colors hover:border-ring/40"
      >
        <div className="aspect-[4/3]">
          <ProductArt kind={product.artKind} finish={finish} className="transition-transform duration-300 group-hover:scale-[1.03]" />
        </div>
        {product.badge && (
          <Badge variant="secondary" className="absolute left-3 top-3">
            {product.badge}
          </Badge>
        )}
        {onSale && !product.badge && (
          <Badge className="absolute left-3 top-3">On sale</Badge>
        )}
      </Link>

      <div className="flex flex-col gap-1.5 pt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="font-medium leading-snug">
          <Link to={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <StarIcon className="size-3.5 fill-warning text-warning" />
          <span className="tnum">{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="tnum font-medium">
            {formatPrice(product.salePrice ?? product.price)}
            {onSale && (
              <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </p>
          <Button
            size="sm"
            variant="outline"
            disabled={!product.variants.some((v) => v.inStock)}
            onClick={() => {
              const variant = product.variants.find((v) => v.inStock) ?? product.variants[0]
              if (variant) {
                addItem({ productId: product.id, variantId: variant.id, quantity: 1 })
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
