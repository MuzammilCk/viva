import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2Icon, CreditCardIcon, LockIcon } from "lucide-react"
import { toast } from "sonner"
import {
  useCartActions,
  useCartDiscount,
  useCartItems,
  useCartShipping,
  useCartSubtotal,
  useCartTax,
  useCartTotal,
} from "@/store/cartStore"
import { formatPrice } from "@/lib/format"
import { getProductById } from "@/data/products"
import type { Order } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postalCode: z.string().min(3, "Enter a valid postal code"),
  cardName: z.string().min(1, "Required"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Enter a 16-digit card number"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "3–4 digits"),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const STEPS = ["Contact & address", "Payment", "Confirmation"] as const

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const tax = useCartTax()
  const shipping = useCartShipping()
  const discount = useCartDiscount()
  const total = useCartTotal()
  const { clearCart } = useCartActions()

  const [step, setStep] = useState(0)
  const [order, setOrder] = useState<Order | null>(null)

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  })

  const orderNumber = useMemo(() => `SL-${Date.now().toString(36).toUpperCase()}`, [])

  if (items.length === 0 && step !== 2) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="font-display text-3xl tracking-tight">Nothing to check out</h1>
        <p className="max-w-sm text-muted-foreground">Add some gear to your cart first.</p>
        <Button render={<Link to="/products" />}>Browse products</Button>
      </div>
    )
  }

  async function handlePlaceOrder(values: CheckoutForm) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    setOrder({
      id: orderNumber.toLowerCase(),
      orderNumber,
      status: "processing",
      items: items.map((item) => {
        const product = getProductById(item.productId)
        const variant = product?.variants.find((v) => v.id === item.variantId)
        return {
          productId: item.productId,
          variantId: item.variantId,
          name: product?.name ?? item.productId,
          sku: variant?.sku ?? "N/A",
          quantity: item.quantity,
          unitPrice: variant?.salePrice ?? variant?.price ?? product?.salePrice ?? product?.price ?? 0,
        }
      }),
      subtotal,
      tax,
      shipping,
      discount,
      total,
      shippingAddress: {
        id: "addr-1",
        type: "shipping",
        isDefault: true,
        firstName: values.firstName,
        lastName: values.lastName,
        street1: values.address,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: "USA",
      },
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toDateString(),
    })
    clearCart()
    setStep(2)
    toast.success("Order placed — thank you!")
  }

  return (
    <div className="container-page flex flex-col gap-8 py-10 sm:py-12">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Checkout</h1>
        <p className="text-muted-foreground">Secure demo checkout — no real payment is processed.</p>
      </header>

      <ol aria-label="Checkout progress" className="flex flex-wrap items-center gap-3 text-sm">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-3">
            <span
              aria-current={index === step ? "step" : undefined}
              className={cn(
                "flex size-6 items-center justify-center rounded-full border text-xs font-semibold tnum",
                index < step && "border-primary bg-primary text-primary-foreground",
                index === step && "border-primary text-primary",
                index > step && "text-muted-foreground"
              )}
            >
              {index < step ? "✓" : index + 1}
            </span>
            <span className={cn(index === step ? "font-medium" : "text-muted-foreground")}>{label}</span>
            {index < STEPS.length - 1 && <span aria-hidden="true" className="mx-1 h-px w-8 bg-border" />}
          </li>
        ))}
      </ol>

      {step === 2 && order ? (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 rounded-xl border bg-card p-10 text-center">
          <CheckCircle2Icon className="size-12 text-success" />
          <h2 className="font-display text-2xl tracking-tight">Order confirmed</h2>
          <p className="text-muted-foreground">
            Order <span className="tnum font-medium text-foreground">{order.orderNumber}</span> is
            being prepared. A confirmation email is on its way.
          </p>
          <dl className="w-full rounded-lg border bg-background p-4 text-left text-sm">
            <div className="flex justify-between py-0.5">
              <dt className="text-muted-foreground">Estimated delivery</dt>
              <dd>{order.estimatedDelivery}</dd>
            </div>
            <div className="flex justify-between py-0.5">
              <dt className="text-muted-foreground">Shipping to</dt>
              <dd>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </dd>
            </div>
            <div className="flex justify-between py-0.5 font-medium">
              <dt>Total paid</dt>
              <dd className="tnum">{formatPrice(order.total)}</dd>
            </div>
          </dl>
          <Button onClick={() => navigate("/products")}>Continue shopping</Button>
        </div>
      ) : (
        <form
          onSubmit={form.handleSubmit(handlePlaceOrder)}
          className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start"
          noValidate
        >
          <div className="flex flex-col gap-8">
            <section aria-label="Contact and shipping address" className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                1 · Contact & address
              </p>
              <FormField label="Email" name="email" form={form} type="email" placeholder="you@studio.com" />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="First name" name="firstName" form={form} />
                <FormField label="Last name" name="lastName" form={form} />
              </div>
              <FormField label="Street address" name="address" form={form} placeholder="123 Signal Path Ave" />
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField label="City" name="city" form={form} />
                <FormField label="State" name="state" form={form} placeholder="OR" />
                <FormField label="ZIP code" name="postalCode" form={form} placeholder="97209" />
              </div>
            </section>

            <Separator />

            <section aria-label="Payment details" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  2 · Payment
                </p>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LockIcon className="size-3.5" /> Encrypted & secure
                </span>
              </div>

              <RadioGroup defaultValue="card" className="flex gap-3">
                <Label
                  htmlFor="pay-card"
                  className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal has-[[data-state=checked]]:border-primary"
                >
                  <RadioGroupItem value="card" id="pay-card" />
                  <CreditCardIcon className="size-4 text-muted-foreground" />
                  Card
                </Label>
                <Label
                  htmlFor="pay-paypal"
                  className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal opacity-50 has-[[data-state=checked]]:border-primary"
                >
                  <RadioGroupItem value="paypal" id="pay-paypal" disabled />
                  PayPal (coming soon)
                </Label>
              </RadioGroup>

              <FormField label="Name on card" name="cardName" form={form} />
              <FormField
                label="Card number"
                name="cardNumber"
                form={form}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiry (MM/YY)" name="cardExpiry" form={form} placeholder="08/28" inputMode="numeric" />
                <FormField label="CVC" name="cardCvc" form={form} placeholder="123" inputMode="numeric" />
              </div>
            </section>
          </div>

          <aside aria-label="Order summary" className="flex flex-col gap-4 rounded-xl border bg-card p-6 lg:sticky lg:top-32">
            <p className="font-semibold">Summary</p>
            <ul className="flex max-h-56 flex-col divide-y overflow-y-auto text-sm">
              {items.map((item) => {
                const product = getProductById(item.productId)
                const variant = product?.variants.find((v) => v.id === item.variantId)
                const unitPrice =
                  variant?.salePrice ?? variant?.price ?? product?.salePrice ?? product?.price ?? 0
                return (
                  <li key={item.id} className="flex justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                    <span className="min-w-0 truncate text-muted-foreground">
                      {product?.name} × <span className="tnum">{item.quantity}</span>
                    </span>
                    <span className="tnum shrink-0">{formatPrice(unitPrice * item.quantity)}</span>
                  </li>
                )
              })}
            </ul>
            <Separator />
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tnum">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Discount</dt>
                  <dd className="tnum">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tnum">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="tnum">{formatPrice(tax)}</dd>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd className="tnum">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Processing…" : `Pay ${formatPrice(total)}`}
            </Button>
          </aside>
        </form>
      )}
    </div>
  )
}

interface FormFieldProps {
  label: string
  name: keyof CheckoutForm
  form: ReturnType<typeof useForm<CheckoutForm>>
  type?: string
  placeholder?: string
  inputMode?: "numeric" | "text" | "email"
}

function FormField({ label, name, form, type = "text", placeholder, inputMode }: FormFieldProps) {
  const error = form.formState.errors[name]
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`checkout-${name}`} className="text-sm">
        {label}
      </Label>
      <Input
        id={`checkout-${name}`}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        {...form.register(name)}
      />
      {error?.message && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
