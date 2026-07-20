import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as tracksApi from '../api/tracksApi'
import type { CreateTrackPayload } from '../types'

export function useCreateTrack(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTrackPayload) => tracksApi.createTrack(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'tracks'] })
    },
  })
}
