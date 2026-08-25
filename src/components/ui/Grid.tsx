import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
  rows?: number | "auto"
}

const gapSizes = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, children, columns = { base: 1 }, gap = "md", rows, ...props }, ref) => {
    const columnStyles = []
    if (columns.base) columnStyles.push(`grid-cols-${columns.base}`)
    if (columns.sm) columnStyles.push(`sm:grid-cols-${columns.sm}`)
    if (columns.md) columnStyles.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) columnStyles.push(`lg:grid-cols-${columns.lg}`)
    if (columns.xl) columnStyles.push(`xl:grid-cols-${columns.xl}`)

    const rowStyles = rows === "auto" ? "grid-rows-auto" : rows ? `grid-rows-${rows}` : ""

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          gapSizes[gap],
          columnStyles.join(" "),
          rowStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = "Grid"

// Column component for explicit column control
interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  span?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
  start?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
  end?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
}

export const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ className, children, span, start, end, ...props }, ref) => {
    const spanStyles = []
    if (typeof span === "number") {
      spanStyles.push(`col-span-${span}`)
    } else if (span) {
      if (span.base) spanStyles.push(`col-span-${span.base}`)
      if (span.sm) spanStyles.push(`sm:col-span-${span.sm}`)
      if (span.md) spanStyles.push(`md:col-span-${span.md}`)
      if (span.lg) spanStyles.push(`lg:col-span-${span.lg}`)
      if (span.xl) spanStyles.push(`xl:col-span-${span.xl}`)
    }

    const startStyles = []
    if (typeof start === "number") {
      startStyles.push(`col-start-${start}`)
    } else if (start) {
      if (start.base) startStyles.push(`col-start-${start.base}`)
      if (start.sm) startStyles.push(`sm:col-start-${start.sm}`)
      if (start.md) startStyles.push(`md:col-start-${start.md}`)
      if (start.lg) startStyles.push(`lg:col-start-${start.lg}`)
      if (start.xl) startStyles.push(`xl:col-start-${start.xl}`)
    }

    const endStyles = []
    if (typeof end === "number") {
      endStyles.push(`col-end-${end}`)
    } else if (end) {
      if (end.base) endStyles.push(`col-end-${end.base}`)
      if (end.sm) endStyles.push(`sm:col-end-${end.sm}`)
      if (end.md) endStyles.push(`md:col-end-${end.md}`)
      if (end.lg) endStyles.push(`lg:col-end-${end.lg}`)
      if (end.xl) endStyles.push(`xl:col-end-${end.xl}`)
    }

    return (
      <div
        ref={ref}
        className={cn(spanStyles.join(" "), startStyles.join(" "), endStyles.join(" "), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Column.displayName = "Column"

// Row component
interface RowProps extends HTMLAttributes<HTMLDivElement> {
  span?: number
}

export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ className, children, span, ...props }, ref) => {
    const spanStyles = span ? `row-span-${span}` : ""

    return (
      <div
        ref={ref}
        className={cn(spanStyles, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Row.displayName = "Row"