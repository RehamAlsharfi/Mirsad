import { cn } from '@/lib/utils'
import { INDICATOR_META, type RiskIndicator } from '@/lib/mirsad-data'

// Employee-only risk indicator. Presents the conceptual risk score derived from
// multiple signals — not a simple timer.
export function RiskGauge({
  score,
  indicator,
  size = 128,
  className,
}: {
  score: number
  indicator: RiskIndicator
  size?: number
  className?: string
}) {
  const meta = INDICATOR_META[indicator]
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={meta.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold tnum" style={{ color: meta.text }}>
          {score}%
        </span>
        <span className="text-[11px] text-muted-foreground">احتمالية التعثّر</span>
      </div>
    </div>
  )
}
