import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

// Copies an ID to the clipboard and flips to a checkmark briefly for feedback —
// used wherever a coordinator needs to grab a raw user ID to paste into another
// form (Assign Judges/Mentor have no user picker yet, see docs/frontend-plan.md).
export function CopyIdButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access can be denied (insecure context, browser permission) —
      // fail silently rather than throw; the ID is still visible as plain text.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'ID copied' : 'Copy ID to clipboard'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy ID'}
    </button>
  )
}
