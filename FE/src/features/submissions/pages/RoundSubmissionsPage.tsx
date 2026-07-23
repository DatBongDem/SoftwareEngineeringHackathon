import { ArrowLeft, ExternalLink, Rocket } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useRounds } from '@/features/events/hooks/useRounds'
import { useTeamsByEvent } from '@/features/teams/hooks/useTeamsByEvent'
import { useSubmissionsByRound } from '../hooks/useSubmissionsByRound'
import { Alert, Badge, EmptyState, MissingEventContextAlert, PageHeader, Table, TableSkeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Submission } from '../types'

export function RoundSubmissionsPage() {
  const { roundId } = useParams<{ roundId: string }>()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') ?? undefined

  const { data: rounds } = useRounds(eventId)
  const { data: teams } = useTeamsByEvent(eventId)
  const { data: submissions, isLoading, error } = useSubmissionsByRound(roundId)

  const round = rounds?.find((r) => r.id === roundId)
  const teamName = (teamId: string) => teams?.find((t) => t.id === teamId)?.teamName ?? teamId

  if (!eventId) {
    return (
      <MissingEventContextAlert message="Missing event context — open this page from the event's Rounds tab instead of a direct link." />
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
          title={round ? `Round ${round.roundNumber} — ${round.name}` : 'Round submissions'}
          description="All submissions for this round."
        />
      </div>

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <TableSkeleton columns={4} rows={4} />}

      {submissions && submissions.length === 0 && (
        <EmptyState icon={Rocket} message="No submissions for this round yet." />
      )}

      {submissions && submissions.length > 0 && (
        <Table<Submission>
          rows={submissions}
          rowKey={(row) => row.id}
          columns={[
            {
              header: 'Team',
              render: (row) => (
                <Link
                  to={`/submissions/${row.id}`}
                  className="font-medium text-indigo-600 hover:underline"
                >
                  {teamName(row.teamId)}
                </Link>
              ),
            },
            {
              header: 'Repository',
              render: (row) => (
                <a
                  href={row.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {new URL(row.repoUrl).pathname.slice(1)}
                </a>
              ),
            },
            {
              header: 'Submitted',
              render: (row) => new Date(row.submittedAt).toLocaleDateString(),
            },
            {
              header: 'Status',
              render: (row) => (
                <Badge tone={row.isDisqualified ? 'danger' : 'success'} dot>
                  {row.isDisqualified ? 'Disqualified' : 'Active'}
                </Badge>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
