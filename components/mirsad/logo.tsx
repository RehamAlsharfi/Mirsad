import { cn } from '@/lib/utils'

// Mirsad radar-style mark: concentric watch arcs with a scanning point.
// Geometric and restrained — no cartoon or AI imagery.
export function MirsadMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('h-9 w-9', className)}
      role="img"
      aria-label="شعار مِرْصاد"
      fill="none"
    >
      <circle cx="20" cy="20" r="18.5" fill="var(--navy)" />
      <path
        d="M20 8.5a11.5 11.5 0 1 1-9.9 5.7"
        stroke="var(--cyan)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M20 13a7 7 0 1 1-5.6 2.8"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="20"
        x2="29"
        y2="12.5"
        stroke="var(--cyan)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="29" cy="12.5" r="2.4" fill="var(--cyan)" />
      <circle cx="20" cy="20" r="1.8" fill="#ffffff" />
    </svg>
  )
}

export function MirsadWordmark({
  className,
  showTagline = false,
  onDark = false,
}: {
  className?: string
  showTagline?: boolean
  onDark?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <MirsadMark />
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            'text-xl font-bold tracking-tight',
            onDark ? 'text-white' : 'text-navy',
          )}
        >
          مِرْصاد
        </span>
        {showTagline && (
          <span
            className={cn(
              'text-[11px] font-medium',
              onDark ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            من رصد بوادر التعثّر إلى التدخّل الاستباقي
          </span>
        )}
      </div>
    </div>
  )
}
