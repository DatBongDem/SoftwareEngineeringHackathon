import { useQuery } from '@tanstack/react-query'
import * as eventsApi from '../api/eventsApi'

export function useRounds(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'rounds'],
    queryFn: () => eventsApi.getRoundsByEvent(eventId!),
    enabled: Boolean(eventId),
  })
}
