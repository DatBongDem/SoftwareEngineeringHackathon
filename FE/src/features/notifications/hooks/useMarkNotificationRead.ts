import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as notificationsApi from '../api/notificationsApi'

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
