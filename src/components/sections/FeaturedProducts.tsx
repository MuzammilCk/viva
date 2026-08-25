import { useCallback, useEffect, useRef, useState } from "react"
import { Stage } from "@react-three/drei"
import { Suspense } from "react"
import { Grid } from "@/components/ui/Grid"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ShoppingCart, Heart, Eye, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatPrice, cn } from "@/lib/utils"
import { getFeaturedProducts, type ProductData } from "@/data/products"
import { useCartStore } from "@/store/cartStore"
import { useUIStore, toast } from "@/store/uiStore"
import { useWishlisted, useWishlistActions } from "@/store/wishlistStore"
import { ThreeCanvas } from "@/components/three/Canvas"
import { SynthesizerModel } from "@/components/three/models/products/SynthesizerModel"
import { MidiControllerModel } from "@/components/three/models/products/MidiControllerModel"
import { AudioInterfaceModel } from "@/components/three/models/products/AudioInterfaceModel"
import { EurorackModuleModel } from "@/components/three/models/products/EurorackModuleModel"

// Per-category accent — sourced from design tokens, never magic hex.
const CATEGORY_ACCENT: Record<string, string> = {
  Synthesizers: "var(--color-accent-cyan)",
  Controllers: "var(--color-accent-amber)",
  "Audio Interfaces": "var(--color-accent-coral)",
  Modular: "var(--color-accent-violet)",
  Accessories: "var(--color-accent-emerald)",
}

function ProductModel({ modelType }: { modelType: ProductData["modelType"] }) {
  switch (modelType) {
    case "synthesizer":
      return <SynthesizerModel />
    case "controller":
      return <MidiControllerModel />
    case "interface":
      return <AudioInterfaceModel />
    case "modular":
      return <EurorackModuleModel />
    default:
      return null
  }
}

/**
 * Lazy 3D thumbnail. Mounts a Three canvas only when scrolled near the
 * viewport, and uses `frameloop="demand"` so a static model renders a single
 * frame then stops — 6 cards cost ~one draw each, not six continuous loops.
 */
function ProductThumb3D({ product }: { product: ProductData }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || active) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: "200px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [active])

  const accent = CATEGORY_ACCENT[product.category] ?? "var(--color-accent-cyan)"

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      {/* Ambient accent glow behind the model */}
      <div
        className="absolute inset-6 rounded-full opacity-25 blur-2xl"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
        aria-hidden="true"
      />
      {active && product.modelType !== "accessory" && (
        <ThreeCanvas
          className="absolute inset-0"
          camera={{ fov: 35, position: [0, 1.2, 4.5] }}
          shadows={false}
          frameloop="demand"
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 4, 2]} intensity={1.1} />
          <Suspense fallback={null}>
            <Stage
              preset="rembrandt"
              intensity={0.7}
              environment="city"
              shadows={{ type: "contact", opacity: 0.18, scale: 8 }}
            >
              <ProductModel modelType={product.modelType} />
            </Stage>
          </Suspense>
        </ThreeCanvas>
      )}
      {/* Fallback for accessories (no 3D model) — refined token gradient tile */}
      {product.modelType === "accessory" && (
        <div
          className="relative h-28 w-28 rounded-2xl border border-[var(--color-border-subtle)] backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 24%, transparent), transparent)`,
            boxShadow: `0 0 24px color-mix(in srgb, ${accent} 28%, transparent)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export function FeaturedProducts() {
  const products = getFeaturedProducts().slice(0, 6)

  return (
    <section
      className="py-20 lg:py-28 bg-[var(--color-bg-secondary)]"
      aria-labelledby="featured-heading"
    >
      <div className="container">
        {/* Section header — eyebrow + refined subtitle + affordanced link */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="text-[var(--color-accent-cyan)] tracking-[0.2em] text-xs font-medium uppercase mb-3 block">
              Curated
            </span>
            <h2
              id="featured-heading"
              className="font-display font-bold text-4xl lg:text-5xl text-[var(--color-fg-primary)] mb-3 tracking-tight"
            >
              Featured Products
            </h2>
            <p className="text-lg text-[var(--color-fg-secondary)] leading-relaxed">
              Hand-picked instruments loved by our community of synthesists and
              sound designers.
            </p>
          </div>
          <a
            href="/products"
            className="group inline-flex items-center gap-2 text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-amber)] font-medium transition-colors self-start sm:self-end"
          >
            View All Products
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap="lg">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: ProductData }) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const inCart = useCartStore((s) =>
    s.items.some((i) => i.productId === product.id)
  )
  const isWishlisted = useWishlisted(product.id)
  const { toggle: toggleWishlist } = useWishlistActions()
  const { addToast } = useUIStore()
  const price = product.salePrice ?? product.price
  const hasSale = Boolean(product.salePrice)

  const stop = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      stop(e)
      addItem({ productId: product.id, variantId: "default", quantity: 1 })
      addToast({
        type: "success",
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    },
    [stop, addItem, product.id, product.name, addToast]
  )

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      stop(e)
      navigate(`/products/${product.slug}`)
    },
    [stop, navigate, product.slug]
  )

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      stop(e)
      toggleWishlist(product.id)
      if (isWishlisted) {
        toast.info("Removed from wishlist", `${product.name} removed from your wishlist.`)
      } else {
        toast.success("Saved to wishlist", `${product.name} added to your wishlist.`)
      }
    },
    [stop, toggleWishlist, isWishlisted, product.id, product.name]
  )

  return (
    <Card
      variant="interactive"
      className="group h-full flex flex-col overflow-hidden"
      // The whole card is a click affordance to the detail page, but the icon
      // buttons below call stopPropagation so they act independently.
    >
      {/* Product 3D preview */}
      <button
        type="button"
        onClick={handleQuickView}
        aria-label={`View ${product.name} details`}
        className="relative aspect-square block w-full overflow-hidden bg-[var(--color-bg-tertiary)] cursor-pointer text-left"
      >
        <ProductThumb3D product={product} />

        {product.badge && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <Badge variant="primary" className="text-xs">
              {product.badge}
            </Badge>
          </div>
        )}

        {hasSale && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <Badge variant="warning" className="text-xs">
              Save {formatPrice(product.price - (product.salePrice ?? 0))}
            </Badge>
          </div>
        )}

        {/* bottom fade for legibility on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      <CardContent className="flex-1 flex flex-col p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          {product.subcategory && (
            <Badge variant="outline" className="text-xs opacity-70">
              {product.subcategory}
            </Badge>
          )}
        </div>

        <h3 className="font-display font-semibold text-lg text-[var(--color-fg-primary)] mb-1 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-[var(--color-fg-secondary)] text-sm mb-3 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-baseline gap-2">
            {hasSale ? (
              <>
                <span className="font-display font-bold text-xl text-[var(--color-fg-primary)]">
                  {formatPrice(price)}
                </span>
                <span className="text-[var(--color-fg-muted)] line-through text-sm">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-display font-bold text-xl text-[var(--color-fg-primary)]">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Quick actions — elevated icon buttons with stopPropagation */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleQuickView}
              aria-label={`Quick view ${product.name}`}
              className="h-9 w-9"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWishlist}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isWishlisted}
              className={cn(
                "h-9 w-9 transition-colors",
                isWishlisted && "text-[var(--color-accent-coral)] hover:text-[var(--color-accent-coral)]"
              )}
            >
              <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
            </Button>
            <Button
              variant={inCart ? "secondary" : "primary"}
              size="sm"
              onClick={handleAddToCart}
              className="gap-1"
              aria-label={`Add ${product.name} to cart`}
            >
              {inCart ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span className="sr-only">{inCart ? "In cart" : "Add to cart"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
