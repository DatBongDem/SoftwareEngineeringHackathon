import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as judgingApi from '../api/judgingApi'
import type { SubmitScorePayload } from '../types'

export function useSubmitScores() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitScorePayload) => judgingApi.submitScores(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scoring', 'submission', variables.submissionId] })
      queryClient.invalidateQueries({ queryKey: ['scoring', 'calibration', variables.roundId] })
    },
  })
}
