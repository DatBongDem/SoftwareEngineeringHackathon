import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as submissionsApi from '../api/submissionsApi'
import type { CreateSubmissionPayload } from '../types'

export function useCreateSubmission(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSubmissionPayload) => submissionsApi.createSubmission(payload),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId, 'submissions'] })
      queryClient.invalidateQueries({ queryKey: ['rounds', submission.roundId, 'submissions'] })
    },
  })
}
