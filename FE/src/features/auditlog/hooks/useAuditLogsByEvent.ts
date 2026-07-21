import { useQuery } from '@tanstack/react-query'
import * as auditLogApi from '../api/auditLogApi'

export function useAuditLogsByEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'auditLogs'],
    queryFn: () => auditLogApi.getAuditLogsByEvent(eventId!),
    enabled: Boolean(eventId),
  })
}
