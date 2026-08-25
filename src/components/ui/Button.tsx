import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent"
  size?: "sm" | "md" | "lg" | "xl" | "icon"
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-[var(--color-accent-cyan)] text-[var(--color-fg-inverse)] border-[var(--color-accent-cyan)] " +
        "shadow-[var(--shadow-glow-cyan)] " +
        "hover:bg-[var(--color-accent-cyan-dim)] hover:border-[var(--color-accent-cyan-dim)] " +
        "hover:shadow-[0_0_28px_rgba(0,212,255,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-px " +
        "active:bg-[var(--color-accent-cyan-dim)] active:translate-y-0 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]",
      secondary:
        "bg-[var(--color-bg-tertiary)] text-[var(--color-fg-primary)] border-[var(--color-border-default)] " +
        "shadow-[var(--shadow-inner)] " +
        "hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)] " +
        "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-px " +
        "active:bg-[var(--color-bg-elevated)] active:translate-y-0 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)]",
      outline:
        "bg-transparent text-[var(--color-fg-primary)] border-[var(--color-border-default)] " +
        "hover:border-[var(--color-accent-cyan)] hover:text-[var(--color-accent-cyan)] " +
        "hover:bg-[rgba(0,212,255,0.06)] hover:shadow-[0_0_16px_rgba(0,212,255,0.18)] " +
        "active:bg-[rgba(0,212,255,0.12)] active:shadow-none",
      ghost:
        "bg-transparent text-[var(--color-fg-secondary)] border-transparent " +
        "hover:text-[var(--color-accent-cyan)] hover:bg-[rgba(0,212,255,0.06)] " +
        "hover:border-[var(--color-accent-cyan-dim)] " +
        "active:bg-[rgba(0,212,255,0.1)] active:shadow-none",
      destructive:
        "bg-[var(--color-accent-coral)] text-[var(--color-fg-inverse)] border-[var(--color-accent-coral)] " +
        "shadow-[var(--shadow-glow-coral)] " +
        "hover:bg-[var(--color-accent-coral-dim)] hover:border-[var(--color-accent-coral-dim)] " +
        "hover:shadow-[0_0_28px_rgba(255,77,77,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-px " +
        "active:bg-[var(--color-accent-coral-dim)] active:translate-y-0 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]",
      accent:
        "bg-[var(--color-accent-amber)] text-[var(--color-fg-inverse)] border-[var(--color-accent-amber)] " +
        "shadow-[var(--shadow-glow-amber)] " +
        "hover:bg-[var(--color-accent-amber-dim)] hover:border-[var(--color-accent-amber-dim)] " +
        "hover:shadow-[0_0_28px_rgba(255,184,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-px " +
        "active:bg-[var(--color-accent-amber-dim)] active:translate-y-0 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5 h-8",
      md: "px-5 py-2 text-sm gap-2 h-10",
      lg: "px-6 py-3 text-base gap-2.5 h-12",
      xl: "px-8 py-4 text-lg gap-3 h-14",
      icon: "p-2 h-10 w-10",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg border",
          "transition-[background-color,border-color,box-shadow,color,transform] duration-150 ease-out",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0",
          "focus-visible:ring-[3px] focus-visible:ring-[var(--color-focus-ring)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn("w-4 h-4 animate-spin", size === "sm" && "w-3 h-3", size === "xl" && "w-5 h-5")} />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"