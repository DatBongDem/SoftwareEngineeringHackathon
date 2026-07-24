import { useQuery } from '@tanstack/react-query'
import * as notificationsApi from '../api/notificationsApi'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
    refetchInterval: 10000, // Poll every 10 seconds to get fresh announcements
  })
}
