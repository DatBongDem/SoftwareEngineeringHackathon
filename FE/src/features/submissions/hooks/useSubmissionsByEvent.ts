import { useQuery } from '@tanstack/react-query'
import * as submissionsApi from '../api/submissionsApi'

export function useSubmissionsByEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'submissions'],
    queryFn: () => submissionsApi.getSubmissionsByEvent(eventId!),
    enabled: Boolean(eventId),
  })
}
