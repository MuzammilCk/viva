import { PhoneIcon, MessageCircleIcon } from "lucide-react"
import { BUSINESS_CONFIG } from "@/config/business"

export function StickyContactBar() {
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    BUSINESS_CONFIG.contact.whatsapp.defaultMessage
  )}`

  return (
    <aside
      aria-label="Quick contact"
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sm:hidden"
    >
      <div className="container-page flex items-center justify-between gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 active:scale-[0.98]"
        >
          <MessageCircleIcon className="size-4.5" />
          <span>WhatsApp</span>
        </a>

        <a
          href={BUSINESS_CONFIG.contact.phone.tel}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border/80 bg-secondary px-4 text-sm font-semibold text-secondary-foreground shadow-xs transition-colors hover:bg-secondary/80 active:scale-[0.98]"
        >
          <PhoneIcon className="size-4.5 text-primary" />
          <span>Call ({BUSINESS_CONFIG.contact.phone.number.slice(-4)})</span>
        </a>
      </div>
    </aside>
  )
}
