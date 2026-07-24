import { ArrowLeft, Gauge } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useRounds } from '@/features/events/hooks/useRounds'
import { useCalibrationVariance } from '../hooks/useCalibrationVariance'
import { VarianceTable } from '../components/VarianceTable'
import { Alert, Badge, Card, EmptyState, MissingEventContextAlert, PageHeader, TableSkeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function CalibrationDashboardPage() {
  const { roundId } = useParams<{ roundId: string }>()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') ?? undefined

  const { data: rounds } = useRounds(eventId)
  const { data: calibration, isLoading, error } = useCalibrationVariance(roundId)

  const round = rounds?.find((r) => r.id === roundId)

  if (!eventId) {
    return (
      <MissingEventContextAlert message="Missing event context — open this page from a round's judging link instead of a direct URL." />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/rounds/${roundId}/judge?eventId=${eventId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to judging queue
        </Link>
        <PageHeader
          title={round ? `Calibration — Round ${round.roundNumber}: ${round.name}` : 'Calibration'}
          description="Mean, variance, and standard deviation of judge scores per criterion — flags criteria where judges disagree the most."
        />
      </div>

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <TableSkeleton columns={6} rows={4} />}

      {!isLoading && calibration && calibration.submissionsVariances.length === 0 && (
        <EmptyState icon={Gauge} message="Chưa có bài thi mẫu nào được đánh dấu hiệu chuẩn cho vòng này." />
      )}

      {calibration && calibration.submissionsVariances.map((subVar) => (
        <Card key={subVar.submissionId} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Bài thi mẫu: {subVar.teamName}
            </h3>
            <Badge tone="neutral">ID: {subVar.submissionId}</Badge>
          </div>
          <VarianceTable data={subVar.criteriaVariances} />
        </Card>
      ))}
    </div>
  )
}
