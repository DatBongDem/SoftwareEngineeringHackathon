import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'
import { buttonClassName } from '@/shared/components'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center dark:bg-slate-950">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        <CompassIcon className="h-6 w-6" />
      </span>
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">404</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This page doesn't exist.</p>
      </div>
      <Link to="/" className={buttonClassName({ variant: 'secondary' })}>
        Back to Dashboard
      </Link>
    </div>
  )
}
