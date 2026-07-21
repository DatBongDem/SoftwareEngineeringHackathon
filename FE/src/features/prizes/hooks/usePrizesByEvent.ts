import { useQuery } from '@tanstack/react-query'
import * as prizesApi from '../api/prizesApi'

export function usePrizesByEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'prizes'],
    queryFn: () => prizesApi.getPrizesByEvent(eventId!),
    enabled: Boolean(eventId),
  })
}
