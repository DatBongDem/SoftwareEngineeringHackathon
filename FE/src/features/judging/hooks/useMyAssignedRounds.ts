import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import * as eventsApi from '@/features/events/api/eventsApi'
import type { HackathonEvent, Round } from '@/features/events/types'

export interface AssignedRound {
  event: HackathonEvent
  round: Round
}

// No BE endpoint returns "rounds assigned to this judge" directly, so this
// fetches every event's rounds and filters client-side on round.judgeUserIds —
// same workaround pattern used elsewhere in this app for missing endpoints.
export function useMyAssignedRounds() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['judging', 'my-rounds', user?.id],
    queryFn: async (): Promise<AssignedRound[]> => {
      const events = await eventsApi.getEvents()
      const perEvent = await Promise.all(
        events.map(async (event) => ({ event, rounds: await eventsApi.getRoundsByEvent(event.id) })),
      )
      const assigned: AssignedRound[] = []
      for (const { event, rounds } of perEvent) {
        for (const round of rounds) {
          if (round.judgeUserIds.includes(user!.id)) assigned.push({ event, round })
        }
      }
      return assigned
    },
    enabled: Boolean(user?.id),
  })
}
