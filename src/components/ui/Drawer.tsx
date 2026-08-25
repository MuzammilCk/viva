import { createContext, useContext, useState, useCallback, type ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

type DrawerPosition = "left" | "right" | "top" | "bottom"

interface DrawerContextType {
  openDrawers: Record<string, { open: boolean; data?: unknown }>
  openDrawer: (id: string, data?: unknown) => void
  closeDrawer: (id: string) => void
  closeAllDrawers: () => void
  isOpen: (id: string) => boolean
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [openDrawers, setOpenDrawers] = useState<Record<string, { open: boolean; data?: unknown }>>({})

  const openDrawer = useCallback((id: string, data?: unknown) => {
    setOpenDrawers((prev) => ({ ...prev, [id]: { open: true, data } }))
    lockBodyScroll()
  }, [])

  const closeDrawer = useCallback((id: string) => {
    let shouldUnlock = false
    setOpenDrawers((prev) => {
      const next = { ...prev }
      delete next[id]
      if (Object.keys(next).length === 0) {
        shouldUnlock = true
      }
      return next
    })
    if (shouldUnlock) {
      unlockBodyScroll()
    }
  }, [])

  const closeAllDrawers = useCallback(() => {
    setOpenDrawers({})
    unlockBodyScroll()
  }, [])

  const isOpen = useCallback((id: string) => openDrawers[id]?.open ?? false, [openDrawers])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const openIds = Object.keys(openDrawers).filter((id) => openDrawers[id].open)
        if (openIds.length > 0) {
          closeDrawer(openIds[openIds.length - 1])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [openDrawers, closeDrawer])

  return (
    <DrawerContext.Provider value={{ openDrawers, openDrawer, closeDrawer, closeAllDrawers, isOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawers() {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error("useDrawers must be used within a DrawerProvider")
  }
  return context
}

function lockBodyScroll() {
  const scrollY = window.scrollY
  document.body.style.position = "fixed"
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = "100%"
  document.body.dataset.scrollY = String(scrollY)
}

function unlockBodyScroll() {
  const scrollY = Number(document.body.dataset.scrollY || "0")
  document.body.style.position = ""
  document.body.style.top = ""
  document.body.style.width = ""
  delete document.body.dataset.scrollY
  window.scrollTo(0, scrollY)
}

export interface DrawerProps {
  id: string
  title?: string
  description?: string
  children: ReactNode
  position?: DrawerPosition
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showClose?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

export function Drawer({
  id,
  title,
  description,
  children,
  position = "right",
  size = "md",
  showClose = true,
  closeOnOverlayClick = true,
  className,
}: DrawerProps) {
  const { isOpen, closeDrawer } = useDrawers()
  const open = isOpen(id)
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus trap effect
  useEffect(() => {
    if (!open) return

    const container = drawerRef.current
    if (!container) return

    // Save the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = () => {
      return container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    }

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus the first element
    firstElement.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      } else if (e.key === "Escape") {
        closeDrawer(id)
      }
    }

    container.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("keydown", handleKeyDown)
      // Restore focus to the element that was focused before the trap
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [id, closeDrawer, open])

  if (!open) return null

  const positionClasses = {
    left: "left-0 top-0 h-full border-r",
    right: "right-0 top-0 h-full border-l",
    top: "top-0 left-0 w-full border-b",
    bottom: "bottom-0 left-0 w-full border-t",
  }

  const edgeAccent = {
    left: "border-r-[var(--color-accent-cyan)]",
    right: "border-l-[var(--color-accent-cyan)]",
    top: "border-b-[var(--color-accent-cyan)]",
    bottom: "border-t-[var(--color-accent-cyan)]",
  }

  const edgeGlow = {
    left: "shadow-[var(--shadow-glow-cyan)]",
    right: "shadow-[var(--shadow-glow-cyan)]",
    top: "shadow-[var(--shadow-glow-cyan)]",
    bottom: "shadow-[var(--shadow-glow-cyan)]",
  }

  const sizeClasses = {
    sm: position === "left" || position === "right" ? "w-72" : "h-48",
    md: position === "left" || position === "right" ? "w-96" : "h-64",
    lg: position === "left" || position === "right" ? "w-[32rem]" : "h-80",
    xl: position === "left" || position === "right" ? "w-[40rem]" : "h-96",
    full: position === "left" || position === "right" ? "w-full max-w-[90vw]" : "h-full max-h-[90vh]",
  }

  return (
    <>
      <DrawerStyles />
      <div
        ref={drawerRef}
        className={cn(
          "fixed z-[400] flex",
          positionClasses[position]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
      >
        <div
          className={cn(
            "absolute inset-0 glass-strong transition-opacity",
            closeOnOverlayClick ? "cursor-pointer" : ""
          )}
          onClick={closeOnOverlayClick ? () => closeDrawer(id) : undefined}
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative z-10 flex flex-col overflow-hidden",
            "glass-strong",
            edgeAccent[position],
            edgeGlow[position],
            "animate-slide-in",
            sizeClasses[position === "left" || position === "right" ? size : "md"],
            className
          )}
          style={{
            width: position === "left" || position === "right" ? undefined : "100%",
            height: position === "top" || position === "bottom" ? undefined : "100%",
          }}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between gap-4 p-6 border-b border-[var(--color-border-subtle)] flex-shrink-0 relative">
              {title && (
                <span className="absolute left-6 top-0 h-px w-12 bg-[var(--color-accent-cyan)] shadow-[var(--shadow-glow-cyan)]" aria-hidden="true" />
              )}
              <div>
                {title && (
                  <h2 id={`${id}-title`} className="text-xl font-semibold text-[var(--color-fg-primary)] font-[var(--font-display)] tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={`${id}-description`} className="mt-1 text-sm text-[var(--color-fg-secondary)]">
                    {description}
                  </p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={() => closeDrawer(id)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg",
                    "text-[var(--color-fg-muted)] hover:text-[var(--color-accent-cyan)]",
                    "hover:bg-[rgba(0,212,255,0.08)] hover:shadow-[var(--shadow-glow-cyan)]",
                    "transition-[color,background-color,box-shadow] duration-150"
                  )}
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  )
}

export function DrawerTrigger({
  id,
  children,
  drawer,
}: {
  id: string
  children: ReactNode | ((props: { openDrawer: () => void }) => ReactNode)
  drawer: ReactNode
}) {
  const { openDrawer } = useDrawers()

  return (
    <>
      {typeof children === "function" ? children({ openDrawer: () => openDrawer(id) }) : (
        <button onClick={() => openDrawer(id)}>{children}</button>
      )}
      <Drawer id={id}>{drawer}</Drawer>
    </>
  )
}

// Animation keyframes component
function DrawerStyles() {
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slide-in {
        animation: slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-slide-in {
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