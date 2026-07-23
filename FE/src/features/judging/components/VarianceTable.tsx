import { AlertTriangle } from 'lucide-react'
import { Badge, Table } from '@/shared/components'
import { formatScore } from '@/shared/lib/formatScore'
import type { CriterionVariance } from '../types'

// Flags a criterion as "High variance" when judges disagree noticeably more
// than average for this round — the RBL inter-rater calibration signal called
// for in the project spec (judges scoring the same criterion very
// differently is worth a coordinator's attention before finalizing rankings).
export function VarianceTable({ data }: { data: CriterionVariance[] }) {
  const judgedRows = data.filter((row) => row.totalJudges > 0)
  const avgStdDev = judgedRows.length
    ? judgedRows.reduce((sum, row) => sum + row.standardDeviation, 0) / judgedRows.length
    : 0
  const highVarianceThreshold = avgStdDev * 1.3

  return (
    <Table<CriterionVariance>
      rows={data}
      rowKey={(row) => row.criterionId}
      columns={[
        { header: 'Criterion', render: (row) => <span className="font-medium">{row.criterionName}</span> },
        { header: 'Mean', render: (row) => <span className="tabular-nums">{formatScore(row.meanScore)}</span> },
        {
          header: 'Std dev',
          render: (row) => <span className="tabular-nums">{formatScore(row.standardDeviation)}</span>,
        },
        { header: 'Variance', render: (row) => <span className="tabular-nums">{formatScore(row.variance)}</span> },
        { header: 'Judges', render: (row) => <span className="tabular-nums">{row.totalJudges}</span> },
        {
          header: 'Calibration',
          render: (row) => {
            if (row.totalJudges < 2) {
              return <span className="text-xs text-slate-500">Not enough data</span>
            }
            if (row.standardDeviation > 0 && row.standardDeviation > highVarianceThreshold) {
              return (
                <Badge tone="warning">
                  <AlertTriangle className="h-3 w-3" /> High variance
                </Badge>
              )
            }
            return <Badge tone="success">Consistent</Badge>
          },
        },
      ]}
    />
  )
}
