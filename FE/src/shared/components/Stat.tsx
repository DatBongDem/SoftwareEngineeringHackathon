import { type ReactNode, useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/cn'

interface StatProps {
  label: string
  value: ReactNode
  icon?: LucideIcon
  className?: string
  /** Override the icon badge's background/text color (defaults to indigo). */
  iconClassName?: string
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Counts 0 -> target with an ease-out curve; jumps straight to target if the
// user has prefers-reduced-motion set.
function useCountUp(target: number, durationMs = 700) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? target : 0))
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(target)
      return
    }
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(target * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, durationMs])

  return display
}

// The "big number" typography tier — for scores, ranks, and counts (Ranking/Judging
// reuse this). Numeric `value`s count up on mount; non-numeric values (e.g. "N/A")
// render as-is.
export function Stat({ label, value, icon: Icon, className, iconClassName }: StatProps) {
  const isNumeric = typeof value === 'number'
  const animated = useCountUp(isNumeric ? value : 0)

  return (
    <div className={cn('animate-count-up flex items-center gap-3', className)}>
      {Icon && (
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            iconClassName ?? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300',
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div>
        <p className="font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
          {isNumeric ? animated : value}
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}
