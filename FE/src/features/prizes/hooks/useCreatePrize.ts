import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as prizesApi from '../api/prizesApi'
import type { CreatePrizePayload } from '../types'

export function useCreatePrize(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePrizePayload) => prizesApi.createPrize(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'prizes'] })
    },
  })
}
