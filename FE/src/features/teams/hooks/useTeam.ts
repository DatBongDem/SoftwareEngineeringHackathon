import { useQuery } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'

export function useTeam(teamId: string | undefined) {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: () => teamsApi.getTeamById(teamId!),
    enabled: Boolean(teamId),
  })
}
