import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'

export function useJoinTeamRequest(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (teamId: string) => teamsApi.joinTeamRequest(teamId),
    onSuccess: (_data, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
    },
  })
}
