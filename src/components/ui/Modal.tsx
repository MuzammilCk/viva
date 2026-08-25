import { createContext, useContext, useState, type ReactNode, useCallback, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalContextType {
  openModals: Set<string>
  openModal: (id: string) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
  isOpen: (id: string) => boolean
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set())

  const openModal = useCallback((id: string) => {
    setOpenModals((prev) => new Set(prev).add(id))
  }, [])

  const closeModal = useCallback((id: string) => {
    setOpenModals((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const closeAllModals = useCallback(() => {
    setOpenModals(new Set())
  }, [])

  const isOpen = useCallback((id: string) => openModals.has(id), [openModals])

  return (
    <ModalContext.Provider value={{ openModals, openModal, closeModal, closeAllModals, isOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModals() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider")
  }
  return context
}

export function Modal({
  id,
  title,
  description,
  children,
  size = "md",
  showClose = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: {
  id: string
  title?: string
  description?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showClose?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  className?: string
}) {
  const { isOpen, closeModal } = useModals()
  const open = isOpen(id)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus trap effect - moved before early return to satisfy hooks rules
  useEffect(() => {
    if (!open) return
    const container = containerRef.current
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
      } else if (e.key === "Escape" && closeOnEscape) {
        closeModal(id)
      }
    }

    container.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("keydown", handleKeyDown)
      // Restore focus to the element that was focused before the modal opened
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [id, closeOnEscape, closeModal, open])

  if (!open) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  }

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      closeModal(id)
    }
  }

  return (
    <>
      <ModalStyles />
      <div
        ref={containerRef}
        className={cn(
          "fixed inset-0 z-[500] flex items-center justify-center p-4",
          "animate-fade-in"
        )}
        onKeyDown={() => {}}
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
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative z-10 w-full max-h-[90vh] overflow-y-auto",
            "glass-strong rounded-2xl",
            "shadow-[var(--shadow-xl),var(--shadow-glow-cyan)] animate-scale-in",
            "before:absolute before:inset-x-0 before:top-0 before:h-px " +
              "before:bg-gradient-to-r before:from-transparent before:via-[var(--color-accent-cyan)] before:to-transparent",
            sizeClasses[size]
          )}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between gap-4 p-6 border-b border-[var(--color-border-subtle)] relative">
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
                  onClick={() => closeModal(id)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg",
                    "text-[var(--color-fg-muted)] hover:text-[var(--color-accent-cyan)]",
                    "hover:bg-[rgba(0,212,255,0.08)] hover:shadow-[var(--shadow-glow-cyan)]",
                    "transition-[color,background-color,box-shadow] duration-150"
                  )}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className={cn("p-6", className)}>{children}</div>
        </div>
      </div>
    </>
  )
}

export function ModalTrigger({
  id,
  children,
  modal,
}: {
  id: string
  children: ReactNode | ((props: { openModal: () => void }) => ReactNode)
  modal: ReactNode
}) {
  const { openModal } = useModals()

  return (
    <>
      {typeof children === "function" ? children({ openModal: () => openModal(id) }) : (
        <button onClick={() => openModal(id)}>{children}</button>
      )}
      <Modal id={id}>{modal}</Modal>
    </>
  )
}

// Animation keyframes component
function ModalStyles() {
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fade-in {
        animation: fadeIn 200ms ease-out forwards;
      }
      .animate-scale-in {
        animation: scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-fade-in,
        .animate-scale-in {
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