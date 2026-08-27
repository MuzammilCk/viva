import { useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ChevronRightIcon,
  PhoneIcon,
  MessageCircleIcon,
  CheckCircle2Icon,
  LayersIcon,
  PackageIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react"
import { getProductBySlug, getRelatedProducts } from "@/data/products"
import { BUSINESS_CONFIG } from "@/config/business"
import { formatProductPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductCard } from "@/components/catalog/ProductCard"

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const product = useMemo(() => (slug ? getProductBySlug(slug) : undefined), [slug])

  if (!product) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-display text-3xl font-semibold">Product not found</h1>
        <p className="text-muted-foreground">The requested audio equipment could not be found.</p>
        <Button onClick={() => navigate("/products")}>Browse Catalog</Button>
      </div>
    )
  }

  const related = getRelatedProducts(product)
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    `Hi VIVA team, I would like to inquire about ${product.name} (${product.brand} - ${product.model}).`
  )}`

  return (
    <div className="container-page flex flex-col gap-10 py-8 sm:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/products" />}>Products</BreadcrumbLink>
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
        {/* Media / Photo Section */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border bg-muted/20 p-6 sm:p-10">
            <div className="aspect-[4/3] flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-gradient-to-b from-muted/50 to-muted/20 p-8 text-center select-none">
                  <div className="flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-background/90 text-muted-foreground shadow-xs">
                    <PackageIcon className="size-8 stroke-[1.25]" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {product.category}
                    </span>
                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                    <span className="text-xs text-muted-foreground/70">
                      Product photography to be updated — contact VIVA for actual unit photos &amp; live inspection
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 rounded-lg border bg-card p-3">
              <WrenchIcon className="mt-0.5 size-4 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground">Professional Installation</p>
                <p className="text-muted-foreground">Custom integration &amp; tuning available in Kottakkal</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-lg border bg-card p-3">
              <ShieldCheckIcon className="mt-0.5 size-4 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground">Specialist Guidance</p>
                <p className="text-muted-foreground">Direct recommendation from our experienced audio technician</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details & Direct CTAs */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.featured && <Badge>Featured</Badge>}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {product.brand} · Model: {product.model}
            </p>

            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pricing &amp; Availability
            </p>
            <p className="tnum mt-1 text-2xl font-bold text-foreground">
              {formatProductPrice(product.price)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Consult with our technician in Kottakkal for current stock availability, system matching, and installation options.
            </p>
          </div>

          {product.description && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Overview</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {product.useCases && product.useCases.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Recommended Applications</h2>
              <div className="flex flex-wrap gap-2">
                {product.useCases.map((uc) => (
                  <span
                    key={uc}
                    className="inline-flex items-center gap-1.5 rounded-md border bg-secondary/40 px-2.5 py-1 text-xs text-secondary-foreground"
                  >
                    <CheckCircle2Icon className="size-3.5 text-primary" />
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs: Direct Call / WhatsApp */}
          <div className="flex flex-col gap-3 pt-2">
            <h2 className="text-sm font-semibold">Direct Consultation &amp; Enquiries</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 gap-2"
                render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
              >
                <MessageCircleIcon className="size-4" />
                Ask on WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2"
                render={<a href={BUSINESS_CONFIG.contact.phone.tel} />}
              >
                <PhoneIcon className="size-4" />
                Call ({BUSINESS_CONFIG.contact.phone.display})
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              Direct expert support · No intermediaries · Located in Kottakkal, Kerala
            </p>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && product.specs.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 border-t pt-8">
          <div className="flex items-center gap-2">
            <LayersIcon className="size-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Technical Specifications</h2>
          </div>
          <div className="overflow-hidden rounded-lg border bg-card">
            <table className="w-full text-left text-sm">
              <tbody>
                {product.specs.map((spec, idx) => (
                  <tr
                    key={spec.name}
                    className={idx % 2 === 0 ? "bg-muted/30" : "bg-card"}
                  >
                    <td className="w-1/3 px-4 py-3 font-medium text-foreground">{spec.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-8 flex flex-col gap-6 border-t pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Related Audio Equipment</h2>
            <Button
              variant="ghost"
              size="sm"
              render={<Link to={`/products?category=${encodeURIComponent(product.category)}`} />}
            >
              View more {product.category}
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
