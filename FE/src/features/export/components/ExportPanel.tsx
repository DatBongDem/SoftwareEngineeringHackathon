import { Database, FileSpreadsheet, Gauge } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRounds } from '@/features/events/hooks/useRounds'
import { ExportRankingsCsvButton } from './ExportRankingsCsvButton'
import { ExportRblDatasetCsvButton } from './ExportRblDatasetCsvButton'
import { Card, EmptyState, Reveal, Skeleton, buttonClassName } from '@/shared/components'

export function ExportPanel({ eventId }: { eventId: string }) {
  const { data: rounds, isLoading } = useRounds(eventId)

  return (
    <div className="flex flex-col gap-6 pt-4">
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
            <Database className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">Anonymized RBL dataset</p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Every judge/criterion score for this event, with submission and judge IDs anonymized — for
              external research analysis (RBL requirement).
            </p>
          </div>
        </div>
        <ExportRblDatasetCsvButton eventId={eventId} />
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-400 uppercase">
          Round rankings
        </h2>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && rounds && rounds.length === 0 && (
          <EmptyState icon={FileSpreadsheet} message="No rounds to export yet." />
        )}

        {rounds && rounds.length > 0 && (
          <div className="flex flex-col gap-3">
            {rounds
              .slice()
              .sort((a, b) => a.roundNumber - b.roundNumber)
              .map((round, i) => (
                <Reveal key={round.id} delayMs={i * 50}>
                  <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600 tabular-nums dark:bg-indigo-900/40 dark:text-indigo-300">
                        {round.roundNumber}
                      </span>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{round.name}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        to={`/rounds/${round.id}/calibration?eventId=${eventId}`}
                        className={buttonClassName({ variant: 'secondary', size: 'sm' })}
                      >
                        <Gauge className="h-3.5 w-3.5" />
                        Calibration
                      </Link>
                      <ExportRankingsCsvButton roundId={round.id} />
                    </div>
                  </Card>
                </Reveal>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
