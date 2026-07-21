import { useQuery } from '@tanstack/react-query'
import * as submissionsApi from '../api/submissionsApi'

export function useSubmissionsByRound(roundId: string | undefined) {
  return useQuery({
    queryKey: ['rounds', roundId, 'submissions'],
    queryFn: () => submissionsApi.getSubmissionsByRound(roundId!),
    enabled: Boolean(roundId),
  })
}
