import { cn } from '@/shared/lib/cn'

interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Loading...' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-500 dark:text-slate-400">
      <span
        className={cn(
          'h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent',
          className,
        )}
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
