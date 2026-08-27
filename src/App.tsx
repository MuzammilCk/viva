import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { router } from "./router"
import { useTheme, useUIActions } from "@/store/uiStore"

function ThemeSync() {
  const theme = useTheme()
  const { setTheme } = useUIActions()

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (theme === "system") setTheme("system")
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme, setTheme])

  return null
}

export function App() {
  return (
    <>
      <ThemeSync />
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App

