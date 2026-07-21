import { apiClient } from '@/shared/lib/apiClient'
import type { AuditLog } from '../types'

export async function getAuditLogsByEvent(eventId: string): Promise<AuditLog[]> {
  const { data } = await apiClient.get<AuditLog[]>('/auditlogs', { params: { eventId } })
  return data
}
