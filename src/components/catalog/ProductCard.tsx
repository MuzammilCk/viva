import { Link } from "react-router-dom"
import { ArrowRightIcon, MessageCircleIcon, PackageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatProductPrice } from "@/lib/format"
import { BUSINESS_CONFIG } from "@/config/business"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    `Hi VIVA team, I would like to inquire about ${product.name} (${product.brand} - ${product.model}).`
  )}`

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-ring/40 hover:shadow-xs">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden border-b bg-muted/20"
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-muted/40 to-muted/20 p-6 text-center select-none">
            <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-background/80 text-muted-foreground shadow-2xs">
              <PackageIcon className="size-6 stroke-[1.5]" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {product.category}
              </span>
              <span className="text-[11px] text-muted-foreground/60">Photo to be updated</span>
            </div>
          </div>
        )}
        {product.featured && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground shadow-xs">
            Featured
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-wider">{product.brand}</span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{product.category}</span>
        </div>

        <h3 className="mt-2 font-medium leading-snug">
          <Link
            to={`/products/${product.slug}`}
            className="text-foreground transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between border-t pt-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Price</p>
              <p className="tnum font-semibold text-foreground">
                {formatProductPrice(product.price)}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">{product.model}</p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs gap-1.5"
              render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <MessageCircleIcon className="size-3.5" />
              WhatsApp
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-xs"
              render={<Link to={`/products/${product.slug}`} />}
            >
              Details
              <ArrowRightIcon className="size-3" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
