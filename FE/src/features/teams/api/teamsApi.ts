import { apiClient } from '@/shared/lib/apiClient'
import type { Team } from '../types'

// Read-only slice for now — Track Detail (Module 3) needs to list a track's teams.
// Full team CRUD (create/invite/join/accept/register-track) belongs to Module 5.

export async function getTeamsByTrack(trackId: string): Promise<Team[]> {
  const { data } = await apiClient.get<Team[]>(`/tracks/${trackId}/teams`)
  return data
}
