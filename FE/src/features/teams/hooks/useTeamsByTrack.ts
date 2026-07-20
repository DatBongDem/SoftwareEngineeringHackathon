import { useQuery } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'

export function useTeamsByTrack(trackId: string | undefined) {
  return useQuery({
    queryKey: ['tracks', trackId, 'teams'],
    queryFn: () => teamsApi.getTeamsByTrack(trackId!),
    enabled: Boolean(trackId),
  })
}
