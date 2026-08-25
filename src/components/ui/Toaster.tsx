"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect } from "react"
import type { CSSProperties, ReactNode } from "react"

type ToastType = "success" | "error" | "warning" | "info" | "default"

export interface ToasterProps {
  toasts: Array<{
    id: string
    type: ToastType
    title: string
    description?: string
    action?: { label: string; onClick: () => void }
    duration?: number
  }>
  onClose: (id: string) => void
}

// Per-type accent: left border color + soft glow (rest + hover-intensified).
// success = emerald, error = coral, warning = amber, info = cyan.
const typeConfig: Record<
  ToastType,
  { border: string; glowRest: string; glowHover: string; action: string }
> = {
  success: {
    border: "rgba(0, 255, 136, 0.55)",
    glowRest: "0 0 16px rgba(0, 255, 136, 0.16), inset 0 0 0 1px rgba(0, 255, 136, 0.06)",
    glowHover: "0 0 24px rgba(0, 255, 136, 0.30), inset 0 0 0 1px rgba(0, 255, 136, 0.12), inset 0 0 12px rgba(0, 255, 136, 0.10)",
    action: "var(--color-accent-emerald)",
  },
  error: {
    border: "rgba(255, 77, 77, 0.55)",
    glowRest: "0 0 16px rgba(255, 77, 77, 0.16), inset 0 0 0 1px rgba(255, 77, 77, 0.06)",
    glowHover: "0 0 24px rgba(255, 77, 77, 0.30), inset 0 0 0 1px rgba(255, 77, 77, 0.12), inset 0 0 12px rgba(255, 77, 77, 0.10)",
    action: "var(--color-accent-coral)",
  },
  warning: {
    border: "rgba(255, 184, 0, 0.55)",
    glowRest: "0 0 16px rgba(255, 184, 0, 0.16), inset 0 0 0 1px rgba(255, 184, 0, 0.06)",
    glowHover: "0 0 24px rgba(255, 184, 0, 0.30), inset 0 0 0 1px rgba(255, 184, 0, 0.12), inset 0 0 12px rgba(255, 184, 0, 0.10)",
    action: "var(--color-accent-amber)",
  },
  info: {
    border: "rgba(0, 212, 255, 0.55)",
    glowRest: "0 0 16px rgba(0, 212, 255, 0.16), inset 0 0 0 1px rgba(0, 212, 255, 0.06)",
    glowHover: "0 0 24px rgba(0, 212, 255, 0.30), inset 0 0 0 1px rgba(0, 212, 255, 0.12), inset 0 0 12px rgba(0, 212, 255, 0.10)",
    action: "var(--color-accent-cyan)",
  },
  default: {
    border: "rgba(255, 255, 255, 0.14)",
    glowRest: "0 8px 24px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
    glowHover: "0 10px 30px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
    action: "var(--color-accent-cyan)",
  },
}

const typeIcons: Record<ToastType, ReactNode> = {
  success: (
    <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-[var(--color-info)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5 text-[var(--color-fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export function Toaster({ toasts, onClose }: ToasterProps) {
  if (toasts.length === 0) return null

  return (
    <>
      <ToastStyles />
      <div
        className="fixed top-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 w-full max-w-sm"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </>
  )
}

interface ToastItemProps {
  toast: {
    id: string
    type: ToastType
    title: string
    description?: string
    action?: { label: string; onClick: () => void }
    duration?: number
  }
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const config = typeConfig[toast.type] ?? typeConfig.default

  return (
    <div
      className={cn(
        "toast-card glass-strong flex items-start gap-3 p-4 rounded-xl border-l-2",
        "transition-[box-shadow,transform,border-color] duration-150 animate-toast-in",
        "hover:-translate-y-0.5"
      )}
      style={
        {
          "--toast-glow": config.glowRest,
          "--toast-glow-hover": config.glowHover,
          borderLeftColor: config.border,
        } as CSSProperties
      }
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{typeIcons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--color-fg-primary)]">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-[var(--color-fg-secondary)] mt-1">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick()
              onClose(toast.id)
            }}
            className={cn(
              "mt-2 text-sm font-medium transition-colors duration-150",
              "hover:underline focus-visible:outline-none focus-visible:ring-[3px]",
              "focus-visible:ring-[var(--color-focus-ring)] focus-visible:rounded-sm"
            )}
            style={{ color: config.action }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className={cn(
          "flex-shrink-0 p-1 rounded-lg transition-[color,background-color] duration-150",
          "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]",
          "hover:bg-[var(--color-bg-tertiary)]",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-focus-ring)]"
        )}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function ToastStyles() {
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes toast-in {
        from {
          transform: translateY(-115%) translateX(0);
          opacity: 0;
        }
        to {
          transform: translateY(0) translateX(0);
          opacity: 1;
        }
      }
      .animate-toast-in {
        animation: toast-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      /* Soft per-type glow that intensifies on hover. */
      .toast-card {
        box-shadow: var(--toast-glow, 0 8px 24px rgba(0, 0, 0, 0.45));
      }
      .toast-card:hover {
        box-shadow: var(--toast-glow-hover, 0 10px 30px rgba(0, 0, 0, 0.55));
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-toast-in {
          animation-duration: 0.01ms;
        }
      }
    `
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  return null
}
