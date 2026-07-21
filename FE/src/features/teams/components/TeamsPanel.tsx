import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, UserPlus, Users } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useTeamsByEvent } from '../hooks/useTeamsByEvent'
import { useJoinTeamRequest } from '../hooks/useJoinTeamRequest'
import { CreateTeamModal } from './CreateTeamModal'
import { Alert, Badge, Button, Card, CardGridSkeleton, EmptyState, Reveal } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { teamStatusLabels, teamStatusTones } from '@/shared/types/enums'

export function TeamsPanel({ eventId }: { eventId: string }) {
  const { user } = useAuth()
  const { data: teams, isLoading, error } = useTeamsByEvent(eventId)
  const joinTeamRequest = useJoinTeamRequest(eventId)
  const [createOpen, setCreateOpen] = useState(false)

  const myTeam = teams?.find((team) => team.members.some((member) => member.userId === user?.id))

  if (error) return <Alert tone="danger">{getErrorMessage(error)}</Alert>

  return (
    <div className="flex flex-col gap-4 pt-4">
      {joinTeamRequest.isError && <Alert tone="danger">{getErrorMessage(joinTeamRequest.error)}</Alert>}

      {!myTeam && (
        <Button size="sm" onClick={() => setCreateOpen(true)} className="w-fit">
          <Plus className="h-4 w-4" />
          Create team
        </Button>
      )}

      {isLoading && <CardGridSkeleton cards={3} />}

      {teams && teams.length === 0 && (
        <EmptyState
          icon={Users}
          message="No teams registered for this event yet."
          action={
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create the first team
            </Button>
          }
        />
      )}

      {teams && teams.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => {
            const isMine = team.id === myTeam?.id
            return (
              <Reveal key={team.id} delayMs={i * 50}>
                <Card className={isMine ? 'border-amber-300 dark:border-amber-700' : undefined}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/teams/${team.id}`}
                        className="rounded-sm font-medium text-slate-900 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
                      >
                        {team.teamName}
                      </Link>
                      <Badge tone={teamStatusTones[team.status]} dot>
                        {teamStatusLabels[team.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="tabular-nums">{team.members.length}</span> member
                      {team.members.length === 1 ? '' : 's'}
                      {isMine && (
                        <span className="ml-2 font-medium text-amber-700 dark:text-amber-400">
                          · Your team
                        </span>
                      )}
                    </p>
                    {!myTeam && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-fit"
                        loading={joinTeamRequest.isPending && joinTeamRequest.variables === team.id}
                        onClick={() => joinTeamRequest.mutate(team.id)}
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Request to join
                      </Button>
                    )}
                  </div>
                </Card>
              </Reveal>
            )
          })}
        </div>
      )}

      <CreateTeamModal eventId={eventId} open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
