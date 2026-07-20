import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Plus, Users2 } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useTracks } from '../hooks/useTracks'
import { CreateTrackModal } from './CreateTrackModal'
import { AssignMentorModal } from './AssignMentorModal'
import { Alert, Badge, Button, Card, CardGridSkeleton, EmptyState } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Track } from '../types'

export function TracksPanel({ eventId }: { eventId: string }) {
  const { user } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false

  const { data: tracks, isLoading, error } = useTracks(eventId)
  const [createOpen, setCreateOpen] = useState(false)
  const [mentorTrack, setMentorTrack] = useState<Track | null>(null)

  if (error) return <Alert tone="danger">{getErrorMessage(error)}</Alert>

  return (
    <div className="flex flex-col gap-4 pt-4">
      {isCoordinator && (
        <Button size="sm" onClick={() => setCreateOpen(true)} className="w-fit">
          <Plus className="h-4 w-4" />
          Create track
        </Button>
      )}

      {isLoading && <CardGridSkeleton cards={2} gridClassName="grid-cols-1 sm:grid-cols-2" />}

      {tracks && tracks.length === 0 && (
        <EmptyState icon={GraduationCap} message="No tracks configured yet." />
      )}

      {tracks && tracks.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tracks.map((track) => (
            <Card key={track.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <Link
                  to={`/tracks/${track.id}?eventId=${eventId}`}
                  className="rounded-sm font-medium text-slate-900 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900"
                >
                  {track.name}
                </Link>
                <Badge tone="neutral">
                  Max <span className="tabular-nums">{track.maxTeams}</span>
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{track.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <GraduationCap className="h-3.5 w-3.5" />
                {track.mentorUserIds.length > 0
                  ? `${track.mentorUserIds.length} mentor(s) assigned`
                  : 'No mentor assigned'}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  to={`/tracks/${track.id}?eventId=${eventId}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
                >
                  <Users2 className="h-3.5 w-3.5" />
                  View teams
                </Link>
                {isCoordinator && (
                  <Button variant="secondary" size="sm" onClick={() => setMentorTrack(track)}>
                    Assign mentor
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateTrackModal eventId={eventId} open={createOpen} onClose={() => setCreateOpen(false)} />
      <AssignMentorModal eventId={eventId} track={mentorTrack} onClose={() => setMentorTrack(null)} />
    </div>
  )
}
