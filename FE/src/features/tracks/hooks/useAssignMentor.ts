import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as tracksApi from '../api/tracksApi'
import type { AssignMentorPayload } from '../types'

export function useAssignMentor(eventId: string, trackId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AssignMentorPayload) => tracksApi.assignMentor(trackId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'tracks'] })
    },
  })
}
