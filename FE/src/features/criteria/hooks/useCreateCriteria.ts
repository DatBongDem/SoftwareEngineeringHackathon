import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as criteriaApi from '../api/criteriaApi'
import type { CreateCriteriaPayload } from '../types'

export function useCreateCriteria(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCriteriaPayload) => criteriaApi.createEventCriteria(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'criteria'] })
    },
  })
}
