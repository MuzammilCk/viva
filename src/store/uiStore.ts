import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

export type Theme = "light" | "dark" | "system"

interface UIState {
  theme: Theme
  setTheme: (theme: Theme) => void

  cartOpen: boolean
  setCartOpen: (open: boolean) => void

  announcementDismissed: boolean
  dismissAnnouncement: () => void

  isOnline: boolean
  setIsOnline: (online: boolean) => void
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return
  const prefersDark =
    theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches
  document.documentElement.classList.toggle("dark", theme === "dark" || prefersDark)
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      cartOpen: false,
      setCartOpen: (cartOpen) => set({ cartOpen }),

      announcementDismissed: false,
      dismissAnnouncement: () => set({ announcementDismissed: true }),

      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      setIsOnline: (isOnline) => set({ isOnline }),
    }),
    {
      name: "synthlab-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        announcementDismissed: state.announcementDismissed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)

export const useTheme = () => useUIStore((state) => state.theme)

export const useUIActions = () =>
  useUIStore(
    useShallow((state) => ({
      setTheme: state.setTheme,
      setCartOpen: state.setCartOpen,
      dismissAnnouncement: state.dismissAnnouncement,
      setIsOnline: state.setIsOnline,
    }))
  )
