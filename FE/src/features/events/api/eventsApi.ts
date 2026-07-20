import { apiClient } from '@/shared/lib/apiClient'
import type { AssignJudgesPayload, CreateEventPayload, CreateRoundPayload, HackathonEvent, Round } from '../types'

export async function getEvents(): Promise<HackathonEvent[]> {
  const { data } = await apiClient.get<HackathonEvent[]>('/events')
  return data
}

export async function getEventById(eventId: string): Promise<HackathonEvent> {
  const { data } = await apiClient.get<HackathonEvent>(`/events/${eventId}`)
  return data
}

export async function createEvent(payload: CreateEventPayload): Promise<HackathonEvent> {
  const { data } = await apiClient.post<HackathonEvent>('/events', payload)
  return data
}

export async function getRoundsByEvent(eventId: string): Promise<Round[]> {
  const { data } = await apiClient.get<Round[]>(`/events/${eventId}/rounds`)
  return data
}

export async function createRound(eventId: string, payload: CreateRoundPayload): Promise<Round> {
  const { data } = await apiClient.post<Round>(`/events/${eventId}/rounds`, payload)
  return data
}

export async function assignJudges(roundId: string, payload: AssignJudgesPayload): Promise<void> {
  await apiClient.post(`/rounds/${roundId}/assign-judges`, payload)
}
