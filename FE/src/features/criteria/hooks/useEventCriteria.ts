import { useQuery } from '@tanstack/react-query'
import * as criteriaApi from '../api/criteriaApi'

export function useEventCriteria(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'criteria'],
    queryFn: () => criteriaApi.getEventCriteria(eventId!),
    enabled: Boolean(eventId),
  })
}
