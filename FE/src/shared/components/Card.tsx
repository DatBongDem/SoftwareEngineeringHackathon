import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export function Card({ className, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 dark:border-slate-800/80 dark:bg-[#111726]',
        interactive &&
          'hover:-translate-y-1 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:border-indigo-500/40 dark:hover:shadow-indigo-500/10 cursor-pointer',
        className,
      )}
      {...props}
    />
  )
}
