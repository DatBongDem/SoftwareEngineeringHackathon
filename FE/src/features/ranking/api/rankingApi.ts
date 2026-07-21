import { apiClient } from '@/shared/lib/apiClient'
import type { EventRankingEntry, TeamRanking } from '../types'

export async function getRoundRanking(roundId: string, trackId?: string): Promise<TeamRanking[]> {
  const { data } = await apiClient.get<TeamRanking[]>(`/rankings/round/${roundId}`, {
    params: trackId ? { trackId } : undefined,
  })
  return data
}

export async function getEventRanking(eventId: string): Promise<EventRankingEntry[]> {
  const { data } = await apiClient.get<EventRankingEntry[]>(`/rankings/event/${eventId}`)
  return data
}

export async function promoteTopTeams(roundId: string): Promise<void> {
  await apiClient.post(`/rankings/round/${roundId}/promote`)
}
