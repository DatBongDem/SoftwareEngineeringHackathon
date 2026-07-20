import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  dot?: boolean
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-emerald-100 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-400/20',
  warning: 'bg-amber-100 text-amber-700 ring-amber-600/10 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-400/20',
  danger: 'bg-rose-100 text-rose-700 ring-rose-600/10 dark:bg-rose-900/40 dark:text-rose-300 dark:ring-rose-400/20',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-400/10',
  info: 'bg-indigo-100 text-indigo-700 ring-indigo-600/10 dark:bg-indigo-900/40 dark:text-indigo-300 dark:ring-indigo-400/20',
}

const dotClasses: Record<BadgeTone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-slate-500',
  info: 'bg-indigo-500',
}

export function Badge({ tone = 'neutral', dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} />}
      {children}
    </span>
  )
}
