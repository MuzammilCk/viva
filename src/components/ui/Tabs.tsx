import { forwardRef, type HTMLAttributes, useState, createContext, useContext } from "react"
import { cn } from "@/lib/utils"

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within Tabs")
  }
  return context
}

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
  defaultValue?: string
  orientation?: "horizontal" | "vertical"
}

export function Tabs({ value, onValueChange, children, className, defaultValue, orientation = "horizontal" }: TabsProps) {
  const [internalValue, setInternalValue] = useState(value || defaultValue || "")
  const controlled = value !== undefined

  const currentValue = controlled ? value : internalValue
  const handleChange = (newValue: string) => {
    if (!controlled) setInternalValue(newValue)
    onValueChange(newValue)
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      <div className={cn(className)} data-orientation={orientation}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-strong inline-flex items-center justify-center gap-1 p-1 rounded-full",
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
)

TabsList.displayName = "TabsList"

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    const { value: currentValue, onValueChange } = useTabsContext()
    const isActive = currentValue === value

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
        data-state={isActive ? "active" : "inactive"}
        data-disabled={disabled}
        onClick={() => !disabled && onValueChange(value)}
        className={cn(
          "group/trigger relative inline-flex items-center justify-center gap-2 px-4 py-2",
          "text-sm font-medium rounded-full whitespace-nowrap select-none",
          "transition-[color,background-color,box-shadow,border-color,transform] duration-150",
          "ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-focus-ring)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : isActive
            ? "text-[var(--color-fg-primary)] bg-[var(--color-accent-cyan)]/[0.12] shadow-[inset_0_0_0_1px_var(--color-accent-cyan),var(--shadow-glow-cyan)] hover:-translate-y-px"
            : "text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-bg-secondary)]/40",
          className
        )}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        {/* Animated active indicator — dependency-free cyan underline that follows the active tab */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-2 bottom-0 h-px rounded-full",
            "bg-[var(--color-accent-cyan)]",
            "transition-[opacity,transform,scaleX] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "origin-center -translate-y-px",
            isActive && !disabled
              ? "opacity-100 scale-x-100 shadow-[0_0_8px_var(--color-accent-cyan)]"
              : "opacity-0 scale-x-50"
          )}
        />
      </button>
    )
  }
)

TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: boolean
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, forceMount = false, children, ...props }, ref) => {
    const { value: currentValue } = useTabsContext()
    const isActive = currentValue === value

    if (!forceMount && !isActive) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        aria-labelledby={`tabs-trigger-${value}`}
        data-state={isActive ? "active" : "inactive"}
        data-value={value}
        className={cn(
          "mt-4 font-[var(--font-body)] animate-fade-in",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-focus-ring)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabsContent.displayName = "TabsContent"