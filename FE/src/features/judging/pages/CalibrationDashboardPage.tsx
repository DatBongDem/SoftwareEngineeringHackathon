import { ArrowLeft, Gauge } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useRounds } from '@/features/events/hooks/useRounds'
import { useCalibrationVariance } from '../hooks/useCalibrationVariance'
import { VarianceTable } from '../components/VarianceTable'
import { Alert, EmptyState, MissingEventContextAlert, PageHeader, TableSkeleton } from '@/shared/components'
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

      {!isLoading && calibration && calibration.criteriaVariances.length === 0 && (
        <EmptyState icon={Gauge} message="No criteria to calibrate for this round yet." />
      )}

      {calibration && calibration.criteriaVariances.length > 0 && (
        <VarianceTable data={calibration.criteriaVariances} />
      )}
    </div>
  )
}
