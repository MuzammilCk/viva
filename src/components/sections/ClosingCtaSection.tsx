import { PhoneIcon, MessageCircleIcon, MapPinIcon, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUSINESS_CONFIG } from "@/config/business"

export function ClosingCtaSection() {
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    "Hi VIVA team, I would like to discuss an audio solution for my vehicle/space."
  )}`

  return (
    <section aria-labelledby="closing-cta-heading" className="bg-primary text-primary-foreground py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
            Get In Touch
          </p>
          <h2
            id="closing-cta-heading"
            className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-balance"
          >
            Ready to upgrade your sound? Talk directly to our specialist.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Call or message us on WhatsApp with your vehicle model, room dimensions, or audio issues. No automated chatbots or intermediaries.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-foreground font-semibold shadow-xs"
              render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
            >
              <MessageCircleIcon className="size-4" />
              Chat on WhatsApp ({BUSINESS_CONFIG.contact.whatsapp.display})
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              render={<a href={BUSINESS_CONFIG.contact.phone.tel} />}
            >
              <PhoneIcon className="size-4" />
              Call Specialist ({BUSINESS_CONFIG.contact.phone.display})
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-primary-foreground/70 border-t border-primary-foreground/20 pt-6">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-3.5" />
              <span>{BUSINESS_CONFIG.contact.address.full}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="size-3.5" />
              <span>{BUSINESS_CONFIG.hours.summary}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
