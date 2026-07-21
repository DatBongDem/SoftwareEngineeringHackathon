import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'
import type { RegisterTrackPayload } from '../types'

export function useRegisterTrack(teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterTrackPayload) => teamsApi.registerTrack(teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
    },
  })
}
