import { useQuery } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'

export function useTeamsByEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'teams'],
    queryFn: () => teamsApi.getTeamsByEvent(eventId!),
    enabled: Boolean(eventId),
  })
}
