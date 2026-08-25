import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "interactive" | "glass" | "glassCyan"
  padding?: "none" | "sm" | "md" | "lg"
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const variants = {
      default:
        "bg-[var(--color-bg-card)] border border-[var(--color-border-default)] " +
        "shadow-[var(--shadow-inner)]",
      elevated:
        "bg-[var(--color-bg-card)] border border-[var(--color-border-default)] " +
        "shadow-[var(--shadow-lg),var(--shadow-inner)]",
      outlined:
        "bg-transparent border-2 border-[var(--color-border-strong)] " +
        "shadow-[var(--shadow-inner)]",
      interactive:
        "bg-[var(--color-bg-card)] border border-[var(--color-border-default)] " +
        "shadow-[var(--shadow-inner)] " +
        "transition-[background-color,border-color,box-shadow,transform] duration-200 " +
        "cursor-pointer " +
        "hover:border-[var(--color-accent-cyan)] hover:shadow-[var(--shadow-glow-cyan)] " +
        "hover:-translate-y-0.5",
      glass: "glass",
      glassCyan: "glass-cyan",
    }

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl",
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-semibold text-[var(--color-fg-primary)] tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
)

CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-[var(--color-fg-secondary)] mt-1", className)}
      {...props}
    >
      {children}
    </p>
  )
)

CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-4 flex items-center gap-3", className)}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = "CardFooter"