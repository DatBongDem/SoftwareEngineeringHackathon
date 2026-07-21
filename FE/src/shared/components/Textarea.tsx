import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? props.name ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {props.required && <span className="text-rose-500"> *</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600',
          error && 'border-rose-400 hover:border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
}
