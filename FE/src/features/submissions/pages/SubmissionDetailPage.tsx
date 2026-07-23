import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ExternalLink, FileText, MonitorPlay, ShieldX } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useSubmission } from '../hooks/useSubmission'
import { useTeam } from '@/features/teams/hooks/useTeam'
import { useRounds } from '@/features/events/hooks/useRounds'
import { GithubMetadataCard } from '../components/GithubMetadataCard'
import { SyncGithubButton } from '../components/SyncGithubButton'
import { DisqualifyModal } from '../components/DisqualifyModal'
import { Alert, Badge, Button, Card, PageHeader, Spinner } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function SubmissionDetailPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const { user } = useAuth()
  const { data: submission, isLoading, error } = useSubmission(submissionId)
  const { data: team } = useTeam(submission?.teamId)
  const { data: rounds } = useRounds(submission?.eventId)
  const [disqualifyOpen, setDisqualifyOpen] = useState(false)

  if (isLoading) return <Spinner />
  if (error) return <Alert tone="danger">{getErrorMessage(error)}</Alert>
  if (!submission) return null

  const round = rounds?.find((r) => r.id === submission.roundId)
  const isCoordinator = user?.roles.includes('Coordinator') ?? false
  const isLeader = user?.id === team?.leaderUserId

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/teams/${submission.teamId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to team
        </Link>
        <PageHeader
          title={team?.teamName ?? 'Submission'}
          description={round ? `Round ${round.roundNumber} — ${round.name}` : undefined}
          action={
            <div className="flex items-center gap-2">
              {submission.isDisqualified ? (
                <Badge tone="danger" dot>
                  Disqualified
                </Badge>
              ) : (
                <Badge tone="success" dot>
                  Active
                </Badge>
              )}
              {isCoordinator && !submission.isDisqualified && (
                <Button variant="danger" size="sm" onClick={() => setDisqualifyOpen(true)}>
                  <ShieldX className="h-3.5 w-3.5" />
                  Disqualify
                </Button>
              )}
              {isLeader && <SyncGithubButton submissionId={submission.id} />}
            </div>
          }
        />
      </div>

      {submission.isDisqualified && (
        <Alert tone="danger">
          <span className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="h-4 w-4" /> Disqualified
          </span>
          <p className="mt-1">{submission.disqualificationReason}</p>
        </Alert>
      )}

      <Card className="flex flex-wrap gap-2">
        <a
          href={submission.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
        >
          <ExternalLink className="h-4 w-4" />
          Repository
        </a>
        {submission.demoUrl && (
          <a
            href={submission.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
          >
            <MonitorPlay className="h-4 w-4" />
            Demo
          </a>
        )}
        {submission.reportUrl && (
          <a
            href={submission.reportUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
          >
            <FileText className="h-4 w-4" />
            Report
          </a>
        )}
      </Card>

      <GithubMetadataCard metadata={submission.githubMetadata} />

      {submission.notes && (
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Notes</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{submission.notes}</p>
        </Card>
      )}

      <p className="text-xs text-slate-500">
        Submitted {new Date(submission.submittedAt).toLocaleString()}
      </p>

      <DisqualifyModal
        submissionId={submission.id}
        open={disqualifyOpen}
        onClose={() => setDisqualifyOpen(false)}
      />
    </div>
  )
}
