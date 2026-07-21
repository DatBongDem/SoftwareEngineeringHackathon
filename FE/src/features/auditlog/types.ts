export interface AuditLog {
  id: string
  eventId: string | null
  action: string
  performedByUserId: string
  targetEntityId: string
  details: string
  timestamp: string
}
