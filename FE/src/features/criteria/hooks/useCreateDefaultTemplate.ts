import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as criteriaApi from '../api/criteriaApi'

export function useCreateDefaultTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: criteriaApi.createDefaultTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria', 'templates'] })
    },
  })
}
