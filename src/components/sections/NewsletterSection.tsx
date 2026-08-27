import { MessageCircleIcon, PhoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUSINESS_CONFIG } from "@/config/business"

export function NewsletterSection() {
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    "Hello VIVA Business Team, I would like to consult about an audio solution."
  )}`

  return (
    <section aria-labelledby="cta-heading" className="border-b bg-primary text-primary-foreground">
      <div className="container-page flex flex-col items-center justify-between gap-8 py-14 text-center lg:flex-row lg:text-left">
        <div className="flex flex-col gap-2 max-w-xl">
          <h2 id="cta-heading" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Have an audio project or upgrade in mind?
          </h2>
          <p className="text-sm leading-relaxed opacity-90">
            Reach out directly for consultation on vehicle audio, home sound systems, or commercial audio installations in Kottakkal.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 font-medium"
            render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircleIcon className="size-4" />
            WhatsApp ({BUSINESS_CONFIG.contact.whatsapp.display})
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            render={<a href={BUSINESS_CONFIG.contact.phone.tel} />}
          >
            <PhoneIcon className="size-4" />
            Call ({BUSINESS_CONFIG.contact.phone.display})
          </Button>
        </div>
      </div>
    </section>
  )
}
