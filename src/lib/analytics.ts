/**
 * VIVA Business Team — Lightweight Event Tracking
 *
 * Lightweight click-tracking for Call and WhatsApp interactions.
 * Sourced from Phase 12 of docs/planning/06-viva-refactor-blueprint.md.
 */

import type { AnalyticsEvent } from "@/types"

export type ContactActionType = "call" | "whatsapp"

export interface TrackContactClickOptions {
  action: ContactActionType
  label: string
  page?: string
  destination?: string
  metadata?: Record<string, string | number | boolean>
}

/**
 * Tracks a click on a Call or WhatsApp conversion element.
 */
export function trackContactClick(options: TrackContactClickOptions): void {
  const currentPage =
    options.page || (typeof window !== "undefined" ? window.location.pathname : "/")

  const event: AnalyticsEvent = {
    name: `contact_${options.action}_click`,
    properties: {
      action: options.action,
      label: options.label,
      page: currentPage,
      destination: options.destination || "",
      ...options.metadata,
    },
    timestamp: new Date().toISOString(),
  }

  // Support GTM / dataLayer if available
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    if (win.dataLayer && Array.isArray(win.dataLayer)) {
      win.dataLayer.push(event)
    }

    // Dispatch DOM CustomEvent for local / test listeners
    window.dispatchEvent(
      new CustomEvent("viva:analytics", {
        detail: event,
      })
    )
  }

  // Development logging
  if (import.meta.env.DEV) {
    console.log("[VIVA Analytics Event]", event)
  }
}
