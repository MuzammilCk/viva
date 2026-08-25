import { useState } from "react"
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useUIStore } from "@/store/uiStore"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { addToast } = useUIStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return

    setSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
      setEmail("")
      addToast({
        type: "success",
        title: "Welcome aboard!",
        description: "You'll receive our next newsletter soon.",
      })
    } catch {
      addToast({
        type: "error",
        title: "Something went wrong",
        description: "Please try again later.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-20 lg:py-28" aria-labelledby="newsletter-heading">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[var(--color-success)]" />
            </div>
            <h2 id="newsletter-heading" className="font-display font-bold text-3xl lg:text-4xl text-[var(--color-fg-primary)] mb-3">
              You're subscribed!
            </h2>
            <p className="text-[var(--color-fg-secondary)] mb-6">
              Thanks for joining the SynthLab community. Check your inbox for a welcome email.
            </p>
            <Button variant="ghost" onClick={() => setSubmitted(false)}>
              Subscribe another email
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-28 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border-subtle)]" aria-labelledby="newsletter-heading">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Mail className="w-4 h-4" />
            <span>Newsletter</span>
          </div>

          <h2 id="newsletter-heading" className="font-display font-bold text-3xl lg:text-4xl text-[var(--color-fg-primary)] mb-4">
            Stay in the loop
          </h2>

          <p className="text-[var(--color-fg-secondary)] mb-8 max-w-md mx-auto">
            Get the latest synth news, tutorials, exclusive offers, and new arrivals
            delivered to your inbox. No spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1"
              disabled={submitting}
              required
              aria-label="Email address"
            />
            <Button
              type="submit"
              size="lg"
              disabled={submitting || !email}
              className="sm:w-auto flex-shrink-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-xs text-[var(--color-fg-muted)]">
            By subscribing, you agree to our <a href="/privacy" className="underline hover:text-[var(--color-accent-cyan)]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  )
}