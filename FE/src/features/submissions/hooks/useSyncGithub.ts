import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as submissionsApi from '../api/submissionsApi'

export function useSyncGithub(submissionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => submissionsApi.syncGithub(submissionId),
    onSuccess: (submission) => {
      queryClient.setQueryData(['submissions', submissionId], submission)
      queryClient.invalidateQueries({ queryKey: ['events', submission.eventId, 'submissions'] })
    },
  })
}
