import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ExternalLink, FileText, MonitorPlay, Rocket } from 'lucide-react'
import { useSubmissionsByEvent } from '../hooks/useSubmissionsByEvent'
import { SubmitProjectModal } from './SubmitProjectModal'
import { SyncGithubButton } from './SyncGithubButton'
import { GithubMetadataCard } from './GithubMetadataCard'
import { Alert, Badge, Button, Card, EmptyState, Spinner } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Round } from '@/features/events/types'

export function TeamSubmissionsSection({
  teamId,
  eventId,
  rounds,
  isLeader,
}: {
  teamId: string
  eventId: string
  rounds: Round[]
  isLeader: boolean
}) {
  const { data: submissions, isLoading, error } = useSubmissionsByEvent(eventId)
  const [submitOpen, setSubmitOpen] = useState(false)

  const mySubmissions = submissions?.filter((s) => s.teamId === teamId) ?? []
  const submittedRoundIds = new Set(mySubmissions.map((s) => s.roundId))
  const availableRounds = rounds.filter((round) => !submittedRoundIds.has(round.id))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Submissions</h2>
        {isLeader && availableRounds.length > 0 && (
          <Button size="sm" onClick={() => setSubmitOpen(true)}>
            <Rocket className="h-4 w-4" />
            Submit project
          </Button>
        )}
      </div>

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <Spinner />}

      {!isLoading && mySubmissions.length === 0 && (
        <EmptyState
          icon={Rocket}
          message={
            isLeader
              ? 'No submissions yet — submit your project once a round is open.'
              : "This team hasn't submitted a project yet."
          }
          action={
            isLeader &&
            availableRounds.length > 0 && (
              <Button size="sm" onClick={() => setSubmitOpen(true)}>
                <Rocket className="h-4 w-4" />
                Submit project
              </Button>
            )
          }
        />
      )}

      {mySubmissions.map((submission, i) => {
        const round = rounds.find((r) => r.id === submission.roundId)
        return (
          <Card
            key={submission.id}
            className="animate-in slide-in-from-bottom flex flex-col gap-4"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                to={`/submissions/${submission.id}`}
                className="rounded-sm font-medium text-slate-900 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
              >
                {round ? `Round ${round.roundNumber} — ${round.name}` : 'Round'}
              </Link>
              <div className="flex items-center gap-2">
                {submission.isDisqualified && (
                  <Badge tone="danger" dot>
                    <AlertTriangle className="h-3 w-3" />
                    Disqualified
                  </Badge>
                )}
                {isLeader && <SyncGithubButton submissionId={submission.id} />}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Repository
              </a>
              {submission.demoUrl && (
                <a
                  href={submission.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
                >
                  <MonitorPlay className="h-3.5 w-3.5" />
                  Demo
                </a>
              )}
              {submission.reportUrl && (
                <a
                  href={submission.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Report
                </a>
              )}
            </div>

            <GithubMetadataCard metadata={submission.githubMetadata} />
          </Card>
        )
      })}

      <SubmitProjectModal
        teamId={teamId}
        eventId={eventId}
        rounds={availableRounds}
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
      />
    </div>
  )
}
