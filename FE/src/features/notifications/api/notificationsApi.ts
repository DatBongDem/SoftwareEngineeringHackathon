import { apiClient } from '@/shared/lib/apiClient'
import type { Notification } from '../types'

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>('/notifications')
  return data
}

export async function markAsRead(id: string): Promise<void> {
  await apiClient.put(`/notifications/${id}/read`)
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.put('/notifications/read-all')
}

export async function broadcast(message: string): Promise<void> {
  await apiClient.post('/notifications/broadcast', JSON.stringify(message), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
