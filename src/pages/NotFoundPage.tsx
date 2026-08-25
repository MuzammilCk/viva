import { Button } from "@/components/ui/Button"
import { Home, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <span className="font-display font-bold text-9xl lg:text-[12rem] text-[var(--color-border-default)]">
            404
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl lg:text-4xl text-[var(--color-fg-primary)] mb-4">
          Page Not Found
        </h1>
        <p className="text-[var(--color-fg-secondary)] mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved
          or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="gap-2" onClick={() => navigate("/")}>
            <Home className="w-5 h-5" />
            Go Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/products")}
          >
            <Search className="w-5 h-5" />
            Browse Products
          </Button>
        </div>
        <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
          Or{" "}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[var(--color-accent-cyan)] hover:underline"
          >
            go back
          </button>{" "}
          to the previous page
        </p>
      </div>
    </div>
  )
}