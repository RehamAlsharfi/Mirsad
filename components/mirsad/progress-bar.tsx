import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  color = 'var(--cyan)',
  className,
}: {
  value: number
  color?: string
  className?: string
}) {
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  )
}
