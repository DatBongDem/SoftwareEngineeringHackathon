import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as eventsApi from '../api/eventsApi'

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
