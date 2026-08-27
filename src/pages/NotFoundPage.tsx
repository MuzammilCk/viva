import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl text-foreground">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for doesn&rsquo;t exist or may have been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link to="/" />}>Back to home</Button>
        <Button variant="outline" render={<Link to="/services" />}>
          View services
        </Button>
      </div>
    </div>
  )
}
