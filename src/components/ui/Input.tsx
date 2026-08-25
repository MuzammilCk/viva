import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-fg-primary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-fg-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg",
              "text-[var(--color-fg-primary)] placeholder-[var(--color-fg-muted)]",
              "shadow-[var(--shadow-inner)]",
              "transition-[background-color,border-color,box-shadow] duration-150",
              "hover:not(:disabled):not([readonly]):border-[var(--color-border-strong)]",
              "focus:outline-none focus:border-[var(--color-focus)] focus:ring-[3px] focus:ring-[var(--color-focus-ring)] " +
                "focus:bg-[var(--color-bg-tertiary)] focus:shadow-[0_0_0_4px_rgba(0,212,255,0.06)]",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
              "read-only:bg-[var(--color-bg-tertiary)]/50",
              error && "border-[var(--color-error)] focus:ring-[rgba(255,77,77,0.2)] focus:shadow-[0_0_0_4px_rgba(255,77,77,0.06)]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--color-fg-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
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

Input.displayName = "Input"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const errorId = `${textareaId}-error`
    const hintId = `${textareaId}-hint`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--color-fg-primary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg",
            "text-[var(--color-fg-primary)] placeholder-[var(--color-fg-muted)]",
            "shadow-[var(--shadow-inner)] resize-y min-h-[100px]",
            "transition-[background-color,border-color,box-shadow] duration-150",
            "hover:not(:disabled):not([readonly]):border-[var(--color-border-strong)]",
            "focus:outline-none focus:border-[var(--color-focus)] focus:ring-[3px] focus:ring-[var(--color-focus-ring)] " +
              "focus:bg-[var(--color-bg-tertiary)] focus:shadow-[0_0_0_4px_rgba(0,212,255,0.06)]",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
            "read-only:bg-[var(--color-bg-tertiary)]/50",
            error && "border-[var(--color-error)] focus:ring-[rgba(255,77,77,0.2)] focus:shadow-[0_0_0_4px_rgba(255,77,77,0.06)]",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
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

Textarea.displayName = "Textarea"

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