import { Link } from "react-router-dom"
import {
  ChevronRightIcon,
  PhoneIcon,
  MessageCircleIcon,
  WrenchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  MapPinIcon,
  ClockIcon,
  SlidersHorizontalIcon,
  CarIcon,
  HomeIcon,
  CoffeeIcon,
  ActivityIcon,
} from "lucide-react"
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
import { BUSINESS_CONFIG } from "@/config/business"
import { usePageSeo } from "@/hooks/usePageSeo"
import { trackContactClick } from "@/lib/analytics"

export function AboutPage() {
  usePageSeo({
    title: `About ${BUSINESS_CONFIG.name} (${BUSINESS_CONFIG.legalName}) — Audio Specialists in Kottakkal, Kerala`,
    description: `Specialist audio engineering rooted in craftsmanship. Learn about our one-expert operating model and Kottakkal workshop serving vehicles, venues, and homes.`,
  })

  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    "Hi VIVA team, I would like to learn more about your audio solutions."
  )}`

  return (
    <div className="container-page flex flex-col gap-12 py-8 sm:py-12">
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
            <BreadcrumbPage>About</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header / Identity Hero */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <Badge variant="outline" className="w-fit rounded-full px-3.5 py-1 text-xs">
          Business Identity &amp; Expertise
        </Badge>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Specialist audio engineering rooted in craftsmanship.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {BUSINESS_CONFIG.name} is a dedicated audio solutions workshop in Kottakkal, Malappuram district, Kerala. We design, install, tune, and repair sound systems across vehicle cabins, commercial venues, and residential living spaces.
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="rounded-2xl border bg-secondary/30 p-8 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Our Approach
            </p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl text-foreground">
              &ldquo;Tell us what you want to achieve. We design the system and make it work.&rdquo;
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Anyone can purchase speakers or amplifiers online. What an online store cannot deliver is the critical knowledge of how those components interact with the specific acoustics of your vehicle cabin, room reflections, power distribution, and listening preferences.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              At VIVA, products are treated as components of an engineered solution—not simply boxes to be sold. Every installation is calculated, acoustically damped, wired with proper gauge copper, and tuned by ear.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="rounded-xl border bg-card p-4 shadow-2xs">
              <div className="flex items-center gap-2.5 text-primary">
                <SparklesIcon className="size-4" />
                <h3 className="text-sm font-semibold text-foreground">Acoustic Space First</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Calculated for vehicle cabin geometry, room volume, wall materials, and ambient road/crowd noise.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-2xs">
              <div className="flex items-center gap-2.5 text-primary">
                <WrenchIcon className="size-4" />
                <h3 className="text-sm font-semibold text-foreground">Precision Fitment &amp; Damping</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Clean concealed wiring, OFC power runs, waterproof fuse blocks, and multi-layer butyl damping to stop rattles.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-2xs">
              <div className="flex items-center gap-2.5 text-primary">
                <SlidersHorizontalIcon className="size-4" />
                <h3 className="text-sm font-semibold text-foreground">Calibrated EQ &amp; Gain Staging</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Multi-point crossover alignment, gain matching, and time correction for balanced distortion-free sound.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scope of Work Grid */}
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Scope &amp; Environments
          </p>
          <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl text-foreground">
            Proven execution across diverse acoustic environments.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CarIcon className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Vehicles &amp; Commercial Fleets</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cars, tourist buses, and auto rickshaws. From discreet under-seat subs to high-SPL custom fiberglass enclosures.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HomeIcon className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Home Theatres &amp; Living Rooms</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Multi-channel receiver tuning, subwoofer calibration, and concealed architectural speaker wiring.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CoffeeIcon className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Cafés &amp; Commercial Spaces</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Multi-zone ambient background sound systems with balanced dispersion that preserves effortless table conversations.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ActivityIcon className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Diagnosis &amp; Electronics Repair</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Component-level bench troubleshooting for amplifiers in protection mode, channel dropouts, and blown speaker voice coils.
            </p>
          </div>
        </div>
      </div>

      {/* The Single-Specialist Model */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 border-t pt-10">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Operating Model
          </p>
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            One expert executing every job with personal accountability.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            At VIVA Business Team, consultation, solution design, equipment sourcing, physical installation, and electronic tuning are performed directly by one experienced specialist.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This hands-on structure ensures unmatched consistency and attention to detail. When you speak to VIVA, you are speaking directly to the technician who will cut the baffles, route the wiring, and tune your system.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border bg-secondary/40 p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Direct Technical Consultation</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  No sales representatives or intermediaries. You get honest technical guidance directly from the field expert.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPinIcon className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Kottakkal Workshop Base</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {BUSINESS_CONFIG.contact.address.full}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClockIcon className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Operating Schedule</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {BUSINESS_CONFIG.hours.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-[11px] text-muted-foreground/80">
            {BUSINESS_CONFIG.legalNotice}
          </div>
        </div>
      </div>

      {/* Direct Contact CTA */}
      <div className="rounded-2xl border bg-card p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Have an audio project or requirement?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Reach out directly via Call or WhatsApp to discuss your vehicle, home cinema, or venue audio requirements.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="gap-2"
            render={
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackContactClick({
                    action: "whatsapp",
                    label: "about_page_bottom_cta",
                    destination: whatsappUrl,
                  })
                }
              />
            }
          >
            <MessageCircleIcon className="size-4" />
            Chat on WhatsApp
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
                    label: "about_page_bottom_cta",
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
      </div>
    </div>
  )
}
