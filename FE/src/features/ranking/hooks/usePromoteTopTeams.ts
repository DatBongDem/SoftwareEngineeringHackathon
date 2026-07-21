import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as rankingApi from '../api/rankingApi'

export function usePromoteTopTeams(roundId: string, eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => rankingApi.promoteTopTeams(roundId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankings', 'round', roundId] })
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'teams'] })
    },
  })
}
