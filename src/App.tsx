import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/Toaster"
import { ModalProvider } from "@/components/ui/Modal"
import { DrawerProvider } from "@/components/ui/Drawer"
import { router } from "./router"
import { useUIStore } from "@/store/uiStore"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()

  // Apply theme on mount
  if (typeof window !== "undefined") {
    const root = document.documentElement
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", prefersDark)
    } else {
      root.classList.toggle("dark", theme === "dark")
    }
  }

  return <>{children}</>
}

function AppContent() {
  const { toasts, removeToast } = useUIStore()

  return (
    <ThemeProvider>
      <ModalProvider>
        <DrawerProvider>
          <RouterProvider router={router} />
          <Toaster toasts={toasts} onClose={removeToast} />
        </DrawerProvider>
      </ModalProvider>
    </ThemeProvider>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App