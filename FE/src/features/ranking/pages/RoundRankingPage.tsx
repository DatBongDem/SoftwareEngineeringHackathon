import { useState } from 'react'
import { ArrowLeft, Award, ListOrdered } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useRounds } from '@/features/events/hooks/useRounds'
import { useTracks } from '@/features/tracks/hooks/useTracks'
import { useRoundRanking } from '../hooks/useRoundRanking'
import { RankingTable } from '../components/RankingTable'
import { PromoteConfirmModal } from '../components/PromoteConfirmModal'
import { Alert, Button, EmptyState, MissingEventContextAlert, PageHeader, Select, TableSkeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function RoundRankingPage() {
  const { roundId } = useParams<{ roundId: string }>()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') ?? undefined
  const { user } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false

  const { data: rounds } = useRounds(eventId)
  const { data: tracks } = useTracks(eventId)
  const [trackFilter, setTrackFilter] = useState('')
  const { data: ranking, isLoading, error } = useRoundRanking(roundId, trackFilter || undefined)
  const [promoteOpen, setPromoteOpen] = useState(false)

  const round = rounds?.find((r) => r.id === roundId)

  if (!eventId) {
    return (
      <MissingEventContextAlert message="Missing event context — open this page from a round's ranking link instead of a direct URL." />
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
          title={round ? `Ranking — Round ${round.roundNumber}: ${round.name}` : 'Ranking'}
          description="Teams ranked by final weighted score (average per criterion × criterion weight). Promotion takes the top N teams within each Track, not top N overall."
          action={
            isCoordinator &&
            round && (
              <Button size="sm" onClick={() => setPromoteOpen(true)}>
                <Award className="h-4 w-4" />
                Promote top {round.promotionRuleTopN} per track
              </Button>
            )
          }
        />
      </div>

      {tracks && tracks.length > 0 && (
        <Select
          label="Filter by track"
          placeholder="All tracks"
          options={tracks.map((track) => ({ value: track.id, label: track.name }))}
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="max-w-xs"
        />
      )}

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <TableSkeleton columns={4} rows={4} />}

      {!isLoading && ranking && ranking.length === 0 && (
        <EmptyState
          icon={ListOrdered}
          message={trackFilter ? 'No submissions from this track in this round yet.' : 'No submissions to rank in this round yet.'}
        />
      )}

      {ranking && ranking.length > 0 && <RankingTable data={ranking} />}

      {round && (
        <PromoteConfirmModal
          roundId={round.id}
          eventId={eventId}
          topN={round.promotionRuleTopN}
          open={promoteOpen}
          onClose={() => setPromoteOpen(false)}
        />
      )}
    </div>
  )
}
