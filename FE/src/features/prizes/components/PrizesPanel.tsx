import { useState } from 'react'
import { Plus, Trophy } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useTeamsByEvent } from '@/features/teams/hooks/useTeamsByEvent'
import { useTracks } from '@/features/tracks/hooks/useTracks'
import { usePrizesByEvent } from '../hooks/usePrizesByEvent'
import { CreatePrizeModal } from './CreatePrizeModal'
import { Badge, Button, Card, CardGridSkeleton, EmptyState, Reveal } from '@/shared/components'

export function PrizesPanel({ eventId }: { eventId: string }) {
  const { user } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false

  const { data: prizes, isLoading } = usePrizesByEvent(eventId)
  const { data: teams } = useTeamsByEvent(eventId)
  const { data: tracks } = useTracks(eventId)
  const [createOpen, setCreateOpen] = useState(false)

  const teamName = (teamId: string) => teams?.find((t) => t.id === teamId)?.teamName ?? teamId
  const trackName = (trackId: string | null) =>
    trackId ? (tracks?.find((t) => t.id === trackId)?.name ?? trackId) : null

  return (
    <div className="flex flex-col gap-4 pt-4">
      {isCoordinator && (
        <Button size="sm" onClick={() => setCreateOpen(true)} className="w-fit">
          <Plus className="h-4 w-4" />
          Create prize
        </Button>
      )}

      {isLoading && <CardGridSkeleton cards={3} />}

      {prizes && prizes.length === 0 && (
        <EmptyState icon={Trophy} message="No prizes announced for this event yet." />
      )}

      {prizes && prizes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prizes.map((prize, i) => (
            <Reveal key={prize.id} delayMs={i * 60}>
              <Card className="flex h-full flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                  <Trophy className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display font-semibold text-slate-900 dark:text-slate-100">{prize.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{prize.reward}</p>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                  <Badge tone="info">{teamName(prize.teamId)}</Badge>
                  {trackName(prize.trackId) && <Badge tone="neutral">{trackName(prize.trackId)}</Badge>}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      )}

      <CreatePrizeModal eventId={eventId} open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
