import { useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ChevronRightIcon,
  PhoneIcon,
  MessageCircleIcon,
  CheckCircle2Icon,
  SparklesIcon,
  WrenchIcon,
  LayersIcon,
  ArrowRightIcon,
  PackageIcon,
} from "lucide-react"
import { getProjectBySlug, getRelatedProjects } from "@/data/projects"
import { getAllProducts } from "@/data/products"
import { BUSINESS_CONFIG } from "@/config/business"
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

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const project = useMemo(() => (slug ? getProjectBySlug(slug) : undefined), [slug])

  const allProducts = useMemo(() => getAllProducts(), [])
  const matchingProducts = useMemo(() => {
    if (!project?.relatedProductIds || project.relatedProductIds.length === 0) return []
    return allProducts.filter((prod) => project.relatedProductIds?.includes(prod.id))
  }, [project, allProducts])

  const relatedProjects = useMemo(() => (project ? getRelatedProjects(project, 2) : []), [project])

  if (!project) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center py-16">
        <h1 className="font-display text-3xl font-semibold">Project not found</h1>
        <p className="text-muted-foreground">The requested audio project could not be found.</p>
        <Button onClick={() => navigate("/projects")}>Browse All Projects</Button>
      </div>
    )
  }

  const projectWhatsAppUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    `Hi VIVA team, I would like to discuss a project similar to: ${project.title}.`
  )}`

  return (
    <div className="container-page flex flex-col gap-10 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/projects" />}>Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{project.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero / Media & Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            {project.category}
          </Badge>
          {project.environmentTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.featured && <Badge>Featured Build</Badge>}
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          {project.title}
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {project.summary}
        </p>

        {/* Media Gallery / Photography State */}
        <div className="overflow-hidden rounded-2xl border bg-muted/20 p-8 sm:p-12">
          {project.media && project.media.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {project.media.map((item, idx) => (
                <div key={idx} className="aspect-[4/3] overflow-hidden rounded-xl bg-card">
                  <img src={item.url} alt={item.alt || project.title} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-muted/40 to-muted/20 p-6 text-center select-none">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-background/90 text-muted-foreground shadow-2xs">
                <PackageIcon className="size-7 stroke-[1.25]" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {project.category} · Workshop Build
                </span>
                <p className="text-sm font-medium text-foreground max-w-md">
                  Project photography being compiled — visit workshop or message VIVA for live vehicle and equipment inspection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Study Details Grid */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          {project.requirement && (
            <div className="rounded-xl border bg-card p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-primary mb-2">
                <SparklesIcon className="size-4.5" />
                <h2 className="text-base font-semibold text-foreground">Customer Requirement &amp; Challenge</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.requirement}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="rounded-xl border bg-card p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-primary mb-2">
                <WrenchIcon className="size-4.5" />
                <h2 className="text-base font-semibold text-foreground">Acoustic Engineering Solution</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.solution}
              </p>
            </div>
          )}

          {project.componentsUsed && project.componentsUsed.length > 0 && (
            <div className="rounded-xl border bg-card p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-primary mb-3">
                <LayersIcon className="size-4.5" />
                <h2 className="text-base font-semibold text-foreground">Integrated Components</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {project.componentsUsed.map((comp) => (
                  <div
                    key={comp}
                    className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-xs font-medium text-secondary-foreground"
                  >
                    <CheckCircle2Icon className="size-3.5 text-primary shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="rounded-xl border bg-secondary/40 p-6 shadow-xs flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">
              Discuss a Similar Setup
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have a similar vehicle, room, or commercial space? Send us a message or call to get expert guidance and an itemized quotation.
            </p>

            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                size="lg"
                className="w-full gap-2 font-semibold shadow-xs"
                render={<a href={projectWhatsAppUrl} target="_blank" rel="noopener noreferrer" />}
              >
                <MessageCircleIcon className="size-4" />
                Discuss on WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2"
                render={<a href={BUSINESS_CONFIG.contact.phone.tel} />}
              >
                <PhoneIcon className="size-4" />
                Call ({BUSINESS_CONFIG.contact.phone.display})
              </Button>
            </div>

            <div className="border-t pt-3 text-[11px] text-muted-foreground">
              Direct consultation in Kottakkal · {BUSINESS_CONFIG.hours.summary}
            </div>
          </div>
        </div>
      </div>

      {/* Matching / Used Hardware */}
      {matchingProducts.length > 0 && (
        <div className="border-t pt-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Hardware Used
              </p>
              <h2 className="font-display mt-1 text-2xl font-semibold text-foreground">
                Components Featured In This Project
              </h2>
            </div>
            <Button variant="ghost" size="sm" render={<Link to="/products" />}>
              View all products
              <ArrowRightIcon className="size-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matchingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="border-t pt-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              More {project.category} Work
            </h2>
            <Button
              variant="ghost"
              size="sm"
              render={<Link to={`/projects?category=${encodeURIComponent(project.category)}`} />}
            >
              Browse {project.category}
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {relatedProjects.map((rel) => (
              <div key={rel.id} className="rounded-xl border bg-card p-5 flex flex-col justify-between">
                <div>
                  <Badge variant="outline" className="text-xs">{rel.category}</Badge>
                  <h3 className="mt-2 font-semibold text-base">
                    <Link to={`/projects/${rel.slug}`} className="hover:text-primary transition-colors">
                      {rel.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{rel.summary}</p>
                </div>
                <div className="mt-4 pt-3 border-t flex justify-end">
                  <Button size="sm" variant="outline" render={<Link to={`/projects/${rel.slug}`} />}>
                    View Project
                    <ArrowRightIcon className="size-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
