import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"

export function PageSkeleton({
  showHeader = true,
  cardCount = 6,
  columns = { base: 1, md: 2, lg: 3 }
}: {
  showHeader?: boolean
  cardCount?: number
  columns?: { base: number; md: number; lg: number }
}) {
  return (
    <div className="container py-12">
      {showHeader && (
        <div className="space-y-4 mb-12">
          {/* Scanline header strip — HUD readout feel */}
          <div className="flex items-center gap-2">
            <span className="bg-scanline inline-block h-2 w-2 rounded-full bg-[var(--color-bg-tertiary)] shadow-[var(--shadow-glow-cyan)]" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
          <Skeleton className="h-10 w-1/4 rounded-lg" />
          <Skeleton variant="text" className="h-6 w-1/2 max-w-2xl" />
        </div>
      )}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${columns.base}, 1fr)`,
        }}
      >
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="glass rounded-xl p-4 space-y-3 border-[var(--color-border-subtle)]"
          >
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton variant="text" className="h-5 w-3/4" />
            <Skeleton variant="text" className="h-5 w-1/2" />
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="h-5 w-1/4" />
              <span
                className={cn(
                  "inline-block h-5 w-5 rounded-full",
                  "bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}