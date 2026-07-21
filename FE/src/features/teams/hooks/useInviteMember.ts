import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as teamsApi from '../api/teamsApi'
import type { InviteMemberPayload } from '../types'

export function useInviteMember(teamId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: InviteMemberPayload) => teamsApi.inviteMember(teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId] })
    },
  })
}
