import { Gavel, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMyAssignedRounds } from '../hooks/useMyAssignedRounds'
import { Alert, buttonClassName, Card, CardGridSkeleton, EmptyState, PageHeader, Reveal } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function JudgingQueuePage() {
  const { data: assignedRounds, isLoading, error } = useMyAssignedRounds()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Judging" description="Rounds assigned to you for scoring." />

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <CardGridSkeleton />}

      {assignedRounds && assignedRounds.length === 0 && (
        <EmptyState icon={Gavel} message="You are not assigned to judge any round yet." />
      )}

      {assignedRounds && assignedRounds.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignedRounds.map(({ event, round }, i) => (
            <Reveal key={round.id} delayMs={i * 60} className="h-full">
              <Card interactive className="flex h-full flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600 tabular-nums dark:bg-indigo-900/40 dark:text-indigo-300">
                    {round.roundNumber}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{round.name}</p>
                    <p className="text-xs text-slate-500">{event.title}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <Link
                    to={`/rounds/${round.id}/judge?eventId=${event.id}`}
                    className={buttonClassName({ size: 'sm' })}
                  >
                    <Gavel className="h-3.5 w-3.5" />
                    Score submissions
                  </Link>
                  <Link
                    to={`/rounds/${round.id}/calibration?eventId=${event.id}`}
                    aria-label="View calibration dashboard"
                    className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'px-2' })}
                  >
                    <LineChart className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
