import { cn } from '@/lib/utils'
import type { JourneyStage } from '@/lib/mirsad-data'
import { Check, MapPin, Clock } from 'lucide-react'

export function JourneyTimeline({
  stages,
  className,
}: {
  stages: JourneyStage[]
  className?: string
}) {
  return (
    <ol className={cn('relative flex flex-col', className)}>
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1
        const done = stage.state === 'done'
        const current = stage.state === 'current'
        return (
          <li key={stage.name} className="relative flex gap-4 pb-6 last:pb-0">
            {/* connector line (RTL: sits on the right of the dot column) */}
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-8 bottom-0 right-[15px] w-0.5',
                  done ? 'bg-cyan/60' : 'bg-border',
                )}
              />
            )}

            {/* node */}
            <span
              aria-hidden
              className={cn(
                'z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-white',
                done && 'border-cyan bg-cyan',
                current && 'border-cyan bg-white ring-4 ring-cyan/15',
                stage.state === 'upcoming' && 'border-border bg-white',
              )}
            >
              {done ? (
                <Check className="size-4" strokeWidth={3} />
              ) : (
                <span
                  className={cn(
                    'size-2.5 rounded-full',
                    current ? 'bg-cyan' : 'bg-muted-foreground/40',
                  )}
                />
              )}
            </span>

            {/* content */}
            <div
              className={cn(
                'flex-1 rounded-xl border px-4 py-3',
                current
                  ? 'border-cyan/40 bg-accent/50'
                  : 'border-transparent bg-transparent',
              )}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h4 className="font-semibold text-navy">{stage.name}</h4>
                {current && (
                  <span className="rounded-full bg-cyan px-2 py-0.5 text-[10px] font-bold text-white">
                    المرحلة الحالية
                  </span>
                )}
              </div>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                {stage.entity}
              </p>

              <p className="mt-1.5 text-sm text-foreground/90">
                آخر إجراء: {stage.lastAction}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground tnum">
                {stage.date !== '—' && (
                  <span>
                    {stage.date} — {stage.time}
                  </span>
                )}
                {stage.durationLabel !== '—' && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    المدة: {stage.durationLabel}
                    {stage.expectedLabel && (
                      <span className="text-muted-foreground/70">
                        {' '}
                        / المتوقّع {stage.expectedLabel}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
