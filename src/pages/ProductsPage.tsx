import { useState, useMemo, useEffect } from "react"
import { Grid } from "@/components/ui/Grid"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { ShoppingCart, Heart, Eye, Filter, X, ChevronDown } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { useCartStore } from "@/store/cartStore"
import { useUIStore, toast } from "@/store/uiStore"
import { useWishlistIds, useWishlistActions } from "@/store/wishlistStore"
import { formatPrice, cn } from "@/lib/utils"
import { products } from "@/data/products"

const categories = ["All", "Synthesizers", "Controllers", "Audio Interfaces", "Modular", "Accessories"]
const subcategories = {
  Synthesizers: ["All", "Analog", "Digital", "Hybrid", "Modular", "Semi-Modular"],
  Controllers: ["All", "Keyboard", "Pad", "DAW", "MIDI"],
  "Audio Interfaces": ["All", "Thunderbolt", "USB", "PCIe"],
  Modular: ["All", "Oscillator", "Filter", "Envelope", "LFO", "Sequencer", "Utility"],
  Accessories: ["All", "Cables", "Stands", "Cases", "Covers", "Power"],
}

/**
 * Map the lowercase `?category=` slug used in Header/Footer/CategoriesSection/Hero
 * links to the Title-Case `product.category` value stored in the data file.
 * Footer also emits `?sort=newest|popular` and `?sale=true`; those are honored below.
 */
const CATEGORY_SLUG_TO_LABEL: Record<string, string> = {
  synthesizers: "Synthesizers",
  controllers: "Controllers",
  interfaces: "Audio Interfaces",
  modular: "Modular",
  accessories: "Accessories",
}

// Per-category accent — sourced from design tokens, never magic hex.
const CATEGORY_ACCENT: Record<string, string> = {
  Synthesizers: "var(--color-accent-cyan)",
  Controllers: "var(--color-accent-amber)",
  "Audio Interfaces": "var(--color-accent-coral)",
  Modular: "var(--color-accent-violet)",
  Accessories: "var(--color-accent-emerald)",
}
const accentFor = (category: string) => CATEGORY_ACCENT[category] ?? "var(--color-accent-cyan)"

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive filter state from the URL so Header/Footer/CategoriesSection/Hero
  // links (?category=synthesizers, ?sort=newest, ?sale=true) actually filter.
  const categoryParam = searchParams.get("category")
  const sortParam = searchParams.get("sort")
  const saleParam = searchParams.get("sale")

  const initialCategory =
    (categoryParam && CATEGORY_SLUG_TO_LABEL[categoryParam]) || "All"
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [sortBy, setSortBy] = useState(
    sortParam === "newest"
      ? "newest"
      : sortParam === "popular"
        ? "featured"
        : "featured"
  )
  const [saleOnly] = useState(saleParam === "true")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)

  // If the user navigates here via a link with a new ?category=, reflect it.
  useEffect(() => {
    setSelectedCategory(initialCategory)
    setSelectedSubcategory("All")
  }, [initialCategory])

  const { addItem, items: cartItems } = useCartStore()
  const { addToast } = useUIStore()
  const wishedIds = useWishlistIds()
  const { toggle: toggleWishlist, has: isInWishlist } = useWishlistActions()
  // Set lookup for O(1) per-card membership checks during render.
  const wishedSet = new Set(wishedIds)

  const handleSetCategory = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory("All")
    // Keep the URL in sync so the filter is shareable / survives refresh.
    if (category === "All") {
      searchParams.delete("category")
    } else {
      const slug = Object.entries(CATEGORY_SLUG_TO_LABEL).find(
        ([, label]) => label === category
      )?.[0]
      if (slug) searchParams.set("category", slug)
    }
    setSearchParams(searchParams, { replace: true })
    setVisibleCount(12)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSubcategory = selectedSubcategory === "All" || product.subcategory === selectedSubcategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSale = !saleOnly || product.salePrice !== undefined
      return matchesCategory && matchesSubcategory && matchesSearch && matchesSale
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price
        case "price-desc": return b.price - a.price
        case "name-asc": return a.name.localeCompare(b.name)
        case "name-desc": return b.name.localeCompare(a.name)
        case "newest": return b.id.localeCompare(a.id)
        default: return b.featured === a.featured ? 0 : b.featured ? 1 : -1
      }
    })
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy, saleOnly])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = filteredProducts.length > visibleCount

  const handleAddToCart = (product: typeof products[0]) => {
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

  const handleWishlist = (product: typeof products[0]) => {
    const wasWishlisted = isInWishlist(product.id)
    toggleWishlist(product.id)
    if (wasWishlisted) {
      toast.info("Removed from wishlist", `${product.name} removed from your wishlist.`)
    } else {
      toast.success("Saved to wishlist", `${product.name} added to your wishlist.`)
    }
  }

  const handleQuickView = (product: typeof products[0]) => {
    addToast({
      type: "info",
      title: product.name,
      description: "Quick view — open the product page for the full 3D experience.",
    })
  }

  const handleClearFilters = () => {
    setSelectedCategory("All")
    setSelectedSubcategory("All")
    setSearchQuery("")
    searchParams.delete("category")
    searchParams.delete("sale")
    setSearchParams(searchParams, { replace: true })
    setVisibleCount(12)
  }

  const hasActiveFilters =
    selectedCategory !== "All" || selectedSubcategory !== "All" || !!searchQuery || saleOnly

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Page Header */}
      <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)]">
        <div className="container py-10 lg:py-16">
          <div className="max-w-4xl">
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-[var(--color-fg-primary)] mb-3">
              Products
            </h1>
            <p className="text-[var(--color-fg-secondary)] text-lg">
              Browse our curated selection of {filteredProducts.length} professional music electronics
            </p>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)] sticky top-16 z-50">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
              <div className="relative flex-1 max-w-xs">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-fg-muted)]" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                  aria-label="Search products"
                />
              </div>

              <Select
                value={selectedCategory}
                onChange={(e) => handleSetCategory(e.target.value)}
                options={categories.map((c) => ({ value: c, label: c }))}
                className="w-full sm:w-40 h-10"
                placeholder="Category"
              />

              <Select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                options={subcategories[selectedCategory as keyof typeof subcategories]?.map((s) => ({ value: s, label: s })) || []}
                className="w-full sm:w-40 h-10"
                placeholder="Subcategory"
              />
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-3">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: "featured", label: "Featured" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "name-asc", label: "Name: A-Z" },
                  { value: "name-desc", label: "Name: Z-A" },
                  { value: "newest", label: "Newest" },
                ]}
                className="w-44 h-10 hidden sm:block"
                placeholder="Sort"
              />

              <div className="flex items-center border border-[var(--color-border-default)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
                  )}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors border-l border-[var(--color-border-default)]",
                    viewMode === "list"
                      ? "bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]"
                  )}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round" />
                    <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-amber)] font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full py-3 border-t border-[var(--color-border-subtle)] flex items-center justify-center gap-2 text-sm font-medium text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)]"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
          </button>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
              <div className="space-y-4">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={categories.map((c) => ({ value: c, label: c }))}
                  className="w-full"
                  placeholder="Category"
                />
                <Select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  options={subcategories[selectedCategory as keyof typeof subcategories]?.map((s) => ({ value: s, label: s })) || []}
                  className="w-full"
                  placeholder="Subcategory"
                />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <main className="container py-10 lg:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-[var(--color-fg-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h2 className="font-display font-semibold text-2xl text-[var(--color-fg-primary)] mb-2">
              No products found
            </h2>
            <p className="text-[var(--color-fg-secondary)] mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={handleClearFilters}
              className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-amber)] font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[var(--color-fg-secondary)] text-sm">
                Showing {visibleProducts.length} of {filteredProducts.length}
                {filteredProducts.length !== products.length && ` (of ${products.length})`} products
              </p>
            </div>

            <Grid
              columns={viewMode === "list" ? { base: 1, lg: 2 } : { base: 1, sm: 2, lg: 3 }}
              gap="lg"
              className={viewMode === "list" ? "max-w-4xl mx-auto" : ""}
            >
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                  onWishlist={handleWishlist}
                  onQuickView={handleQuickView}
                  inCart={cartItems.some((item) => item.productId === product.id)}
                  inWishlist={wishedSet.has(product.id)}
                />
              ))}
            </Grid>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => setVisibleCount((c) => c + 12)}
                >
                  Load More Products
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function ProductCard({
  product,
  viewMode,
  onAddToCart,
  onWishlist,
  onQuickView,
  inCart,
  inWishlist,
}: {
  product: (typeof products)[0]
  viewMode: "grid" | "list"
  onAddToCart: (product: (typeof products)[0]) => void
  onWishlist: (product: (typeof products)[0]) => void
  onQuickView: (product: (typeof products)[0]) => void
  inCart: boolean
  inWishlist: boolean
}) {
  const isList = viewMode === "list"
  const accent = accentFor(product.category)

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <Card variant="interactive" className={cn("flex flex-col h-full overflow-hidden", isList && "flex-row")}>
        {/* Product Image / 3D Placeholder */}
        <div className={cn(
          "relative overflow-hidden bg-[var(--color-bg-tertiary)] flex-shrink-0",
          isList ? "w-64 lg:w-72" : "aspect-square"
        )}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-2xl opacity-25"
              style={{
                background: `linear-gradient(135deg, ${accent}, transparent)`,
                boxShadow: `0 0 48px -8px ${accent}`,
              }}
            />
          </div>

          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="primary" className="text-xs">
                {product.badge}
              </Badge>
            </div>
          )}

          {product.salePrice && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="warning" className="text-xs">
                Save {formatPrice(product.price - product.salePrice!)}
              </Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm"
              aria-label="Quick view"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product) }}
            >
              <Eye className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm transition-colors",
                inWishlist && "text-[var(--color-accent-coral)] hover:text-[var(--color-accent-coral)]"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={inWishlist}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlist(product) }}
            >
              <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>

        <CardContent className={cn("flex flex-col flex-1 p-5", isList && "justify-between")}>
          <div>
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

            <p className="text-[var(--color-fg-secondary)] text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className={cn("flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]", isList && "flex-col items-end gap-3")}>
            <div className="flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="font-display font-bold text-xl text-[var(--color-fg-primary)]">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-[var(--color-fg-muted)] line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-display font-bold text-xl text-[var(--color-fg-primary)]">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <Button
              variant={inCart ? "secondary" : "primary"}
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!inCart) {
                  onAddToCart(product)
                }
              }}
              className="gap-1"
            >
              {inCart ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}