import { useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
import {
  ChevronRightIcon,
  MessageCircleIcon,
  CheckCircle2Icon,
} from "lucide-react"
import { getAllProjects, PROJECT_CATEGORIES } from "@/data/projects"
import type { ProjectCategory } from "@/types"
import { BUSINESS_CONFIG } from "@/config/business"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePageSeo } from "@/hooks/usePageSeo"
import { trackContactClick } from "@/lib/analytics"

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get("category") as ProjectCategory | null

  usePageSeo({
    title: activeCategory
      ? `${activeCategory} Audio Projects & Installations — ${BUSINESS_CONFIG.name} Kottakkal`
      : `Audio Installation Projects & Builds — ${BUSINESS_CONFIG.name} Kottakkal, Kerala`,
    description: `Browse custom vehicle audio builds, home theatre calibrations, commercial soundscapes, and electronics repairs executed by ${BUSINESS_CONFIG.name} in Kottakkal.`,
  })

  const allProjects = useMemo(() => getAllProjects(), [])

  const filteredProjects = useMemo(() => {
    if (!activeCategory) return allProjects
    return allProjects.filter((p) => p.category === activeCategory)
  }, [allProjects, activeCategory])

  function handleCategoryChange(cat: string | null) {
    const next = new URLSearchParams(searchParams)
    if (cat) {
      next.set("category", cat)
    } else {
      next.delete("category")
    }
    setSearchParams(next)
  }

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
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col gap-3 max-w-2xl">
        <Badge variant="outline" className="w-fit rounded-full px-3.5 py-1 text-xs">
          Portfolio of Work
        </Badge>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Real Audio Installations &amp; Builds
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed sm:text-lg">
          Custom vehicle audio, architectural soundscapes, home cinemas, and component-level repairs executed by VIVA Business Team in Kottakkal, Kerala.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-4">
        <Button
          size="sm"
          variant={!activeCategory ? "default" : "outline"}
          onClick={() => handleCategoryChange(null)}
          className="rounded-full text-xs"
        >
          All Work
        </Button>
        {PROJECT_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={activeCategory === cat ? "default" : "outline"}
            onClick={() => handleCategoryChange(cat)}
            className="rounded-full text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {filteredProjects.map((project) => {
          const projectWhatsAppUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
            `Hi VIVA team, I would like to discuss a similar project to: ${project.title}.`
          )}`

          return (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-2xs transition-all hover:border-ring/40 hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    {project.category}
                  </Badge>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                    {project.environmentTags.map((tag) => (
                      <span key={tag} className="rounded bg-muted/60 px-1.5 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                  <Link to={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
                    {project.title}
                  </Link>
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>

                {project.requirement && (
                  <div className="mt-4 rounded-lg bg-secondary/30 p-3 text-xs">
                    <p className="font-semibold text-foreground">Requirement &amp; Challenge:</p>
                    <p className="mt-0.5 text-muted-foreground leading-relaxed">{project.requirement}</p>
                  </div>
                )}

                {project.solution && (
                  <div className="mt-2 rounded-lg bg-secondary/30 p-3 text-xs">
                    <p className="font-semibold text-foreground">Acoustic Solution:</p>
                    <p className="mt-0.5 text-muted-foreground leading-relaxed">{project.solution}</p>
                  </div>
                )}

                {project.componentsUsed && project.componentsUsed.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
                      Components Integrated
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.componentsUsed.map((comp) => (
                        <span
                          key={comp}
                          className="inline-flex items-center gap-1 rounded bg-secondary/60 px-2 py-0.5 text-[11px] text-secondary-foreground"
                        >
                          <CheckCircle2Icon className="size-3 text-primary" />
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  render={<Link to={`/projects/${project.slug}`} />}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 text-xs shadow-xs"
                  render={
                    <a
                      href={projectWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackContactClick({
                          action: "whatsapp",
                          label: "projects_grid_item",
                          destination: projectWhatsAppUrl,
                          metadata: { projectId: project.id, projectTitle: project.title },
                        })
                      }
                    />
                  }
                >
                  <MessageCircleIcon className="size-3.5" />
                  Discuss Similar
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
