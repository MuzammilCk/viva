import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError(null)
    setEmail("")
    toast.success("You're on the list", {
      description: "New gear drops and patch ideas, straight to your inbox.",
    })
  }

  return (
    <section aria-labelledby="newsletter-heading" className="border-b bg-primary text-primary-foreground">
      <div className="container-page grid items-center gap-8 py-14 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 id="newsletter-heading" className="font-display text-3xl tracking-tight sm:text-4xl">
            New gear. First dibs.
          </h2>
          <p className="max-w-md text-sm leading-relaxed opacity-80">
            One email a week: new arrivals, restocks and the occasional patch tutorial.
            No spam — unsubscribe anytime.
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="you@studio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              className="border-transparent bg-background text-foreground placeholder:text-muted-foreground"
            />
            <Button type="submit" variant="secondary" className="shrink-0">
              Subscribe
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-xs font-medium">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
