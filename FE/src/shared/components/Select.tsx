import { useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({ label, error, id, className, options, placeholder, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? props.name ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {props.required && <span className="text-rose-500"> *</span>}
        </label>
      )}
      <div className="group relative">
        <select
          id={selectId}
          className={cn(
            'w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600',
            error && 'border-rose-400 hover:border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
}
