import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "dashed" | "dotted" | "gradient"
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = "horizontal", variant = "default", ...props }, ref) => {
    const variants = {
      default: "",
      dashed: "border-dashed",
      dotted: "border-dotted",
      // Gradient: a glowing cyan hairline that fades to transparent.
      // Implemented as an invisible border + a background image (works for both
      // horizontal and vertical orientations).
      gradient: "border-transparent",
    }

    const orientations = {
      horizontal: "w-full border-t",
      vertical: "h-full border-l",
    }

    const gradientStyle =
      variant === "gradient"
        ? orientation === "horizontal"
          ? {
              backgroundImage:
                "linear-gradient(90deg, transparent, var(--color-accent-cyan), transparent)",
                  height: "1px",
            }
          : {
              backgroundImage:
                "linear-gradient(180deg, transparent, var(--color-accent-cyan), transparent)",
              width: "1px",
            }
        : undefined

    return (
      <hr
        ref={ref}
        className={cn(
          variant !== "gradient" && "border-[var(--color-border-default)]",
          orientations[orientation],
          variants[variant],
          className
        )}
        style={gradientStyle}
        {...props}
      />
    )
  }
)

Divider.displayName = "Divider"