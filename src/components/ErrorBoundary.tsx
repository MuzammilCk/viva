import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
            <AlertTriangleIcon className="size-8 text-warning" />
            <h1 className="font-display text-2xl">Something went wrong</h1>
            <p className="max-w-md text-muted-foreground">
              An unexpected error occurred while rendering this section. Your cart and saved
              items are safe.
            </p>
            <Button onClick={() => this.setState({ hasError: false })} variant="outline">
              Try again
            </Button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
