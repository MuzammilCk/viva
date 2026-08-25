import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"
import { getAllProducts, getCategorySummaries } from "@/data/products"
import type { PaginatedProducts, ProductCategory, ProductFilters, ProductSortOption } from "@/types"
import { ProductCard } from "@/components/catalog/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const PAGE_SIZE = 9

const SORT_OPTIONS: ProductSortOption[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
  { id: "name", label: "Name A–Z" },
]

function queryToFilters(params: URLSearchParams): ProductFilters {
  const category = params.get("category")
  return {
    categories: category ? [category as ProductCategory] : undefined,
    search: params.get("q") ?? undefined,
    onSaleOnly: params.get("sale") === "1",
  }
}

function applyQuery(
  products: ReturnType<typeof getAllProducts>,
  filters: ProductFilters
): ReturnType<typeof getAllProducts> {
  let result = products

  if (filters.categories?.length) {
    result = result.filter((p) => filters.categories?.includes(p.category))
  }
  if (filters.onSaleOnly) {
    result = result.filter((p) => Boolean(p.salePrice))
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter((p) =>
      `${p.name} ${p.brand} ${p.category} ${p.shortDescription}`.toLowerCase().includes(q)
    )
  }
  return result
}

function sortProducts(
  products: ReturnType<typeof getAllProducts>,
  sort: ProductSortOption["id"]
): ReturnType<typeof getAllProducts> {
  const sorted = [...products]
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    case "price-desc":
      return sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured))
  }
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filters = useMemo(() => queryToFilters(searchParams), [searchParams])
  const sort = (searchParams.get("sort") as ProductSortOption["id"]) ?? "featured"
  const searchValue = searchParams.get("q") ?? ""

  const results = useMemo(() => {
    const filtered = applyQuery(getAllProducts(), filters)
    return sortProducts(filtered, sort)
  }, [filters, sort])

  const paginated: PaginatedProducts = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    return {
      items: results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
      total: results.length,
      page: safePage,
      pageSize: PAGE_SIZE,
      totalPages,
    }
  }, [results, page])

  function updateParam(key: string, value?: string) {
    setSearchParams(
      (prev) => {
        if (value) prev.set(key, value)
        else prev.delete(key)
        return prev
      },
      { replace: true }
    )
    setPage(1)
  }

  const activeCategory = filters.categories?.[0]
  const hasActiveFilters = Boolean(activeCategory || filters.search || filters.onSaleOnly)

  const filterPanel = (
    <FilterPanel
      activeCategory={activeCategory}
      onSaleOnly={filters.onSaleOnly ?? false}
      onCategoryChange={(category) => updateParam("category", category)}
      onSaleChange={(checked) => updateParam("sale", checked ? "1" : undefined)}
      onClear={() => {
        setSearchParams(searchValue ? { q: searchValue } : {}, { replace: true })
        setPage(1)
      }}
      showClear={hasActiveFilters}
    />
  )

  return (
    <div className="container-page flex flex-col gap-8 py-10 sm:py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          {activeCategory ?? "All products"}
        </h1>
        <p className="text-muted-foreground">
          {paginated.total} product{paginated.total === 1 ? "" : "s"}
          {filters.search ? ` matching “${filters.search}”` : ""}
          {filters.onSaleOnly ? " on sale" : ""}
        </p>
      </header>

      <Separator />

      <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Product filters" className="hidden lg:block">
          {filterPanel}
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search gear…"
                value={searchValue}
                onChange={(event) => updateParam("q", event.target.value || undefined)}
                className="pl-9"
                aria-label="Search products"
              />
            </div>
            <div className="flex items-center gap-2">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger
                  render={<Button variant="outline" size="sm" className="gap-2 lg:hidden" />}
                >
                  <SlidersHorizontalIcon className="size-4" />
                  Filters
                </SheetTrigger>
                <SheetContent side="left" className="w-72 overflow-y-auto">
                  <SheetTitle className="sr-only">Product filters</SheetTitle>
                  {filterPanel}
                </SheetContent>
              </Sheet>
              <Select
                items={SORT_OPTIONS.map((option) => ({ label: option.label, value: option.id }))}
                value={sort}
                onValueChange={(value) => updateParam("sort", (value as ProductSortOption["id"]) ?? undefined)}
              >
                <SelectTrigger className="w-44" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {paginated.items.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <XIcon />
                </EmptyMedia>
                <EmptyTitle>No products found</EmptyTitle>
                <EmptyDescription>
                  Try a different search or clear your filters to see the full catalog.
                </EmptyDescription>
              </EmptyHeader>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchParams({}, { replace: true })
                  setPage(1)
                }}
              >
                Clear all filters
              </Button>
            </Empty>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {paginated.totalPages > 1 && (
                <Pagination className="pt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#previous"
                        onClick={(event) => {
                          event.preventDefault()
                          setPage((current) => Math.max(1, current - 1))
                        }}
                        aria-disabled={paginated.page <= 1}
                        className={paginated.page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: paginated.totalPages }, (_, i) => i + 1).map((n) => (
                      <PaginationItem key={n}>
                        <PaginationLink
                          href={`#page-${n}`}
                          isActive={n === paginated.page}
                          onClick={(event) => {
                            event.preventDefault()
                            setPage(n)
                          }}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#next"
                        onClick={(event) => {
                          event.preventDefault()
                          setPage((current) => Math.min(paginated.totalPages, current + 1))
                        }}
                        aria-disabled={paginated.page >= paginated.totalPages}
                        className={
                          paginated.page >= paginated.totalPages ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface FilterPanelProps {
  activeCategory?: ProductCategory
  onSaleOnly: boolean
  onCategoryChange: (category?: string) => void
  onSaleChange: (checked: boolean) => void
  onClear: () => void
  showClear: boolean
}

function FilterPanel({
  activeCategory,
  onSaleOnly,
  onCategoryChange,
  onSaleChange,
  onClear,
  showClear,
}: FilterPanelProps) {
  const summaries = getCategorySummaries()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Filters</p>
        {showClear && (
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={onClear}>
            Clear all
          </Button>
        )}
      </div>

      <fieldset>
        <legend className="pb-3 text-sm font-medium">Category</legend>
        <RadioGroup value={activeCategory ?? ""} onValueChange={(value) => onCategoryChange(value || undefined)}>
          <div className="flex items-center gap-2 py-1">
            <RadioGroupItem value="" id="cat-all" />
            <Label htmlFor="cat-all" className="font-normal">
              All categories
            </Label>
          </div>
          {summaries.map(({ category, count }) => (
            <div key={category} className="flex items-center gap-2 py-1">
              <RadioGroupItem value={category} id={`cat-${category}`} />
              <Label htmlFor={`cat-${category}`} className="flex-1 font-normal">
                {category}
              </Label>
              <span className="tnum text-xs text-muted-foreground">{count}</span>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      <Separator />

      <div className="flex items-center gap-2">
        <Checkbox
          id="on-sale"
          checked={onSaleOnly}
          onCheckedChange={(checked) => onSaleChange(checked === true)}
        />
        <Label htmlFor="on-sale" className="font-normal">
          On sale only
        </Label>
      </div>
    </div>
  )
}
