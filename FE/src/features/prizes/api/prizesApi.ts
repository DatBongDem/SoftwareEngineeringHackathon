import { apiClient } from '@/shared/lib/apiClient'
import type { CreatePrizePayload, Prize } from '../types'

export async function getPrizesByEvent(eventId: string): Promise<Prize[]> {
  const { data } = await apiClient.get<Prize[]>(`/events/${eventId}/prizes`)
  return data
}

export async function createPrize(eventId: string, payload: CreatePrizePayload): Promise<Prize> {
  const { data } = await apiClient.post<Prize>(`/events/${eventId}/prizes`, payload)
  return data
}
