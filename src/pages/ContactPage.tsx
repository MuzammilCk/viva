import { Link } from "react-router-dom"
import {
  ChevronRightIcon,
  PhoneIcon,
  MessageCircleIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircle2Icon,
  HelpCircleIcon,
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

export function ContactPage() {
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    BUSINESS_CONFIG.contact.whatsapp.defaultMessage
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
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col gap-3 max-w-2xl">
        <Badge variant="outline" className="w-fit rounded-full px-3.5 py-1 text-xs">
          Direct Specialist Access
        </Badge>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Contact VIVA Business Team
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed sm:text-lg">
          Reach our audio specialist directly in Kottakkal. No automated queues, chatbots, or multi-step quote forms.
        </p>
      </div>

      {/* Above-the-fold Prominent Dual Conversion Action */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* WhatsApp Conversion Card */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-emerald-600/30 bg-emerald-50/40 p-6 sm:p-8 shadow-xs dark:bg-emerald-950/20">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <MessageCircleIcon className="size-6" />
              </div>
              <Badge variant="secondary" className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                Instant Photos &amp; Chat
              </Badge>
            </div>

            <h2 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">
              WhatsApp Consultation
            </h2>
            <p className="mt-1 font-mono text-base font-semibold text-emerald-800 dark:text-emerald-300">
              {BUSINESS_CONFIG.contact.whatsapp.display}
            </p>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Best for sharing photos of your car dashboard, parcel tray, room layout, or amplifier error lights for quick evaluation.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-emerald-600/20">
            <Button
              size="lg"
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
              render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <MessageCircleIcon className="size-4.5" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>

        {/* Direct Phone Call Card */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <PhoneIcon className="size-6" />
              </div>
              <Badge variant="secondary" className="font-semibold text-[11px]">
                Direct Call
              </Badge>
            </div>

            <h2 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">
              Direct Phone Call
            </h2>
            <p className="mt-1 font-mono text-base font-semibold text-primary">
              {BUSINESS_CONFIG.contact.phone.display}
            </p>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Best for immediate technical discussions, scheduling installation slots, or urgent repair inquiries.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-primary/20">
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 border-primary/40 text-foreground hover:bg-primary/10 font-semibold"
              render={<a href={BUSINESS_CONFIG.contact.phone.tel} />}
            >
              <PhoneIcon className="size-4.5 text-primary" />
              Call Specialist Now
            </Button>
          </div>
        </div>
      </div>

      {/* Workshop Location & Schedule Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Location & Address */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 sm:p-8 lg:col-span-6 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5 text-primary">
              <MapPinIcon className="size-5" />
              <h2 className="text-lg font-semibold text-foreground">Workshop Location</h2>
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              {BUSINESS_CONFIG.contact.address.full}
            </p>

            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Town:</span>
                <span>{BUSINESS_CONFIG.contact.address.town}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">District:</span>
                <span>{BUSINESS_CONFIG.contact.address.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Postal Code:</span>
                <span>{BUSINESS_CONFIG.contact.address.pincode}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
            <p>Conveniently located in Kottakkal for vehicle drive-ins and audio component drop-offs.</p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 sm:p-8 lg:col-span-6 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5 text-primary">
              <ClockIcon className="size-5" />
              <h2 className="text-lg font-semibold text-foreground">Operating Schedule</h2>
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              {BUSINESS_CONFIG.hours.days}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {BUSINESS_CONFIG.hours.summary}
            </p>

            <div className="mt-4 rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">Flexible Consultation</p>
              We accommodate customer vehicle drop-offs and inspections across weekdays and weekends.
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-[11px] text-muted-foreground/80">
            {BUSINESS_CONFIG.legalNotice}
          </div>
        </div>
      </div>

      {/* Helpful Guidance: How to Reach Out (Zero Forms!) */}
      <div className="rounded-xl border bg-secondary/30 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-primary mb-3">
          <HelpCircleIcon className="size-5" />
          <h2 className="text-base font-semibold text-foreground">
            What to share when messaging us
          </h2>
        </div>

        <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed mb-4">
          To help us give you fast and accurate guidance, feel free to include any of the following in your WhatsApp message:
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2 rounded-lg border bg-card p-3">
            <CheckCircle2Icon className="size-4 text-primary mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">1. Vehicle / Space Info</p>
              <p className="text-muted-foreground mt-0.5">Car model, bus type, or approximate room dimensions.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border bg-card p-3">
            <CheckCircle2Icon className="size-4 text-primary mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">2. Your Sound Goal</p>
              <p className="text-muted-foreground mt-0.5">Clearer vocals, deeper bass, full installation, or repair.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border bg-card p-3">
            <CheckCircle2Icon className="size-4 text-primary mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">3. Photos / Budget</p>
              <p className="text-muted-foreground mt-0.5">Snapshots of current wiring, head unit, or budget preference.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
