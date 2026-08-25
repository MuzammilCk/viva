import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "An unexpected error occurred."

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Something broke
      </p>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{message}</h1>
      <p className="max-w-md text-muted-foreground">
        The stage went quiet. Head back to the shop and keep playing.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => navigate("/")}>Back to home</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    </div>
  )
}
