import { useQuery } from '@tanstack/react-query'
import * as rankingApi from '../api/rankingApi'

export function useEventRanking(eventId: string | undefined) {
  return useQuery({
    queryKey: ['rankings', 'event', eventId],
    queryFn: () => rankingApi.getEventRanking(eventId!),
    enabled: Boolean(eventId),
  })
}
