import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as criteriaApi from '../api/criteriaApi'

export function useInheritCriteria(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => criteriaApi.inheritCriteria(eventId),
    onSuccess: () => {
      // Invalidate event criteria so the UI reloads them
      queryClient.invalidateQueries({ queryKey: ['event-criteria', eventId] })
    },
  })
}
