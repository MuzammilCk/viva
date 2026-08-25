import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CheckIcon,
  ChevronRightIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
} from "lucide-react"
import { toast } from "sonner"
import { getProductBySlug, getRelatedProducts } from "@/data/products"
import { useCartActions } from "@/store/cartStore"
import { useWishlistActions, useWishlisted } from "@/store/wishlistStore"
import type { ProductFinish } from "@/types"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ProductArt } from "@/components/catalog/ProductArt"
import { ProductCard } from "@/components/catalog/ProductCard"

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const product = useMemo(() => (slug ? getProductBySlug(slug) : undefined), [slug])

  const [finishId, setFinishId] = useState(product?.finishes[0]?.id)
  const finish: ProductFinish | undefined = product?.finishes.find((f) => f.id === finishId) ?? product?.finishes[0]

  const inStockVariant = product?.variants.find((v) => v.inStock)
  const [variantId, setVariantId] = useState(inStockVariant?.id ?? product?.variants[0]?.id ?? "")
  const variant = product?.variants.find((v) => v.id === variantId)

  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartActions()
  const { toggle } = useWishlistActions()
  const wishlisted = useWishlisted(product?.id ?? "")

  if (!product || !finish) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <p className="text-muted-foreground">It may have been discontinued.</p>
        <Button onClick={() => navigate("/products")}>Back to products</Button>
      </div>
    )
  }

  const unitPrice = variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.price
  const compareAt = variant?.salePrice ?? product.salePrice ? product.price : undefined
  const related = getRelatedProducts(product)
  const specCategories = [...new Set(product.specs.map((s) => s.category))]

  function handleAddToCart() {
    addItem({
      productId: product!.id,
      variantId: variant!.id,
      quantity,
      configuration: { finishId: finish!.id },
    })
    toast.success("Added to cart", { description: `${product!.name} × ${quantity}` })
  }

  return (
    <div className="container-page flex flex-col gap-10 py-8 sm:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />} />
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/products" />} />
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border bg-gradient-to-b from-muted/50 to-muted/20 p-8 sm:p-12">
            <div className="aspect-square">
              <ProductArt kind={product.artKind} finish={finish} label={`${product.name} in ${finish.name}`} />
            </div>
          </div>
          {product.finishes.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Finish:</span>
              {product.finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-label={`Show ${f.name} finish`}
                  aria-pressed={f.id === finish.id}
                  onClick={() => setFinishId(f.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    f.id === finish.id
                      ? "border-primary bg-primary/5 text-foreground"
                      : "text-muted-foreground hover:border-ring/40 hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-3 rounded-full border"
                    style={{ background: `linear-gradient(135deg, ${f.panel}, ${f.body})` }}
                  />
                  {f.name}
                  {f.id === finish.id && <CheckIcon className="size-3 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{product.brand}</Badge>
              {product.badge && <Badge>{product.badge}</Badge>}
              {(variant && !variant.inStock) && <Badge variant="secondary">Out of stock</Badge>}
            </div>
            <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <StarIcon className="size-4 fill-warning text-warning" />
              <span className="tnum font-medium text-foreground">{product.rating.toFixed(1)}</span>
              <a href="#reviews" className="hover:text-foreground hover:underline">
                {product.reviewCount} reviews
              </a>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="tnum text-3xl font-semibold">{formatPrice(unitPrice)}</p>
            {compareAt && compareAt > unitPrice && (
              <p className="tnum text-lg text-muted-foreground line-through">{formatPrice(compareAt)}</p>
            )}
          </div>

          <p className="max-w-prose leading-relaxed text-muted-foreground">{product.shortDescription}</p>

          <Separator />

          {product.variants.length > 1 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">Option</span>
              <Select
                items={product.variants.map((v) => ({ label: v.name, value: v.id }))}
                value={variantId}
                onValueChange={(value) => setVariantId(value ?? variantId)}
              >
                <SelectTrigger className="w-52" aria-label="Product option">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((v) => (
                    <SelectItem key={v.id} value={v.id} disabled={!v.inStock}>
                      {v.name}
                      {!v.inStock && " — out of stock"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md border">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="px-3 py-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <MinusIcon className="size-4" />
              </button>
              <span className="tnum min-w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="px-3 py-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              >
                <PlusIcon className="size-4" />
              </button>
            </div>
            <Button size="lg" className="flex-1" disabled={!variant?.inStock} onClick={handleAddToCart}>
              Add to cart · {formatPrice(unitPrice * quantity)}
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              onClick={() => toggle(product.id)}
            >
              <HeartIcon className={cn("size-4.5", wishlisted && "fill-primary text-primary")} />
            </Button>
          </div>

          <ul className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm">
            <li className="flex items-center gap-2.5">
              <TruckIcon className="size-4 shrink-0 text-primary" />
              Free standard shipping on orders over $150
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheckIcon className="size-4 shrink-0 text-primary" />
              2-year warranty and 30-day returns included
            </li>
          </ul>
        </div>
      </div>

      <Tabs defaultValue="overview" id="reviews">
        <TabsList className="w-full max-w-md sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="box">In the box</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <div className="grid max-w-4xl gap-8 lg:grid-cols-[1.5fr_1fr]">
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            <div>
              <p className="pb-3 text-sm font-semibold">Highlights</p>
              <ul className="flex flex-col gap-2">
                {product.features.slice(0, 5).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="pt-6">
          <div className="grid max-w-4xl gap-x-12 gap-y-6 sm:grid-cols-2">
            {specCategories.map((categoryName) => (
              <section key={categoryName} aria-label={categoryName}>
                <p className="pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {categoryName}
                </p>
                <dl className="flex flex-col divide-y text-sm">
                  {product.specs
                    .filter((s) => s.category === categoryName)
                    .map((spec) => (
                      <div key={`${spec.category}-${spec.name}`} className="flex justify-between gap-4 py-2">
                        <dt className="text-muted-foreground">{spec.name}</dt>
                        <dd className="text-right font-medium">{spec.value}</dd>
                      </div>
                    ))}
                </dl>
              </section>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="box" className="pt-6">
          <ul className="grid max-w-xl gap-2 text-sm">
            {product.inTheBox.map((item) => (
              <li key={item} className="flex items-start gap-2 text-muted-foreground">
                <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <div className="flex max-w-xl items-center gap-6 rounded-lg border bg-card p-6">
            <p className="tnum font-display text-5xl">{product.rating.toFixed(1)}</p>
            <div>
              <div className="flex gap-0.5 pb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={cn(
                      "size-4",
                      star <= Math.round(product.rating) ? "fill-warning text-warning" : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {product.reviewCount} verified reviews
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <section aria-labelledby="related-heading">
        <h2 id="related-heading" className="font-display pb-8 text-2xl tracking-tight sm:text-3xl">
          You might also like
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </div>
  )
}
