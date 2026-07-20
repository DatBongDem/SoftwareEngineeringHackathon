import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface StatProps {
  label: string
  value: ReactNode
  icon?: LucideIcon
}

// The "big number" typography tier — for scores, ranks, and counts (Ranking/Judging
// will reuse this once built; see docs/frontend-plan.md).
export function Stat({ label, value, icon: Icon }: StatProps) {
  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div>
        <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
          {value}
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}
