import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Grid } from "@/components/ui/Grid"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { ShoppingCart, Heart, RotateCcw, CheckCircle, Box, Share2, Truck, Shield } from "lucide-react"
import { ThreeCanvas } from "@/components/three/Canvas"
import { StudioLighting } from "@/components/three/Lighting"
import { CameraControls } from "@/components/three/CameraControls"
import { SynthesizerModel } from "@/components/three/models/products/SynthesizerModel"
import { MidiControllerModel } from "@/components/three/models/products/MidiControllerModel"
import { AudioInterfaceModel } from "@/components/three/models/products/AudioInterfaceModel"
import { formatPrice, cn } from "@/lib/utils"
import { useCartStore } from "@/store/cartStore"
import { useUIStore, toast } from "@/store/uiStore"
import { useWishlisted, useWishlistActions } from "@/store/wishlistStore"
import { products, getProductBySlug } from "@/data/products"
import { Suspense } from "react"

// Per-category accent — sourced from design tokens. Reused by gallery thumbnails
// and the related-product swatch so we never hardcode hex literals in JSX.
const MODEL_ACCENT: Record<string, string> = {
  Synthesizers: "var(--color-accent-cyan)",
  Controllers: "var(--color-accent-amber)",
  "Audio Interfaces": "var(--color-accent-coral)",
  Modular: "var(--color-accent-violet)",
  Accessories: "var(--color-accent-emerald)",
}
const accentStyle = (category: string): { background: string; boxShadow: string } => {
  const accent = MODEL_ACCENT[category] ?? "var(--color-accent-cyan)"
  return {
    background: `linear-gradient(135deg, ${accent}, transparent)`,
    boxShadow: `0 0 48px -10px ${accent}`,
  }
}

// Reverse of ProductsPage.CATEGORY_SLUG_TO_LABEL — for the breadcrumb link.
const categorySlug = (category: string): string => {
  if (category === "Audio Interfaces") return "interfaces"
  return category.toLowerCase().replace(/\s+/g, "-")
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const product = slug ? getProductBySlug(slug) : null
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedColorScheme, setSelectedColorScheme] = useState("dark")
  const [viewMode, setViewMode] = useState<string>("orbit")
  const [explodeFactor, setExplodeFactor] = useState(0)

  const { addItem } = useCartStore()
  const { addToast } = useUIStore()
  // Hooks must run unconditionally, so the membership check subscribes with a
  // safe placeholder id when there's no product (early-return path). Returns
  // false harmlessly and keeps hook order stable across renders.
  const isWishlisted = useWishlisted(product?.id ?? "")
  const { toggle: toggleWishlist, has: isInWishlist } = useWishlistActions()

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display font-bold text-3xl text-[var(--color-fg-primary)] mb-4">
          Product Not Found
        </h1>
        <p className="text-[var(--color-fg-secondary)] mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/products")}>Browse All Products</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: "default",
      quantity: 1,
    })
    addToast({
      type: "success",
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlist = () => {
    const wasWishlisted = isInWishlist(product.id)
    toggleWishlist(product.id)
    if (wasWishlisted) {
      toast.info("Removed from wishlist", `${product.name} removed from your wishlist.`)
    } else {
      toast.success("Saved to wishlist", `${product.name} added to your wishlist.`)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        addToast({
          type: "success",
          title: "Link copied",
          description: "Product link copied to clipboard.",
        })
      }
    } catch {
      // user dismissed the share sheet or clipboard was blocked — stay quiet
    }
  }

  const price = product.salePrice || product.price
  const originalPrice = product.salePrice ? product.price : null

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Breadcrumb */}
      <nav className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]" aria-label="Breadcrumb">
        <div className="container px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
            <li><Link to="/" className="hover:text-[var(--color-accent-cyan)]">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-[var(--color-accent-cyan)]">Products</Link></li>
            <li>/</li>
            <li><Link to={`/products?category=${categorySlug(product.category)}`} className="hover:text-[var(--color-accent-cyan)]">{product.category}</Link></li>
            <li>/</li>
            <li className="text-[var(--color-fg-primary)] truncate max-w-[200px]">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8 lg:py-12">
        <Grid columns={{ base: 1, lg: 2 }} gap="xl">
          {/* 3D Viewer */}
          <div className="lg:sticky lg:top-24 lg:h-[600px]">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-full h-full">
              <TabsList className="mb-4 bg-[var(--color-bg-tertiary)] p-1 rounded-lg">
                <TabsTrigger value="orbit" className="px-4 py-2">
                  <RotateCcw className="w-4 h-4 mr-2" /> Orbit
                </TabsTrigger>
                <TabsTrigger value="explode" className="px-4 py-2">
                  <Box className="w-4 h-4 mr-2" /> Exploded
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orbit" className="h-[calc(100%-50px)]">
                <ThreeCanvas
                  className="w-full h-full rounded-xl bg-[var(--color-bg-tertiary)]"
                  camera={{ position: [0, 1.5, 4], fov: 45 }}
                  shadows
                >
                  <StudioLighting intensity={1.2} />
                  <CameraControls
                    enableDamping
                    dampingFactor={0.05}
                    autoRotate={true}
                    autoRotateSpeed={0.3}
                    minDistance={2}
                    maxDistance={10}
                    minPolarAngle={0.2}
                    maxPolarAngle={Math.PI / 2 - 0.1}
                  />
                  <Suspense fallback={<ViewerSkeleton />}>
                    <Product3DViewer
                      modelType={product.modelType}
                      colorScheme={selectedColorScheme}
                    />
                  </Suspense>
                </ThreeCanvas>
              </TabsContent>

              <TabsContent value="explode" className="h-[calc(100%-50px)]">
                <div className="w-full h-full rounded-xl bg-[var(--color-bg-tertiary)] flex flex-col">
                  <ThreeCanvas
                    className="flex-1 rounded-t-xl"
                    camera={{ position: [0, 1.5, 4], fov: 45 }}
                    shadows
                  >
                    <StudioLighting intensity={1.2} />
                    <CameraControls
                      enableDamping
                      dampingFactor={0.05}
                      minDistance={2}
                      maxDistance={15}
                    />
                    <Suspense fallback={<ViewerSkeleton />}>
                      <Product3DViewer
                        modelType={product.modelType}
                        colorScheme={selectedColorScheme}
                        exploded
                        explodeFactor={explodeFactor}
                      />
                    </Suspense>
                  </ThreeCanvas>
                  <div className="p-4 border-t border-[var(--color-border-subtle)]">
                    <label className="flex items-center gap-3 text-sm text-[var(--color-fg-secondary)]">
                      Explode: <span className="w-32">{Math.round(explodeFactor * 100)}%</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={explodeFactor}
                        onChange={(e) => setExplodeFactor(Number(e.target.value))}
                        className="flex-1 accent-[var(--color-accent-cyan)]"
                      />
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Color Scheme Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-[var(--color-fg-secondary)]">Color:</span>
              <div className="flex gap-2">
                {product.colorSchemes.map((scheme) => (
                  <button
                    key={scheme}
                    onClick={() => setSelectedColorScheme(scheme)}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all",
                      selectedColorScheme === scheme
                        ? "border-[var(--color-accent-cyan)] scale-110"
                        : "border-transparent hover:border-[var(--color-border-strong)]"
                    )}
                    style={{
                      backgroundColor: scheme === "dark" ? "#0a0a0f" :
                                     scheme === "vintage" ? "#2d1b0e" : "#1a1a2e",
                    }}
                    aria-label={`${scheme} color scheme`}
                    aria-pressed={selectedColorScheme === scheme}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Strip (placeholder) */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                    i === 0
                      ? "border-[var(--color-accent-cyan)]"
                      : "border-transparent hover:border-[var(--color-border-strong)]"
                  )}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === 0 ? "true" : "false"}
                >
                  <div className="w-full h-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                    <div className="w-8 h-8 rounded" style={{ ...accentStyle(product.category), opacity: 0.4 }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-sm">
                  {product.category}
                </Badge>
                {product.subcategory && (
                  <Badge variant="outline" className="text-sm opacity-70">
                    {product.subcategory}
                  </Badge>
                )}
                {product.badge && (
                  <Badge variant="primary" className="text-sm">
                    {product.badge}
                  </Badge>
                )}
              </div>

              <h1 className="font-display font-bold text-3xl lg:text-4xl text-[var(--color-fg-primary)] mb-3">
                {product.name}
              </h1>

              <p className="text-[var(--color-fg-secondary)] text-lg mb-6">
                {product.shortDescription}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-display font-bold text-3xl text-[var(--color-fg-primary)]">
                  {formatPrice(price)}
                </span>
                {originalPrice && (
                  <span className="text-[var(--color-fg-muted)] line-through text-xl">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="flex-1 min-w-[200px] gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn("gap-2 transition-colors", isWishlisted && "text-[var(--color-accent-coral)] hover:text-[var(--color-accent-coral)]")}
                  aria-pressed={isWishlisted}
                  onClick={handleWishlist}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
                </Button>
                <Button size="lg" variant="ghost" className="gap-2" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-sm text-[var(--color-fg-secondary)] border-t border-[var(--color-border-subtle)] pt-6">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--color-accent-emerald)]" />
                <span>Free shipping over $199</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--color-accent-amber)]" />
                <span>3-year warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--color-accent-violet)]" />
                <span>Expert support</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <p className="text-[var(--color-fg-secondary)] leading-relaxed">
                  {product.description}
                </p>
              </TabsContent>

              <TabsContent value="specs" className="mt-6">
                <dl className="space-y-4">
                  {Object.entries(
                    product.specs.reduce((acc, spec) => {
                      const cat = spec.category || "General"
                      if (!acc[cat]) acc[cat] = []
                      acc[cat].push(spec)
                      return acc
                    }, {} as Record<string, typeof product.specs>)
                  ).map(([category, specs]) => (
                    <div key={category} className="space-y-2">
                      <dt className="font-semibold text-[var(--color-fg-primary)] text-sm uppercase tracking-wider text-[var(--color-accent-cyan)]">
                        {category}
                      </dt>
                      <div className="grid grid-cols-2 gap-4 ml-4">
                        {specs.map((spec, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <span className="text-sm text-[var(--color-fg-muted)]">{spec.name}</span>
                            <span className="text-sm font-medium text-[var(--color-fg-primary)]">
                              {spec.value} {spec.unit || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </dl>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-primary)]/50 border border-[var(--color-border-subtle)]">
                      <CheckCircle className="w-5 h-5 text-[var(--color-accent-emerald)] flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--color-fg-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </Grid>
      </main>

      {/* Related Products */}
      <section className="py-12 lg:py-16 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-subtle)]">
        <div className="container">
          <h2 className="font-display font-bold text-3xl text-[var(--color-fg-primary)] mb-8">
            You May Also Like
          </h2>
          <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap="lg">
            {products
              .filter((p) => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map((related) => (
                <RelatedProductCard key={related.id} product={related} />
              ))}
          </Grid>
        </div>
      </section>
    </div>
  )
}

function Product3DViewer({
  modelType,
  colorScheme = "dark",
  exploded = false,
  explodeFactor = 0,
}: {
  modelType: string
  colorScheme?: string
  exploded?: boolean
  explodeFactor?: number
}) {
  switch (modelType) {
    case "synthesizer":
      return <SynthesizerModel variant="poly" colorScheme={colorScheme as any} />
    case "controller":
      return <MidiControllerModel variant="full" colorScheme={colorScheme as any} />
    case "interface":
      return <AudioInterfaceModel variant="desktop" colorScheme={colorScheme as any} />
    case "modular":
      return <SynthesizerModel variant="modular" colorScheme={colorScheme as any} />
    default:
      return <SynthesizerModel variant="poly" colorScheme={colorScheme as any} />
  }
}

function ViewerSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-tertiary)] rounded-xl">
      <div className="animate-pulse w-3/4 h-1/2 bg-[var(--color-border-default)] rounded-xl" />
    </div>
  )
}

function RelatedProductCard({ product }: { product: (typeof products)[0] }) {
  const price = product.salePrice || product.price
  const originalPrice = product.salePrice ? product.price : null

  return (
    <Link to={`/products/${product.slug}`} className="block">
      <Card variant="interactive" className="h-full flex flex-col overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-tertiary)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-xl"
              style={{ ...accentStyle(product.category), opacity: 0.25 }}
            />
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col p-4">
          <Badge variant="outline" className="text-xs mb-2">{product.category}</Badge>
          <h3 className="font-semibold text-[var(--color-fg-primary)] mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-[var(--color-fg-secondary)] text-sm mb-3 line-clamp-2 flex-1">{product.shortDescription}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg text-[var(--color-fg-primary)]">{formatPrice(price)}</span>
            {originalPrice && <span className="text-[var(--color-fg-muted)] line-through">{formatPrice(originalPrice)}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

