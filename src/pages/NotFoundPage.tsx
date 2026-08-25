import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
        This patch doesn&rsquo;t exist
      </h1>
      <p className="max-w-md text-muted-foreground">
        The page you&rsquo;re looking for was moved, unplugged, or never patched in the first
        place.
      </p>
      <Button render={<Link to="/products" />}>Browse the shop</Button>
    </div>
  )
}
