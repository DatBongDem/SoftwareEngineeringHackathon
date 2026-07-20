import { useQuery } from '@tanstack/react-query'
import * as tracksApi from '../api/tracksApi'

export function useTracks(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'tracks'],
    queryFn: () => tracksApi.getTracksByEvent(eventId!),
    enabled: Boolean(eventId),
  })
}
