import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  /** Rendered inside the field on the right, e.g. a show/hide password toggle. */
  trailing?: ReactNode
}

export function Input({ label, error, icon, trailing, id, className, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {props.required && <span className="text-rose-500"> *</span>}
        </label>
      )}
      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors group-focus-within:text-indigo-500">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600',
            Boolean(icon) && 'pl-9',
            Boolean(trailing) && 'pr-9',
            error && 'border-rose-400 hover:border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
            className,
          )}
          {...props}
        />
        {trailing && <span className="absolute inset-y-0 right-0 flex items-center pr-2">{trailing}</span>}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
}
