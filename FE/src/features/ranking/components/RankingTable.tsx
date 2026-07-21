import { Award, Ban, Trophy } from 'lucide-react'
import { Badge, Table, type TableColumn } from '@/shared/components'
import type { TeamRanking } from '../types'

interface RankingTableProps<T extends TeamRanking> {
  data: T[]
  /** Extra columns (e.g. Track, Round reached) inserted between Team and Score — used for the event-level view. */
  extraColumns?: TableColumn<T>[]
}

export function RankingTable<T extends TeamRanking>({ data, extraColumns = [] }: RankingTableProps<T>) {
  return (
    <Table<T>
      rows={data}
      rowKey={(row) => row.submissionId}
      columns={[
        {
          header: 'Rank',
          render: (row) => {
            if (row.isDisqualified) return <span className="text-slate-400">—</span>
            if (row.rank === 1) {
              return (
                <span className="inline-flex items-center gap-1.5 font-display font-bold text-amber-600 dark:text-amber-400">
                  <Trophy className="h-4 w-4" />
                  <span className="tabular-nums">1</span>
                </span>
              )
            }
            return <span className="font-medium tabular-nums text-slate-700 dark:text-slate-200">{row.rank}</span>
          },
        },
        { header: 'Team', render: (row) => <span className="font-medium">{row.teamName}</span> },
        ...extraColumns,
        {
          header: 'Score',
          render: (row) => (
            <span className="font-display font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {row.isDisqualified ? '—' : row.finalWeightedScore}
            </span>
          ),
        },
        {
          header: 'Status',
          render: (row) => {
            if (row.isDisqualified) {
              return (
                <Badge tone="danger" dot>
                  <Ban className="h-3 w-3" /> Disqualified
                </Badge>
              )
            }
            if (row.isPromoted) {
              return (
                <Badge tone="success" dot>
                  <Award className="h-3 w-3" /> Promoted
                </Badge>
              )
            }
            return <span className="text-xs text-slate-400">—</span>
          },
        },
      ]}
    />
  )
}
