import { useMemo, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { SearchIcon, SlidersHorizontalIcon, XIcon, ChevronRightIcon } from "lucide-react"
import { getAllProducts, PRODUCT_CATEGORIES } from "@/data/products"
import type { ProductCategory } from "@/types"
import { ProductCard } from "@/components/catalog/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type SortOption = "featured" | "name" | "price-asc" | "price-desc"

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "name", label: "Name (A–Z)" },
  { id: "price-asc", label: "Price (Low to High)" },
  { id: "price-desc", label: "Price (High to Low)" },
]

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const activeCategory = searchParams.get("category") as ProductCategory | null
  const searchQuery = searchParams.get("q") ?? ""
  const activeSort = (searchParams.get("sort") as SortOption) ?? "featured"

  const allProducts = useMemo(() => getAllProducts(), [])

  const filteredProducts = useMemo(() => {
    let result = allProducts

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      )
    }

    const sorted = [...result]
    switch (activeSort) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "price-asc":
        return sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
      case "price-desc":
        return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
      default:
        return sorted.sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [allProducts, activeCategory, searchQuery, activeSort])

  function handleCategoryChange(cat: string | null) {
    const next = new URLSearchParams(searchParams)
    if (cat) {
      next.set("category", cat)
    } else {
      next.delete("category")
    }
    setSearchParams(next)
  }

  function handleSearchChange(val: string) {
    const next = new URLSearchParams(searchParams)
    if (val.trim()) {
      next.set("q", val)
    } else {
      next.delete("q")
    }
    setSearchParams(next)
  }

  function handleSortChange(sort: string | null) {
    if (!sort) return
    const next = new URLSearchParams(searchParams)
    next.set("sort", sort)
    setSearchParams(next)
  }

  function handleClearFilters() {
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters = Boolean(activeCategory || searchQuery)

  return (
    <div className="container-page flex flex-col gap-8 py-8 sm:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Audio Equipment &amp; Components
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Curated selection of speakers, amplifiers, subwoofers, and installation hardware supplied and recommended by VIVA Business Team in Kottakkal.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search equipment…"
            aria-label="Search equipment"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden gap-1.5" />}>
              <SlidersHorizontalIcon className="size-3.5" />
              Categories
              {activeCategory && <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">1</span>}
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetTitle>Categories</SheetTitle>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  variant={!activeCategory ? "default" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    handleCategoryChange(null)
                    setMobileFiltersOpen(false)
                  }}
                >
                  All Categories
                </Button>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      handleCategoryChange(cat)
                      setMobileFiltersOpen(false)
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">Sort:</span>
            <Select value={activeSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden flex-col gap-4 lg:flex">
          <div className="flex items-center justify-between pb-2 border-b">
            <h2 className="text-sm font-semibold">Categories</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleCategoryChange(null)}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors text-left ${
                !activeCategory
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              All Categories
              <span className="text-xs text-muted-foreground">{allProducts.length}</span>
            </button>
            {PRODUCT_CATEGORIES.map((cat) => {
              const count = allProducts.filter((p) => p.category === cat).length
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors text-left ${
                    activeCategory === cat
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                  <span className="text-xs text-muted-foreground">{count}</span>
                </button>
              )
            })}
          </div>
        </aside>

        <main className="flex flex-col gap-6">
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {activeCategory && (
                <span className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-2.5 py-0.5 text-xs">
                  {activeCategory}
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(null)}
                    aria-label={`Remove ${activeCategory} filter`}
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-2.5 py-0.5 text-xs">
                  &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    aria-label="Remove search filter"
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-6 px-2 text-xs text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
              <p className="font-semibold">No equipment found</p>
              <p className="max-w-md text-sm text-muted-foreground">
                We couldn&apos;t find any products matching your current filter criteria.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
