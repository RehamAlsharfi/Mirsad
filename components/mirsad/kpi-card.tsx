import { cn } from '@/lib/utils'

export function KpiCard({
  label,
  value,
  hint,
  accent,
  icon: Icon,
  className,
}: {
  label: string
  value: string | number
  hint?: string
  accent?: string // css color for the value / dot
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && (
          <span
            className="flex size-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: accent ? `color-mix(in oklab, ${accent} 12%, white)` : 'var(--muted)',
              color: accent ?? 'var(--muted-foreground)',
            }}
          >
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <span
        className="text-2xl font-bold tnum sm:text-3xl"
        style={{ color: accent ?? 'var(--navy)' }}
      >
        {value}
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}
