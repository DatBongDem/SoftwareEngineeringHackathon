import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as eventsApi from '../api/eventsApi'
import type { CreateRoundPayload } from '../types'

export function useCreateRound(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRoundPayload) => eventsApi.createRound(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'rounds'] })
    },
  })
}
