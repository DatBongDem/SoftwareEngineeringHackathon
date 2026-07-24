import { useMutation } from '@tanstack/react-query'
import * as notificationsApi from '../api/notificationsApi'

export function useBroadcastNotification() {
  return useMutation({
    mutationFn: notificationsApi.broadcast,
  })
}
