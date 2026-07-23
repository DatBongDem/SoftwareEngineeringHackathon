import { ListOrdered } from 'lucide-react'
import { useEventRanking } from '../hooks/useEventRanking'
import { RankingTable } from './RankingTable'
import { Alert, Badge, EmptyState, TableSkeleton, type TableColumn } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { EventRankingEntry } from '../types'

const extraColumns: TableColumn<EventRankingEntry>[] = [
  {
    header: 'Track',
    render: (row) =>
      row.trackName ? (
        <Badge tone="neutral">{row.trackName}</Badge>
      ) : (
        <span className="text-xs text-slate-500">—</span>
      ),
  },
  {
    header: 'Reached',
    render: (row) => (
      <span className="text-sm text-slate-600 dark:text-slate-300">
        Round {row.roundNumber} — {row.roundName}
      </span>
    ),
  },
]

export function EventRankingPanel({ eventId }: { eventId: string }) {
  const { data: ranking, isLoading, error } = useEventRanking(eventId)

  return (
    <div className="flex flex-col gap-4 pt-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Overall standings — each team is placed by the furthest round it reached, then by that round's
        score.
      </p>

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <TableSkeleton columns={6} rows={4} />}

      {!isLoading && ranking && ranking.length === 0 && (
        <EmptyState icon={ListOrdered} message="No standings yet — teams need at least one submission." />
      )}

      {ranking && ranking.length > 0 && <RankingTable data={ranking} extraColumns={extraColumns} />}
    </div>
  )
}
