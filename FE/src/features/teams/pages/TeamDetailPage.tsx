import { useState } from 'react'
import { ArrowLeft, Check, GraduationCap, UserPlus, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useTeam } from '../hooks/useTeam'
import { useAcceptMember } from '../hooks/useAcceptMember'
import { useJoinTeamRequest } from '../hooks/useJoinTeamRequest'
import { useTracks } from '@/features/tracks/hooks/useTracks'
import { useRounds } from '@/features/events/hooks/useRounds'
import { InviteMemberModal } from '../components/InviteMemberModal'
import { RegisterTrackModal } from '../components/RegisterTrackModal'
import { TeamSubmissionsSection } from '@/features/submissions/components/TeamSubmissionsSection'
import { Alert, Avatar, Badge, Button, Card, PageHeader, Reveal, Spinner } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { teamStatusLabels, teamStatusTones } from '@/shared/types/enums'

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const { user } = useAuth()
  const { data: team, isLoading, error } = useTeam(teamId)
  const { data: tracks } = useTracks(team?.eventId)
  const { data: rounds } = useRounds(team?.eventId)
  const acceptMember = useAcceptMember(teamId ?? '')
  const joinTeamRequest = useJoinTeamRequest(team?.eventId ?? '')

  const [inviteOpen, setInviteOpen] = useState(false)
  const [trackModalOpen, setTrackModalOpen] = useState(false)

  if (isLoading) return <Spinner />
  if (error) return <Alert tone="danger">{getErrorMessage(error)}</Alert>
  if (!team) return null

  const isLeader = user?.id === team.leaderUserId
  const isMember = team.members.some((member) => member.userId === user?.id)
  const pendingMembers = team.members.filter((member) => !member.isAccepted)
  const acceptedMembers = team.members.filter((member) => member.isAccepted)
  const track = tracks?.find((t) => t.id === team.trackId)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={`/events/${team.eventId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to event
        </Link>
        <PageHeader
          title={team.teamName}
          action={
            <Badge tone={teamStatusTones[team.status]} dot>
              {teamStatusLabels[team.status]}
            </Badge>
          }
        />
      </div>

      {acceptMember.isError && <Alert tone="danger">{getErrorMessage(acceptMember.error)}</Alert>}
      {joinTeamRequest.isError && <Alert tone="danger">{getErrorMessage(joinTeamRequest.error)}</Alert>}

      <Card className="flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
          <GraduationCap className="h-4.5 w-4.5" />
        </span>
        {track ? (
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Registered in <span className="font-medium text-slate-900 dark:text-slate-100">{track.name}</span>
          </span>
        ) : (
          <span className="text-sm text-slate-500 dark:text-slate-400">Not registered to a track yet</span>
        )}
        {isLeader && !team.trackId && (
          <Button variant="secondary" size="sm" onClick={() => setTrackModalOpen(true)} className="ml-auto">
            Register track
          </Button>
        )}
      </Card>

      {!isMember && (
        <Alert tone="info">
          You're not a member of this team.{' '}
          <Button
            variant="secondary"
            size="sm"
            className="ml-2"
            loading={joinTeamRequest.isPending}
            onClick={() => teamId && joinTeamRequest.mutate(teamId)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Request to join
          </Button>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Members</h2>
        {isLeader && (
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {acceptedMembers.map((member, i) => (
          <Reveal key={member.userId} delayMs={i * 50}>
            <Card className="flex items-center gap-3 p-4">
              <Avatar name={member.fullName} size="sm" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {member.fullName}
                  {member.userId === team.leaderUserId && (
                    <Badge tone="info" className="ml-2">
                      Leader
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-slate-500">{member.email}</p>
              </div>
            </Card>
          </Reveal>
        ))}

        {pendingMembers.map((member, i) => (
          <Reveal key={member.userId} delayMs={(acceptedMembers.length + i) * 50}>
            <Card className="flex items-center gap-3 p-4">
              <Avatar name={member.fullName} size="sm" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">{member.fullName}</p>
                <p className="text-xs text-slate-500">{member.email}</p>
              </div>
              <Badge tone="warning" dot>
                Pending
              </Badge>
              {isLeader && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="min-h-9 min-w-9"
                    aria-label={`Accept ${member.fullName}`}
                    loading={acceptMember.isPending && acceptMember.variables?.userId === member.userId && acceptMember.variables.accept}
                    onClick={() => acceptMember.mutate({ userId: member.userId, accept: true })}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="min-h-9 min-w-9"
                    aria-label={`Reject ${member.fullName}`}
                    loading={acceptMember.isPending && acceptMember.variables?.userId === member.userId && !acceptMember.variables.accept}
                    onClick={() => acceptMember.mutate({ userId: member.userId, accept: false })}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </Card>
          </Reveal>
        ))}
      </div>

      <TeamSubmissionsSection
        teamId={team.id}
        eventId={team.eventId}
        rounds={rounds ?? []}
        isLeader={isLeader}
      />

      <InviteMemberModal teamId={team.id} open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <RegisterTrackModal
        teamId={team.id}
        eventId={team.eventId}
        open={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />
    </div>
  )
}
