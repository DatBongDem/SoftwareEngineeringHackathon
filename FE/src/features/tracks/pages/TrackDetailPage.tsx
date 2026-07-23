import { ArrowLeft, Users } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTracks } from '../hooks/useTracks'
import { useTeamsByTrack } from '@/features/teams/hooks/useTeamsByTrack'
import { Alert, Badge, Card, EmptyState, MissingEventContextAlert, Spinner, Table, TableSkeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { teamStatusLabels, teamStatusTones } from '@/shared/types/enums'
import type { Team } from '@/features/teams/types'

export function TrackDetailPage() {
  const { trackId } = useParams<{ trackId: string }>()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') ?? undefined

  const { data: tracks, isLoading: tracksLoading, error: tracksError } = useTracks(eventId)
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeamsByTrack(trackId)

  const track = tracks?.find((t) => t.id === trackId)

  if (!eventId) {
    return (
      <MissingEventContextAlert message="Missing event context for this track — open it from the event's Tracks tab instead of a direct link." />
    )
  }

  if (tracksLoading) return <Spinner />
  if (tracksError) return <Alert tone="danger">{getErrorMessage(tracksError)}</Alert>

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/events/${eventId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to event
        </Link>
        <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {track?.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{track?.description}</p>
      </div>

      <Card className="flex gap-2">
        <Badge tone="neutral">
          Max <span className="tabular-nums">{track?.maxTeams}</span> teams
        </Badge>
        <Badge tone={track && track.mentorUserIds.length > 0 ? 'success' : 'warning'} dot>
          <span className="tabular-nums">{track?.mentorUserIds.length ?? 0}</span> mentor(s)
        </Badge>
      </Card>

      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        <Users className="h-4.5 w-4.5 text-slate-400" /> Registered teams
      </h2>

      {teamsError && <Alert tone="danger">{getErrorMessage(teamsError)}</Alert>}
      {teamsLoading && <TableSkeleton columns={3} rows={3} />}

      {teams && teams.length === 0 && (
        <EmptyState icon={Users} message="No teams registered to this track yet." />
      )}

      {teams && teams.length > 0 && (
        <Table<Team>
          rows={teams}
          rowKey={(row) => row.id}
          columns={[
            { header: 'Team', render: (row) => <span className="font-medium">{row.teamName}</span> },
            {
              header: 'Members',
              render: (row) => <span className="tabular-nums">{row.members.length}</span>,
            },
            {
              header: 'Status',
              render: (row) => (
                <Badge tone={teamStatusTones[row.status]} dot>
                  {teamStatusLabels[row.status]}
                </Badge>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
