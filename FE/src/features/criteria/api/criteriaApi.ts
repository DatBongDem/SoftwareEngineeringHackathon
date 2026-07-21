import { apiClient } from '@/shared/lib/apiClient'
import type { Criteria, CreateCriteriaPayload } from '../types'

export async function getEventCriteria(eventId: string): Promise<Criteria[]> {
  const { data } = await apiClient.get<Criteria[]>(`/events/${eventId}/criteria`)
  return data
}

export async function createEventCriteria(eventId: string, payload: CreateCriteriaPayload): Promise<Criteria> {
  const { data } = await apiClient.post<Criteria>(`/events/${eventId}/criteria`, payload)
  return data
}

export async function getDefaultTemplates(): Promise<Criteria[]> {
  const { data } = await apiClient.get<Criteria[]>('/criteria/templates')
  return data
}

// BE forces isDefaultTemplate=true server-side regardless of what's sent, so
// the payload only needs the shared fields.
export async function createDefaultTemplate(
  payload: Omit<CreateCriteriaPayload, 'isDefaultTemplate'>,
): Promise<Criteria> {
  const { data } = await apiClient.post<Criteria>('/criteria/templates', {
    ...payload,
    isDefaultTemplate: true,
  })
  return data
}
