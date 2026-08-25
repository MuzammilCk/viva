/**
 * UI Store - Zustand
 * Manages global UI state: modals, drawers, toasts, theme, etc.
 */

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { ToastProps } from "@/types"

interface UIState {
  // Theme
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleTheme: () => void

  // Modals
  modals: Record<string, { open: boolean; data?: unknown }>
  openModal: (id: string, data?: unknown) => void
  closeModal: (id: string) => void
  closeAllModals: () => void

  // Drawers
  drawers: Record<string, { open: boolean; data?: unknown }>
  openDrawer: (id: string, data?: unknown) => void
  closeDrawer: (id: string) => void
  closeAllDrawers: () => void

  // Toasts
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id" | "onClose">) => string
  removeToast: (id: string) => void
  clearToasts: () => void

  // Loading states
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void

  // Page transitions
  pageTransition: boolean
  setPageTransition: (transition: boolean) => void

  // Scroll lock
  scrollLocked: boolean
  lockScroll: () => void
  unlockScroll: () => void

  // Reduced motion
  reducedMotion: boolean
  setReducedMotion: (reduced: boolean) => void

  // Online status
  isOnline: boolean
  setIsOnline: (online: boolean) => void

  // Announcement bar (persisted dismiss state so it stays gone across reloads)
  announcementDismissed: boolean
  dismissAnnouncement: () => void
}

const initialModals: Record<string, { open: boolean; data?: unknown }> = {}
const initialDrawers: Record<string, { open: boolean; data?: unknown }> = {}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "system",
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      toggleTheme: () => {
        const { theme } = get()
        const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"]
        const currentIndex = themes.indexOf(theme)
        const nextIndex = (currentIndex + 1) % themes.length
        const nextTheme = themes[nextIndex]
        set({ theme: nextTheme })
        applyTheme(nextTheme)
      },

      // Modals
      modals: initialModals,
      openModal: (id, data) => {
        set((state) => ({
          modals: { ...state.modals, [id]: { open: true, data } },
          scrollLocked: true,
        }))
        lockBodyScroll()
      },
      closeModal: (id) => {
        set((state) => {
          const newModals = { ...state.modals }
          delete newModals[id]
          return {
            modals: newModals,
            scrollLocked: Object.values(newModals).some((m) => m.open),
          }
        })
        if (!get().modals || Object.values(get().modals).some((m) => m.open) === false) {
          unlockBodyScroll()
        }
      },
      closeAllModals: () => {
        set({ modals: {}, scrollLocked: false })
        unlockBodyScroll()
      },

      // Drawers
      drawers: initialDrawers,
      openDrawer: (id, data) => {
        set((state) => ({
          drawers: { ...state.drawers, [id]: { open: true, data } },
          scrollLocked: true,
        }))
        lockBodyScroll()
      },
      closeDrawer: (id) => {
        set((state) => {
          const newDrawers = { ...state.drawers }
          delete newDrawers[id]
          return {
            drawers: newDrawers,
            scrollLocked: Object.values(newDrawers).some((d) => d.open),
          }
        })
        if (!Object.values(get().drawers).some((d) => d.open)) {
          unlockBodyScroll()
        }
      },
      closeAllDrawers: () => {
        set({ drawers: {}, scrollLocked: false })
        unlockBodyScroll()
      },

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const newToast: ToastProps = {
          ...toast,
          id,
          onClose: (toastId) => get().removeToast(toastId),
        }
        set((state) => ({ toasts: [...state.toasts, newToast] }))
        if (toast.duration !== 0) {
          setTimeout(() => get().removeToast(id), toast.duration || 5000)
        }
        return id
      },
      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      },
      clearToasts: () => {
        set({ toasts: [] })
      },

      // Global loading
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Page transitions
      pageTransition: false,
      setPageTransition: (transition) => set({ pageTransition: transition }),

      // Scroll lock
      scrollLocked: false,
      lockScroll: () => {
        set({ scrollLocked: true })
        lockBodyScroll()
      },
      unlockScroll: () => {
        set({ scrollLocked: false })
        unlockBodyScroll()
      },

      // Reduced motion
      reducedMotion: false,
      setReducedMotion: (reduced) => {
        set({ reducedMotion: reduced })
        document.documentElement.style.setProperty(
          "--animation-duration",
          reduced ? "0.01ms" : "var(--transition-normal)"
        )
      },

      // Online status
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      setIsOnline: (online) => set({ isOnline: online }),

      // Announcement bar dismiss state (persisted)
      announcementDismissed: false,
      dismissAnnouncement: () => set({ announcementDismissed: true }),
    }),
    {
      name: "music-electronics-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        reducedMotion: state.reducedMotion,
        announcementDismissed: state.announcementDismissed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
          if (state.reducedMotion) {
            document.documentElement.style.setProperty("--animation-duration", "0.01ms")
          }
        }
      },
    }
  )
)

// Helper functions
function applyTheme(theme: "light" | "dark" | "system") {
  if (typeof document === "undefined") return

  const root = document.documentElement
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.toggle("dark", prefersDark)
  } else {
    root.classList.toggle("dark", theme === "dark")
  }
}

function lockBodyScroll() {
  if (typeof document === "undefined") return
  const scrollY = window.scrollY
  document.body.style.position = "fixed"
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = "100%"
  document.body.dataset.scrollY = String(scrollY)
}

function unlockBodyScroll() {
  if (typeof document === "undefined") return
  const scrollY = Number.parseInt(document.body.dataset.scrollY || "0", 10)
  document.body.style.position = ""
  document.body.style.top = ""
  document.body.style.width = ""
  delete document.body.dataset.scrollY
  window.scrollTo(0, scrollY)
}

// Selectors
export const useTheme = () => useUIStore((state) => state.theme)
export const useModalState = () => useUIStore((state) => state.modals)
export const useDrawerState = () => useUIStore((state) => state.drawers)
export const useToasts = () => useUIStore((state) => state.toasts)
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading)
export const usePageTransition = () => useUIStore((state) => state.pageTransition)
export const useReducedMotion = () => useUIStore((state) => state.reducedMotion)
export const useIsOnline = () => useUIStore((state) => state.isOnline)

export const useUIActions = () =>
  useUIStore((state) => ({
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
    openDrawer: state.openDrawer,
    closeDrawer: state.closeDrawer,
    closeAllDrawers: state.closeAllDrawers,
    addToast: state.addToast,
    removeToast: state.removeToast,
    clearToasts: state.clearToasts,
    setGlobalLoading: state.setGlobalLoading,
    setPageTransition: state.setPageTransition,
    lockScroll: state.lockScroll,
    unlockScroll: state.unlockScroll,
    setReducedMotion: state.setReducedMotion,
    setIsOnline: state.setIsOnline,
  }))

// Toast convenience functions
export const toast = {
  success: (title: string, description?: string) =>
    useUIStore.getState().addToast({ type: "success", title, description }),
  error: (title: string, description?: string) =>
    useUIStore.getState().addToast({ type: "error", title, description }),
  warning: (title: string, description?: string) =>
    useUIStore.getState().addToast({ type: "warning", title, description }),
  info: (title: string, description?: string) =>
    useUIStore.getState().addToast({ type: "info", title, description }),
  default: (title: string, description?: string) =>
    useUIStore.getState().addToast({ type: "default", title, description }),
}