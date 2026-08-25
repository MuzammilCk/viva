import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline"
  size?: "sm" | "md" | "lg"
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", dot = false, children, ...props }, ref) => {
    const variants = {
      default:
        "bg-[var(--color-bg-tertiary)] text-[var(--color-fg-secondary)] border border-[var(--color-border-default)] " +
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] " +
        "hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg-primary)]",
      primary:
        "bg-[rgba(0,212,255,0.12)] text-[var(--color-accent-cyan)] border border-[rgba(0,212,255,0.3)] " +
        "shadow-[inset_0_1px_0_rgba(0,212,255,0.12)] " +
        "hover:bg-[rgba(0,212,255,0.18)] hover:border-[var(--color-accent-cyan)] " +
        "hover:shadow-[0_0_12px_rgba(0,212,255,0.35),inset_0_1px_0_rgba(0,212,255,0.18)]",
      secondary:
        "bg-[rgba(255,184,0,0.12)] text-[var(--color-accent-amber)] border border-[rgba(255,184,0,0.3)] " +
        "shadow-[inset_0_1px_0_rgba(255,184,0,0.12)] " +
        "hover:bg-[rgba(255,184,0,0.18)] hover:border-[var(--color-accent-amber)] " +
        "hover:shadow-[0_0_12px_rgba(255,184,0,0.35),inset_0_1px_0_rgba(255,184,0,0.18)]",
      success:
        "bg-[rgba(0,255,136,0.12)] text-[var(--color-accent-emerald)] border border-[rgba(0,255,136,0.3)] " +
        "shadow-[inset_0_1px_0_rgba(0,255,136,0.12)] " +
        "hover:bg-[rgba(0,255,136,0.18)] hover:border-[var(--color-accent-emerald)] " +
        "hover:shadow-[0_0_12px_rgba(0,255,136,0.35),inset_0_1px_0_rgba(0,255,136,0.18)]",
      warning:
        "bg-[rgba(255,184,0,0.12)] text-[var(--color-accent-amber)] border border-[rgba(255,184,0,0.3)] " +
        "shadow-[inset_0_1px_0_rgba(255,184,0,0.12)] " +
        "hover:bg-[rgba(255,184,0,0.18)] hover:border-[var(--color-accent-amber)] " +
        "hover:shadow-[0_0_12px_rgba(255,184,0,0.35),inset_0_1px_0_rgba(255,184,0,0.18)]",
      error:
        "bg-[rgba(255,77,77,0.12)] text-[var(--color-accent-coral)] border border-[rgba(255,77,77,0.3)] " +
        "shadow-[inset_0_1px_0_rgba(255,77,77,0.12)] " +
        "hover:bg-[rgba(255,77,77,0.18)] hover:border-[var(--color-accent-coral)] " +
        "hover:shadow-[0_0_12px_rgba(255,77,77,0.35),inset_0_1px_0_rgba(255,77,77,0.18)]",
      outline:
        "bg-transparent text-[var(--color-fg-secondary)] border border-[var(--color-border-default)] " +
        "hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)] " +
        "hover:bg-[rgba(0,212,255,0.05)] hover:shadow-[0_0_10px_rgba(0,212,255,0.2)]",
    }

    const sizes = {
      sm: "px-2 py-0.5 text-[10px] gap-1",
      md: "px-2.5 py-1 text-[11px] gap-1.5",
      lg: "px-3 py-1.5 text-[12px] gap-2",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-semibold font-[var(--font-mono)] uppercase tracking-wider rounded-full",
          "transition-[background-color,border-color,box-shadow,color] duration-150 ease-out",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "rounded-full",
              variant === "primary" && "bg-[var(--color-accent-cyan)] shadow-[0_0_6px_rgba(0,212,255,0.6)]",
              variant === "secondary" && "bg-[var(--color-accent-amber)] shadow-[0_0_6px_rgba(255,184,0,0.6)]",
              variant === "success" && "bg-[var(--color-accent-emerald)] shadow-[0_0_6px_rgba(0,255,136,0.6)]",
              variant === "warning" && "bg-[var(--color-accent-amber)] shadow-[0_0_6px_rgba(255,184,0,0.6)]",
              variant === "error" && "bg-[var(--color-accent-coral)] shadow-[0_0_6px_rgba(255,77,77,0.6)]",
              variant === "default" && "bg-[var(--color-fg-muted)]",
              variant === "outline" && "bg-[var(--color-fg-muted)]",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2.5 h-2.5"
            )}
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"