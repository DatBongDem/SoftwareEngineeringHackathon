import { useQuery } from '@tanstack/react-query'
import * as eventsApi from '../api/eventsApi'

export function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => eventsApi.getEventById(eventId!),
    enabled: Boolean(eventId),
  })
}
