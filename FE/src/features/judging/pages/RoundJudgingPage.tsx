import { useState } from 'react'
import { ArrowLeft, ExternalLink, Gavel, LineChart } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useRounds } from '@/features/events/hooks/useRounds'
import { useTeamsByEvent } from '@/features/teams/hooks/useTeamsByEvent'
import { useEventCriteria } from '@/features/criteria/hooks/useEventCriteria'
import { useSubmissionsByRound } from '@/features/submissions/hooks/useSubmissionsByRound'
import { useSubmissionScores } from '../hooks/useSubmissionScores'
import { ScoreModal } from '../components/ScoreModal'
import { Alert, Badge, Button, buttonClassName, Card, EmptyState, PageHeader, Reveal, Skeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Submission } from '@/features/submissions/types'

function ScoreStatusBadge({ submissionId, criteriaCount }: { submissionId: string; criteriaCount: number }) {
  const { user } = useAuth()
  const { data: scores } = useSubmissionScores(submissionId)
  const myScores = scores?.filter((s) => s.judgeUserId === user?.id) ?? []

  if (!scores) return <span className="text-xs text-slate-400">Checking…</span>
  if (myScores.length === 0) {
    return (
      <Badge tone="warning" dot>
        Not scored yet
      </Badge>
    )
  }
  if (criteriaCount > 0 && myScores.length >= criteriaCount) {
    return (
      <Badge tone="success" dot>
        Scored
      </Badge>
    )
  }
  return (
    <Badge tone="info" dot>
      <span className="tabular-nums">{myScores.length}</span>/<span className="tabular-nums">{criteriaCount}</span>{' '}
      criteria scored
    </Badge>
  )
}

export function RoundJudgingPage() {
  const { roundId } = useParams<{ roundId: string }>()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') ?? undefined

  const { data: rounds } = useRounds(eventId)
  const { data: teams } = useTeamsByEvent(eventId)
  const { data: criteria } = useEventCriteria(eventId)
  const { data: submissions, isLoading, error } = useSubmissionsByRound(roundId)

  const [scoringSubmission, setScoringSubmission] = useState<Submission | null>(null)

  const round = rounds?.find((r) => r.id === roundId)
  const teamName = (teamId: string) => teams?.find((t) => t.id === teamId)?.teamName ?? teamId
  const roundCriteria = criteria?.filter((c) => round?.criteriaIds.includes(c.id)) ?? []
  const activeSubmissions = submissions?.filter((s) => !s.isDisqualified) ?? []

  if (!eventId) {
    return (
      <Alert tone="warning">
        Missing event context — open this page from a round's judging link instead of a direct URL.
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/events/${eventId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to event
        </Link>
        <PageHeader
          title={round ? `Judge — Round ${round.roundNumber}: ${round.name}` : 'Judging'}
          description="Score each non-disqualified submission against this round's criteria."
          action={
            <Link
              to={`/rounds/${roundId}/calibration?eventId=${eventId}`}
              className={buttonClassName({ variant: 'secondary', size: 'sm' })}
            >
              <LineChart className="h-3.5 w-3.5" />
              Calibration
            </Link>
          }
        />
      </div>

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && activeSubmissions.length === 0 && (
        <EmptyState icon={Gavel} message="No submissions to judge in this round yet." />
      )}

      <div className="flex flex-col gap-3">
        {activeSubmissions.map((submission, i) => (
          <Reveal key={submission.id} delayMs={i * 50}>
            <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1.5">
                <p className="font-medium text-slate-900 dark:text-slate-100">{teamName(submission.teamId)}</p>
                <a
                  href={submission.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400"
                >
                  <ExternalLink className="h-3 w-3" />
                  {submission.repoUrl.replace(/^https?:\/\//, '')}
                </a>
                <ScoreStatusBadge submissionId={submission.id} criteriaCount={roundCriteria.length} />
              </div>
              <Button size="sm" onClick={() => setScoringSubmission(submission)}>
                <Gavel className="h-3.5 w-3.5" />
                Score
              </Button>
            </Card>
          </Reveal>
        ))}
      </div>

      {scoringSubmission && (
        <ScoreModal
          submissionId={scoringSubmission.id}
          roundId={roundId ?? ''}
          criteria={roundCriteria}
          teamName={teamName(scoringSubmission.teamId)}
          open={Boolean(scoringSubmission)}
          onClose={() => setScoringSubmission(null)}
        />
      )}
    </div>
  )
}
