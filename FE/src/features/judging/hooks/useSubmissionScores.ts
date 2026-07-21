import { useQuery } from '@tanstack/react-query'
import * as judgingApi from '../api/judgingApi'

export function useSubmissionScores(submissionId: string | undefined) {
  return useQuery({
    queryKey: ['scoring', 'submission', submissionId],
    queryFn: () => judgingApi.getSubmissionScores(submissionId!),
    enabled: Boolean(submissionId),
  })
}
