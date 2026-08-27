import { Link } from "react-router-dom"
import { ArrowRightIcon, MessageCircleIcon, SparklesIcon, CheckCircle2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getFeaturedProjects } from "@/data/projects"
import { BUSINESS_CONFIG } from "@/config/business"

export function FeaturedWorkSection() {
  const featuredProjects = getFeaturedProjects().slice(0, 4)

  return (
    <section id="featured-work" aria-labelledby="featured-work-heading" className="border-b py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Featured Work
            </p>
            <h2
              id="featured-work-heading"
              className="font-display mt-1.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Real audio execution across vehicles &amp; spaces.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every system is customized for the specific geometry, acoustic dampening, and listening needs of the client.
            </p>
          </div>

          <Button variant="outline" size="sm" render={<Link to="/services" />}>
            Explore Capabilities
            <ArrowRightIcon className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {featuredProjects.map((project) => {
            const projectWhatsAppUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
              `Hi VIVA team, I would like to discuss a similar project to: ${project.title}.`
            )}`

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-2xs transition-all hover:border-ring/40 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {project.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      {project.environmentTags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded bg-muted/60 px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="mt-3.5 text-base font-semibold leading-snug text-foreground transition-colors">
                    <Link to={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
                      {project.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>

                  {project.componentsUsed && project.componentsUsed.length > 0 && (
                    <div className="mt-4 border-t pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2">
                        Integrated Components
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.componentsUsed.slice(0, 3).map((comp) => (
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
                    variant="ghost"
                    className="text-xs h-8 px-2"
                    render={<Link to={`/projects/${project.slug}`} />}
                  >
                    View Details
                    <ArrowRightIcon className="size-3 ml-1" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1.5 h-8"
                    render={<a href={projectWhatsAppUrl} target="_blank" rel="noopener noreferrer" />}
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
    </section>
  )
}
