import { apiClient } from '@/shared/lib/apiClient'
import type { Criteria, CreateCriteriaPayload } from '../types'

// Global default-template endpoints (GET/POST /api/criteria/templates) aren't wired
// up yet — this module currently only covers per-event criteria (Module 2's Round
// creation depends on it). See docs/frontend-plan.md Module 4 for the rest.

export async function getEventCriteria(eventId: string): Promise<Criteria[]> {
  const { data } = await apiClient.get<Criteria[]>(`/events/${eventId}/criteria`)
  return data
}

export async function createEventCriteria(eventId: string, payload: CreateCriteriaPayload): Promise<Criteria> {
  const { data } = await apiClient.post<Criteria>(`/events/${eventId}/criteria`, payload)
  return data
}
