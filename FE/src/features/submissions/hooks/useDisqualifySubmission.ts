import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as submissionsApi from '../api/submissionsApi'
import type { DisqualifySubmissionPayload } from '../types'

export function useDisqualifySubmission(submissionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DisqualifySubmissionPayload) =>
      submissionsApi.disqualifySubmission(submissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', submissionId] })
      queryClient.invalidateQueries({ queryKey: ['rounds'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
