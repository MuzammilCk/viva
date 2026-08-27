import { PhoneIcon, MessageCircleIcon } from "lucide-react"
import { BUSINESS_CONFIG } from "@/config/business"
import { trackContactClick } from "@/lib/analytics"

export function StickyContactBar() {
  const whatsappUrl = `https://wa.me/91${BUSINESS_CONFIG.contact.whatsapp.number}?text=${encodeURIComponent(
    BUSINESS_CONFIG.contact.whatsapp.defaultMessage
  )}`

  return (
    <>
      {/* Mobile Bottom Bar (Fixed) */}
      <aside
        aria-label="Quick contact"
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sm:hidden"
      >
        <div className="container-page flex items-center justify-between gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackContactClick({
                action: "whatsapp",
                label: "sticky_bottom_bar_mobile",
                destination: whatsappUrl,
              })
            }
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 active:scale-[0.98]"
          >
            <MessageCircleIcon className="size-4.5" />
            <span>WhatsApp</span>
          </a>

          <a
            href={BUSINESS_CONFIG.contact.phone.tel}
            onClick={() =>
              trackContactClick({
                action: "call",
                label: "sticky_bottom_bar_mobile",
                destination: BUSINESS_CONFIG.contact.phone.tel,
              })
            }
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border/80 bg-secondary px-4 text-sm font-semibold text-secondary-foreground shadow-xs transition-colors hover:bg-secondary/80 active:scale-[0.98]"
          >
            <PhoneIcon className="size-4.5 text-primary" />
            <span>Call Specialist</span>
          </a>
        </div>
      </aside>

      {/* Desktop Floating Pill (Bottom Right) */}
      <aside
        aria-label="Quick contact"
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full border border-border/80 bg-background/95 p-1.5 shadow-xl backdrop-blur-md supports-[backdrop-filter]:bg-background/85 sm:flex"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackContactClick({
              action: "whatsapp",
              label: "sticky_floating_pill_desktop",
              destination: whatsappUrl,
            })
          }
          className="flex h-9 items-center gap-2 rounded-full bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 active:scale-[0.98]"
        >
          <MessageCircleIcon className="size-3.5" />
          <span>WhatsApp ({BUSINESS_CONFIG.contact.whatsapp.display})</span>
        </a>

        <a
          href={BUSINESS_CONFIG.contact.phone.tel}
          onClick={() =>
            trackContactClick({
              action: "call",
              label: "sticky_floating_pill_desktop",
              destination: BUSINESS_CONFIG.contact.phone.tel,
            })
          }
          className="flex h-9 items-center gap-2 rounded-full border border-border/70 bg-secondary/80 px-3.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary active:scale-[0.98]"
        >
          <PhoneIcon className="size-3.5 text-primary" />
          <span>Call: {BUSINESS_CONFIG.contact.phone.display}</span>
        </a>
      </aside>
    </>
  )
}

