import { cn } from '@/lib/utils'
import { INDICATOR_META, type RiskIndicator } from '@/lib/mirsad-data'

export function StatusBadge({
  indicator,
  className,
  showDot = true,
}: {
  indicator: RiskIndicator
  className?: string
  showDot?: boolean
}) {
  const meta = INDICATOR_META[indicator]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        className,
      )}
      style={{ backgroundColor: meta.soft, color: meta.text }}
    >
      {showDot && (
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: meta.color }}
          aria-hidden
        />
      )}
      {meta.label}
    </span>
  )
}
