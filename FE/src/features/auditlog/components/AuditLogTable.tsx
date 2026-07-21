import { Link } from 'react-router-dom'
import { Badge, Table } from '@/shared/components'
import type { AuditLog } from '../types'

const actionTones: Record<string, 'info' | 'danger' | 'success' | 'warning' | 'neutral'> = {
  SUBMIT_SCORE: 'info',
  DISQUALIFY_SUBMISSION: 'danger',
  PROMOTE_TEAM: 'success',
  APPROVE_ACCOUNT: 'success',
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <Table<AuditLog>
      rows={logs}
      rowKey={(row) => row.id}
      columns={[
        {
          header: 'Timestamp',
          render: (row) => (
            <span className="tabular-nums whitespace-nowrap">{new Date(row.timestamp).toLocaleString()}</span>
          ),
        },
        {
          header: 'Action',
          render: (row) => <Badge tone={actionTones[row.action] ?? 'neutral'}>{row.action}</Badge>,
        },
        {
          header: 'Target',
          render: (row) =>
            row.action === 'SUBMIT_SCORE' ? (
              <Link
                to={`/submissions/${row.targetEntityId}`}
                className="font-mono text-xs text-indigo-600 hover:underline"
              >
                {row.targetEntityId}
              </Link>
            ) : (
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.targetEntityId}</span>
            ),
        },
        {
          header: 'Performed by (user ID)',
          render: (row) => (
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.performedByUserId}</span>
          ),
        },
        {
          header: 'Details',
          render: (row) => <span className="text-slate-600 dark:text-slate-300">{row.details}</span>,
        },
      ]}
    />
  )
}
