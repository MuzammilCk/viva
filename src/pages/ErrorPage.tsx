import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export function ErrorPage() {
  const navigate = useNavigate()
  const error = useRouteError()
  const isRouteError = isRouteErrorResponse(error)

  const status = isRouteError ? error.status : 500
  const title = isRouteError
    ? error.statusText || "Request failed"
    : "Something went wrong"

  const message = isRouteError
    ? typeof error.data === "string"
      ? error.data
      : error.statusText || "The page you requested could not be loaded."
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred while rendering this page."

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-bg-secondary)] px-6">
      <div className="text-center max-w-lg w-full">
        {/* Error visual */}
        <div className="relative inline-flex mb-8">
          <span className="font-display font-bold text-8xl lg:text-[10rem] leading-none text-[var(--color-border-default)] select-none">
            {status}
          </span>
          <AlertTriangle className="absolute -top-4 -right-8 w-10 h-10 text-[var(--color-accent-amber)]" aria-hidden="true" />
        </div>

        <h1 className="font-display font-bold text-3xl lg:text-4xl text-[var(--color-fg-primary)] mb-4">
          {title}
        </h1>

        <p className="text-[var(--color-fg-secondary)] mb-8 line-clamp-3">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </div>

        <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
          If this keeps happening, our support team is happy to help.
        </p>
      </div>
    </div>
  )
}
