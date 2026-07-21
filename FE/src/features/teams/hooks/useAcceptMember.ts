import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'

export function useAcceptMember(teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, accept }: { userId: string; accept: boolean }) =>
      teamsApi.acceptMember(teamId, userId, accept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
    },
  })
}
