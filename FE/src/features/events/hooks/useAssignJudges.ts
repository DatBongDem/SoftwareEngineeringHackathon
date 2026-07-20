import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as eventsApi from '../api/eventsApi'
import type { AssignJudgesPayload } from '../types'

export function useAssignJudges(eventId: string, roundId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AssignJudgesPayload) => eventsApi.assignJudges(roundId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'rounds'] })
    },
  })
}
