import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { buttonClassName } from '@/shared/components'

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center dark:bg-slate-950">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/30">
        <ShieldAlert className="h-6 w-6" />
      </span>
      <div>
        <h1 className="font-display text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          403
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          You don't have permission to view this page.
        </p>
      </div>
      <Link to="/" className={buttonClassName({ variant: 'secondary' })}>
        Back to Dashboard
      </Link>
    </div>
  )
}
