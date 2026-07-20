import { useState } from 'react'
import { Clock, Gavel, Plus } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useRounds } from '../hooks/useRounds'
import { CreateRoundModal } from './CreateRoundModal'
import { AssignJudgesModal } from './AssignJudgesModal'
import { Alert, Badge, Button, Card, EmptyState, Skeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Round } from '../types'

export function RoundsPanel({ eventId }: { eventId: string }) {
  const { user } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false

  const { data: rounds, isLoading, error } = useRounds(eventId)
  const [createOpen, setCreateOpen] = useState(false)
  const [assignRound, setAssignRound] = useState<Round | null>(null)

  if (error) return <Alert tone="danger">{getErrorMessage(error)}</Alert>

  return (
    <div className="flex flex-col gap-4 pt-4">
      {isCoordinator && (
        <Button size="sm" onClick={() => setCreateOpen(true)} className="w-fit">
          <Plus className="h-4 w-4" />
          Create round
        </Button>
      )}

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

      {rounds && rounds.length === 0 && <EmptyState icon={Gavel} message="No rounds configured yet." />}

      {rounds && rounds.length > 0 && (
        <div className="flex flex-col gap-3">
          {rounds
            .slice()
            .sort((a, b) => a.roundNumber - b.roundNumber)
            .map((round) => (
              <Card key={round.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600 tabular-nums dark:bg-indigo-900/40 dark:text-indigo-300">
                    {round.roundNumber}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{round.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm tabular-nums text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(round.submissionDeadline).toLocaleString()} · Top {round.promotionRuleTopN}{' '}
                      promote
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone="info">
                        <span className="tabular-nums">{round.criteriaIds.length}</span> criteria
                      </Badge>
                      <Badge tone={round.judgeUserIds.length > 0 ? 'success' : 'warning'} dot>
                        <span className="tabular-nums">{round.judgeUserIds.length}</span> judges assigned
                      </Badge>
                    </div>
                  </div>
                </div>
                {isCoordinator && (
                  <Button variant="secondary" size="sm" onClick={() => setAssignRound(round)}>
                    <Gavel className="h-3.5 w-3.5" />
                    Assign judges
                  </Button>
                )}
              </Card>
            ))}
        </div>
      )}

      <CreateRoundModal eventId={eventId} open={createOpen} onClose={() => setCreateOpen(false)} />
      <AssignJudgesModal eventId={eventId} round={assignRound} onClose={() => setAssignRound(null)} />
    </div>
  )
}
