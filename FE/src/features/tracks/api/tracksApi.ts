import { apiClient } from '@/shared/lib/apiClient'
import type { AssignMentorPayload, CreateTrackPayload, Track } from '../types'

export async function getTracksByEvent(eventId: string): Promise<Track[]> {
  const { data } = await apiClient.get<Track[]>(`/events/${eventId}/tracks`)
  return data
}

export async function createTrack(eventId: string, payload: CreateTrackPayload): Promise<Track> {
  const { data } = await apiClient.post<Track>(`/events/${eventId}/tracks`, payload)
  return data
}

export async function assignMentor(trackId: string, payload: AssignMentorPayload): Promise<void> {
  await apiClient.post(`/tracks/${trackId}/assign-mentor`, payload)
}
