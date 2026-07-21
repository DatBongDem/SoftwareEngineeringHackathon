import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'
import type { CreateTeamPayload } from '../types'

export function useCreateTeam(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => teamsApi.createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'teams'] })
    },
  })
}
