import { useMemo, useState } from 'react'
import { ScrollText } from 'lucide-react'
import { useAuditLogsByEvent } from '../hooks/useAuditLogsByEvent'
import { AuditLogTable } from './AuditLogTable'
import { Alert, EmptyState, Select, TableSkeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function AuditLogPanel({ eventId }: { eventId: string }) {
  const { data: logs, isLoading, error } = useAuditLogsByEvent(eventId)
  const [actionFilter, setActionFilter] = useState('')

  const actionOptions = useMemo(() => {
    const distinct = Array.from(new Set((logs ?? []).map((log) => log.action)))
    return distinct.map((action) => ({ value: action, label: action }))
  }, [logs])

  const sortedLogs = useMemo(
    () => (logs ?? []).slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [logs],
  )
  const filteredLogs = actionFilter ? sortedLogs.filter((log) => log.action === actionFilter) : sortedLogs

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Alert tone="info">
        Only scoring actions are logged today — disqualify/promote/approve will appear here in a future
        update. "Performed by" shows the raw user ID rather than a name.
      </Alert>

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <TableSkeleton columns={5} rows={4} />}

      {!isLoading && logs && logs.length === 0 && (
        <EmptyState icon={ScrollText} message="No audit log entries for this event yet." />
      )}

      {logs && logs.length > 0 && (
        <>
          <Select
            label="Filter by action"
            placeholder="All actions"
            options={actionOptions}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="max-w-xs"
          />
          <AuditLogTable logs={filteredLogs} />
        </>
      )}
    </div>
  )
}
