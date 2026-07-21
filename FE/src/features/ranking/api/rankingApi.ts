import { apiClient } from '@/shared/lib/apiClient'
import type { TeamRanking } from '../types'

export async function getRoundRanking(roundId: string): Promise<TeamRanking[]> {
  const { data } = await apiClient.get<TeamRanking[]>(`/rankings/round/${roundId}`)
  return data
}

export async function promoteTopTeams(roundId: string): Promise<void> {
  await apiClient.post(`/rankings/round/${roundId}/promote`)
}
