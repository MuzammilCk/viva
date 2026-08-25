import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, CreditCard, Truck, CheckCircle, Loader2, ArrowRight, ChevronRight } from "lucide-react"
import { useCartStore, shippingMethods } from "@/store/cartStore"
import { getProductById } from "@/data/products"
import { formatPrice, cn } from "@/lib/utils"

// Per-category accent — sourced from design tokens (no raw hex literals), mirroring CartPage.
const accentByCategory: Record<string, string> = {
  "Synthesizers": "var(--color-accent-cyan)",
  "Controllers": "var(--color-accent-amber)",
  "Audio Interfaces": "var(--color-accent-coral)",
  "Modular": "var(--color-accent-violet)",
  "Accessories": "var(--color-accent-emerald)",
}
const glowByCategory: Record<string, string> = {
  "Synthesizers": "var(--shadow-glow-cyan)",
  "Controllers": "var(--shadow-glow-amber)",
  "Audio Interfaces": "var(--shadow-glow-coral)",
}

// Resolve a cart item to its product + display price (variant-aware), returning the
// accent token to use for the swatch. Plain (non-hook) helper so it is safe to call
// inside `.map()`; both the review-step and summary-sidebar item lists share it.
function resolveCheckoutItem(item: { productId: string; variantId?: string }) {
  const product = getProductById(item.productId)
  if (!product) return null
  const variant = product.variants?.find((v) => v.id === item.variantId)
  const unitPrice = variant ? (variant.salePrice ?? variant.price) : (product.salePrice ?? product.price)
  const accent = accentByCategory[product.category] ?? "var(--color-accent-cyan)"
  const glow = glowByCategory[product.category]
  const variantName = variant?.name
  return { product, unitPrice, accent, glow, variantName }
}

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  sameAsShipping: z.boolean(),
  billingFirstName: z.string().optional(),
  billingLastName: z.string().optional(),
  billingAddress1: z.string().optional(),
  billingAddress2: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCountry: z.string().optional(),
  cardNumber: z.string().min(16, "Invalid card number"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry (MM/YY)"),
  cardCvc: z.string().min(3, "Invalid CVC"),
  cardName: z.string().min(1, "Name on card is required"),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "AU", label: "Australia" },
]

export function CheckoutPage() {
  const { items, subtotal, tax, shipping, discount, total, promoCode, shippingMethod, setShippingMethod, clearCart } = useCartStore()
  const [step, setStep] = useState<"contact" | "shipping" | "payment" | "review" | "success">("contact")
  const [processing, setProcessing] = useState(false)
  // Snapshot of the placed order (number + total) so the success screen can render
  // the real total even after clearCart() zeroes the live store values.
  const [orderRef, setOrderRef] = useState<{ number: string; total: number }>({ number: "", total: 0 })
  const navigate = useNavigate()

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsShipping: true,
      country: "US",
      billingCountry: "US",
    },
  })

  // Free shipping is computed by the store (subtotal ≥ threshold OR a FREESHIP promo),
  // and already reflected in the `shipping` total. Use that as the source of truth
  // instead of re-deriving a stale $199 threshold the store no longer enforces.
  const isFreeShipping = shipping <= 0 && subtotal > 0

  // Guard: no checkout on an empty cart — send the user to their cart. Mirrors the
  // cart-page empty state and prevents completing checkout with no line items.
  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[var(--color-bg-secondary)] px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center">
            <Truck className="w-10 h-10 text-[var(--color-fg-muted)]" />
          </div>
          <h1 className="font-display font-bold text-3xl text-[var(--color-fg-primary)] mb-3">
            Your cart is empty
          </h1>
          <p className="text-[var(--color-fg-secondary)] mb-8">
            Add some gear to your cart before heading to checkout.
          </p>
          <Button size="lg" className="gap-2" onClick={() => navigate("/products")}>
            Browse Products
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    { id: "contact", label: "Contact", icon: Mail },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: CheckCircle },
  ]

  const handleNext = async (currentStep: string) => {
    const isValid = await form.trigger()
    if (isValid) {
      const stepIndex = steps.findIndex((s) => s.id === currentStep)
      if (stepIndex < steps.length - 1) {
        setStep(steps[stepIndex + 1].id as any)
      }
    }
  }

  const handleBack = (currentStep: string) => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep)
    if (stepIndex > 0) {
      setStep(steps[stepIndex - 1].id as any)
    }
  }

  const handleSubmit = async (_data: CheckoutForm) => {
    setProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Snapshot the order number + total BEFORE clearing the cart, so the success
      // screen shows the real charged amount (clearCart() zeroes the live store).
      const orderNumber = `SL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      setOrderRef({ number: orderNumber, total })
      // Order placed — empty the cart so it isn't double-charged or re-checked-out.
      clearCart()
      setStep("success")
      form.reset()
    } catch (error) {
      console.error("Checkout failed:", error)
    } finally {
      setProcessing(false)
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[var(--color-bg-secondary)]">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[var(--color-success)]" />
          </div>
          <h1 className="font-display font-bold text-3xl text-[var(--color-fg-primary)] mb-3">
            Order Confirmed!
          </h1>
          <p className="text-[var(--color-fg-secondary)] mb-8">
            Thank you for your order. A confirmation email has been sent to your email address.
          </p>
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl p-6 mb-8 text-left">
            <p className="font-semibold text-[var(--color-fg-primary)] mb-2">Order Number</p>
            <p className="font-mono text-lg text-[var(--color-accent-cyan)]">{orderRef.number}</p>
            <p className="font-semibold text-[var(--color-fg-primary)] mt-4 mb-2">Total</p>
            <p className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">{formatPrice(orderRef.total)}</p>
          </div>
          <Button size="lg" className="gap-2" onClick={() => navigate("/")}>
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Progress Steps */}
      <div className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)] sticky top-16 z-[var(--z-sticky)]">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, i) => {
              const currentIndex = steps.findIndex((st) => st.id === step)
              const isActive = i === currentIndex
              const isCompleted = i < currentIndex

              return (
                <div key={s.id} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    isActive ? "bg-[var(--color-accent-cyan)] text-[var(--color-fg-inverse)]" :
                    isCompleted ? "bg-[var(--color-success)] text-[var(--color-fg-inverse)]" :
                    "bg-[var(--color-bg-tertiary)] text-[var(--color-fg-muted)]"
                  )}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "w-20 h-1 mx-2",
                      isCompleted ? "bg-[var(--color-success)]" : "bg-[var(--color-border-default)]"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-8 mt-2 text-xs text-[var(--color-fg-muted)]">
            {steps.map((s) => (
              <span key={s.id} className={cn(
                "px-2",
                steps.findIndex((st) => st.id === step) >= steps.findIndex((st) => st.id === s.id)
                  ? "text-[var(--color-fg-primary)] font-medium"
                  : ""
              )}>{s.label}</span>
            ))}
          </div>
        </div>
      </div>

      <main className="container py-10 lg:py-16">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Step */}
            <div className={cn("animate-fade-in", step !== "contact" && "hidden")}>
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    {...form.register("email")}
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      {...form.register("firstName")}
                      label="First Name"
                      placeholder="John"
                      required
                    />
                    <Input
                      {...form.register("lastName")}
                      label="Last Name"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Step */}
            <div className={cn("animate-fade-in", step !== "shipping" && "hidden")}>
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    {...form.register("address1")}
                    label="Address Line 1"
                    placeholder="123 Main Street"
                    required
                  />
                  <Input
                    {...form.register("address2")}
                    label="Address Line 2 (Optional)"
                    placeholder="Apt, Suite, Unit"
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      {...form.register("city")}
                      label="City"
                      placeholder="New York"
                      required
                    />
                    <Input
                      {...form.register("state")}
                      label="State/Province"
                      placeholder="NY"
                      required
                    />
                    <Input
                      {...form.register("postalCode")}
                      label="Postal Code"
                      placeholder="10001"
                      required
                    />
                  </div>
                  <Select
                    {...form.register("country")}
                    label="Country"
                    options={countries.map((c) => ({ value: c.value, label: c.label }))}
                    placeholder="Select country"
                    required
                  />
                  <Input
                    {...form.register("phone")}
                    label="Phone (Optional)"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {shippingMethods.map((option) => (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer",
                          shippingMethod?.id === option.id
                            ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/5"
                            : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]"
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={shippingMethod?.id === option.id}
                          onChange={() => setShippingMethod(option)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[var(--color-fg-primary)]">{option.name}</span>
                            <span className="font-bold text-[var(--color-fg-primary)]">
                              {isFreeShipping && option.id === "standard" ? "FREE" : formatPrice(option.price)}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--color-fg-muted)]">{option.estimatedDays}</span>
                        </div>
                        <CheckCircle className={cn(
                          "w-5 h-5",
                          shippingMethod?.id === option.id ? "text-[var(--color-accent-cyan)]" : "text-transparent"
                        )} />
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Step */}
            <div className={cn("animate-fade-in", step !== "payment" && "hidden")}>
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      {...form.register("cardName")}
                      label="Name on Card"
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      {...form.register("cardNumber")}
                      label="Card Number"
                      type="tel"
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      {...form.register("cardExpiry")}
                      label="Expiry (MM/YY)"
                      type="tel"
                      placeholder="12/25"
                      required
                      maxLength={5}
                    />
                    <Input
                      {...form.register("cardCvc")}
                      label="CVC"
                      type="tel"
                      placeholder="123"
                      required
                      maxLength={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      {...form.register("sameAsShipping")}
                      checked={form.watch("sameAsShipping")}
                      onChange={(e) => form.setValue("sameAsShipping", e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--color-border-default)] text-[var(--color-accent-cyan)] focus:ring-[var(--color-focus-ring)]"
                    />
                    <label className="font-medium text-[var(--color-fg-primary)] cursor-pointer">
                      Same as shipping address
                    </label>
                  </div>
                  {!form.watch("sameAsShipping") && (
                    <>
                      <Input {...form.register("billingFirstName")} label="First Name" placeholder="John" />
                      <Input {...form.register("billingLastName")} label="Last Name" placeholder="Doe" />
                      <Input {...form.register("billingAddress1")} label="Address Line 1" placeholder="123 Main Street" />
                      <Input {...form.register("billingAddress2")} label="Address Line 2 (Optional)" placeholder="Apt, Suite" />
                      <div className="grid sm:grid-cols-3 gap-4">
                        <Input {...form.register("billingCity")} label="City" placeholder="New York" />
                        <Input {...form.register("billingState")} label="State" placeholder="NY" />
                        <Input {...form.register("billingPostalCode")} label="Postal Code" placeholder="10001" />
                      </div>
                      <Select {...form.register("billingCountry")} label="Country" options={countries.map(c => ({ value: c.value, label: c.label }))} placeholder="Select country" />
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Review Step */}
            <div className={cn("animate-fade-in", step !== "review" && "hidden")}>
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {items.map((item) => {
                      const resolved = resolveCheckoutItem(item)
                      if (!resolved) return null
                      const { product, unitPrice, accent, glow, variantName } = resolved
                      return (
                        <div key={item.id} className="flex gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
                          <div
                            className="w-12 h-12 rounded-lg flex-shrink-0 opacity-30"
                            style={{ background: accent, boxShadow: glow }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-fg-primary)] truncate">
                              {product.name}
                              {variantName ? ` — ${variantName}` : ""}
                            </p>
                            <p className="text-xs text-[var(--color-fg-secondary)]">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-[var(--color-fg-primary)]">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-fg-secondary)]">Subtotal</span>
                      <span className="font-medium text-[var(--color-fg-primary)]">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-[var(--color-success)]">
                        <span>Discount ({promoCode})</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-fg-secondary)]">Tax</span>
                      <span className="font-medium text-[var(--color-fg-primary)]">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-fg-secondary)]">Shipping</span>
                      <span className="font-medium text-[var(--color-fg-primary)]">
                        {isFreeShipping ? <span className="text-[var(--color-success)]">FREE</span> : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="border-t border-[var(--color-border-subtle)] pt-3 flex justify-between text-lg font-bold">
                      <span className="text-[var(--color-fg-primary)]">Total</span>
                      <span className="text-[var(--color-fg-primary)]">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg text-sm text-[var(--color-fg-secondary)]">
                    <p className="font-medium text-[var(--color-fg-primary)] mb-1">By placing your order, you agree to our</p>
                    <div className="flex gap-4">
                      <a href="/terms" className="text-[var(--color-accent-cyan)] hover:underline">Terms of Service</a>
                      <a href="/privacy" className="text-[var(--color-accent-cyan)] hover:underline">Privacy Policy</a>
                      <a href="/returns" className="text-[var(--color-accent-cyan)] hover:underline">Return Policy</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-[var(--color-border-subtle)]">
              <Button variant="outline" onClick={() => handleBack(step)} disabled={step === "contact"}>
                ← Back
              </Button>
              {step !== "review" ? (
                <Button onClick={() => handleNext(step)} disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={() => form.handleSubmit(handleSubmit)} disabled={processing} size="lg" className="gap-2">
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Place Order</span>
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const resolved = resolveCheckoutItem(item)
                    if (!resolved) return null
                    const { product, unitPrice, accent, glow, variantName } = resolved
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div
                          className="w-12 h-12 rounded-lg opacity-30 flex-shrink-0"
                          style={{ background: accent, boxShadow: glow }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-fg-primary)] truncate">
                            {product.name}
                            {variantName ? ` — ${variantName}` : ""}
                          </p>
                          <p className="text-xs text-[var(--color-fg-secondary)]">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-[var(--color-fg-primary)]">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-fg-secondary)]">Subtotal</span>
                    <span className="font-medium text-[var(--color-fg-primary)]">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-[var(--color-success)]">
                      <span>Discount ({promoCode})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-fg-secondary)]">Tax</span>
                    <span className="font-medium text-[var(--color-fg-primary)]">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-fg-secondary)]">Shipping</span>
                    <span className="font-medium text-[var(--color-fg-primary)]">
                      {isFreeShipping ? <span className="text-[var(--color-success)]">FREE</span> : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="border-t border-[var(--color-border-subtle)] pt-3 flex justify-between text-lg font-bold">
                    <span className="text-[var(--color-fg-primary)]">Total</span>
                    <span className="text-[var(--color-fg-primary)]">{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 p-4 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] rounded-xl text-sm text-[var(--color-fg-secondary)]">
              <p className="font-medium text-[var(--color-fg-primary)] mb-2">Secure Checkout</p>
              <p>Your payment information is encrypted and processed securely by Stripe. We never store your full card details.</p>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}