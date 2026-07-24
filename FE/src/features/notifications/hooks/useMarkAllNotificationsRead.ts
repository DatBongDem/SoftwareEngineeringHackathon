import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as notificationsApi from '../api/notificationsApi'

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
