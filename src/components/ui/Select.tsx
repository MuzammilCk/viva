import { forwardRef, type SelectHTMLAttributes, type LabelHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  placeholder?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, placeholder, options, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const errorId = `${selectId}-error`
    const hintId = `${selectId}-hint`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--color-fg-primary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg",
            "text-[var(--color-fg-primary)]",
            "shadow-[var(--shadow-inner)]",
            "transition-[background-color,border-color,box-shadow] duration-150 appearance-none",
            "hover:not(:disabled):border-[var(--color-border-strong)]",
            "focus:outline-none focus:border-[var(--color-focus)] focus:ring-[3px] focus:ring-[var(--color-focus-ring)] " +
              "focus:bg-[var(--color-bg-tertiary)] focus:shadow-[0_0_0_4px_rgba(0,212,255,0.06)]",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
            error && "border-[var(--color-error)] focus:ring-[rgba(255,77,77,0.2)] focus:shadow-[0_0_0_4px_rgba(255,77,77,0.06)]",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-[var(--color-fg-muted)]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "block text-sm font-medium text-[var(--color-fg-primary)] mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
)

Label.displayName = "Label"