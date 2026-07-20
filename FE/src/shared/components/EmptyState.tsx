import type { ReactNode } from 'react'
import { Inbox, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  message: string
  action?: ReactNode
  icon?: LucideIcon
}

export function EmptyState({ message, action, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <span className="rounded-full bg-slate-100 p-3 text-slate-400 dark:bg-slate-800">
        <Icon className="h-5 w-5" />
      </span>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {action}
    </div>
  )
}
