import { useQuery } from '@tanstack/react-query'
import * as submissionsApi from '../api/submissionsApi'

export function useSubmission(submissionId: string | undefined) {
  return useQuery({
    queryKey: ['submissions', submissionId],
    queryFn: () => submissionsApi.getSubmissionById(submissionId!),
    enabled: Boolean(submissionId),
  })
}
