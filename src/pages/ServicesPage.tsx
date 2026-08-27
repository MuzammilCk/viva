import { Link } from "react-router-dom"
import {
  ChevronRightIcon,
  PhoneIcon,
  MessageCircleIcon,
  WrenchIcon,
  SparklesIcon,
  SlidersIcon,
  Volume2Icon,
  HammerIcon,
  ActivityIcon,
  PackageCheckIcon,
  LayersIcon,
  MapPinIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
} from "lucide-react"
import { getAllServices } from "@/data/services"
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
import type { Service } from "@/types"
import { usePageSeo } from "@/hooks/usePageSeo"
import { trackContactClick } from "@/lib/analytics"

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "complete-audio-solutions": SparklesIcon,
  "product-recommendation-supply": PackageCheckIcon,
  "installation-integration": WrenchIcon,
  "repair-diagnosis": ActivityIcon,
  "custom-solutions": HammerIcon,
  "tuning-upgrades-maintenance": SlidersIcon,
}

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Direct Consultation",
    description: "Reach out via Call or WhatsApp, or visit the shop in Kottakkal. Tell us what you want to achieve and your vehicle or room specifications.",
  },
  {
    step: "02",
    title: "Space & Acoustic Assessment",
    description: "We evaluate space constraints, factory wiring, and acoustics — either through physical inspection or photos and measurements.",
  },
  {
    step: "03",
    title: "Custom Solution & Quotation",
    description: "Receive a tailored equipment recommendation and itemized quotation engineered to match your budget and listening expectations.",
  },
  {
    step: "04",
    title: "Personal Execution & Tuning",
    description: "Every installation, fabrication, and repair is personally handled with proper damping, clean wiring, and precision acoustic calibration.",
  },
  {
    step: "05",
    title: "Testing & Ongoing Support",
    description: "Thorough listening tests before delivery, backed by direct support for future tuning, upgrades, and maintenance.",
  },
]

export function ServicesPage() {
  usePageSeo({
    title: `Audio Engineering & Installation Services — Kottakkal, Kerala | ${BUSINESS_CONFIG.name}`,
    description: `Complete audio solutions, equipment recommendations, car damping, speaker fitment, amplifier repair, and acoustic calibration in Kottakkal, Malappuram.`,
  })

  const services = getAllServices()

  return (
    <div className="container-page flex flex-col gap-12 py-8 sm:gap-16 sm:py-12">
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
            <BreadcrumbPage>Services</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            Capabilities &amp; Services
          </Badge>
          <span className="text-xs text-muted-foreground">Kottakkal, Kerala</span>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Audio Solutions &amp; Engineering
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Tell us what you want to achieve. We design the system, source genuine hardware, and personally execute the installation, tuning, and diagnosis.
        </p>
      </div>

      {/* Services List */}
      <div className="flex flex-col gap-8">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index + 1} />
        ))}
      </div>

      {/* Process / How VIVA Works */}
      <section className="rounded-2xl border bg-muted/20 p-6 sm:p-10">
        <div className="flex flex-col gap-3">
          <Badge variant="outline" className="w-fit">Our Process</Badge>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How Every Solution Is Built
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            From initial enquiry to post-installation tuning, every step is handled directly by an experienced audio specialist.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {WORKFLOW_STEPS.map((wf) => (
            <div key={wf.step} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
              <span className="font-mono text-xs font-bold text-primary">{wf.step}</span>
              <h3 className="text-sm font-semibold">{wf.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{wf.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Direct CTA */}
      <section className="flex flex-col items-center justify-between gap-6 rounded-2xl border bg-card p-8 text-center sm:flex-row sm:text-left lg:p-12">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Have an audio project or repair in mind?
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Contact VIVA Business Team directly for honest recommendations, site inspections, and clear quotes.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground sm:justify-start">
            <MapPinIcon className="size-3.5 text-primary" />
            <span>{BUSINESS_CONFIG.contact.address.full}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            render={
              <a
                href={BUSINESS_CONFIG.contact.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackContactClick({
                    action: "whatsapp",
                    label: "services_page_bottom_cta",
                    destination: BUSINESS_CONFIG.contact.whatsapp.url,
                  })
                }
              />
            }
          >
            <MessageCircleIcon className="size-4" />
            WhatsApp Us
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            render={
              <a
                href={BUSINESS_CONFIG.contact.phone.tel}
                onClick={() =>
                  trackContactClick({
                    action: "call",
                    label: "services_page_bottom_cta",
                    destination: BUSINESS_CONFIG.contact.phone.tel,
                  })
                }
              />
            }
          >
            <PhoneIcon className="size-4" />
            Call ({BUSINESS_CONFIG.contact.phone.display})
          </Button>
        </div>
      </section>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  index: number
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent = SERVICE_ICONS[service.id] || Volume2Icon

  const whatsappMessage =
    service.ctaMessage ||
    `Hello VIVA Business Team, I would like to discuss ${service.name}.`

  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <article
      id={service.slug}
      className="group flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/40 sm:p-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-10"
    >
      <div className="flex flex-col gap-5">
        {/* Title & Icon Header */}
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconComponent className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                0{index}
              </span>
              <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {service.name}
              </h2>
            </div>
            <p className="text-sm font-medium text-primary">
              {service.summary}
            </p>
          </div>
        </div>

        {/* In-depth Description */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {service.description}
        </p>

        {/* Environments Grid */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Applicable Environments &amp; Applications
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {service.applicableEnvironments.map((env) => (
              <span
                key={env}
                className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
              >
                <CheckCircle2Icon className="size-3 text-primary" />
                {env}
              </span>
            ))}
          </div>
        </div>

        {/* Matching Project Categories */}
        {service.matchingProjectCategories && service.matchingProjectCategories.length > 0 && (
          <div className="flex flex-col gap-2 pt-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Matching Project Categories
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {service.matchingProjectCategories.map((category) => (
                <Link
                  key={category}
                  to={`/projects?category=${encodeURIComponent(category)}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <span>{category}</span>
                  <ArrowRightIcon className="size-3" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Direct Contact & CTA Sidebar */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-muted/30 p-5 lg:p-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Direct Action
          </p>
          <p className="text-sm font-medium text-foreground">
            Discuss {service.name} with our technician
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            No intermediaries. Speak directly with the expert who designs, installs, and supports your setup.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            size="default"
            className="w-full gap-2"
            render={
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackContactClick({
                    action: "whatsapp",
                    label: "service_card_item",
                    destination: whatsappUrl,
                    metadata: { serviceId: service.id, serviceName: service.name },
                  })
                }
              />
            }
          >
            <MessageCircleIcon className="size-4" />
            {service.ctaLabel || "Inquire on WhatsApp"}
          </Button>

          <Button
            size="default"
            variant="outline"
            className="w-full gap-2"
            render={
              <a
                href={BUSINESS_CONFIG.contact.phone.tel}
                onClick={() =>
                  trackContactClick({
                    action: "call",
                    label: "service_card_item",
                    destination: BUSINESS_CONFIG.contact.phone.tel,
                    metadata: { serviceId: service.id, serviceName: service.name },
                  })
                }
              />
            }
          >
            <PhoneIcon className="size-4" />
            Call: {BUSINESS_CONFIG.contact.phone.display}
          </Button>
        </div>
      </div>
    </article>
  )
}
