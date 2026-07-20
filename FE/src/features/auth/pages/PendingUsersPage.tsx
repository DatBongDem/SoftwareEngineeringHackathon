import { Check, UserCheck } from 'lucide-react'
import { usePendingUsers } from '../hooks/usePendingUsers'
import { useApproveUser } from '../hooks/useApproveUser'
import { Alert, Avatar, Badge, Button, EmptyState, PageHeader, Table, TableSkeleton } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { userTypeLabels } from '@/shared/types/enums'
import type { CurrentUser } from '../types'

export function PendingUsersPage() {
  const { data: pendingUsers, isLoading, error } = usePendingUsers()
  const approveUser = useApproveUser()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Pending Approvals"
        description={
          pendingUsers
            ? `${pendingUsers.length} account${pendingUsers.length === 1 ? '' : 's'} waiting for review`
            : 'Review and approve newly registered accounts.'
        }
      />

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {approveUser.isError && <Alert tone="danger">{getErrorMessage(approveUser.error)}</Alert>}

      {isLoading && <TableSkeleton columns={5} rows={4} />}

      {!isLoading && pendingUsers?.length === 0 && (
        <EmptyState icon={UserCheck} message="No accounts are waiting for approval." />
      )}

      {!isLoading && pendingUsers && pendingUsers.length > 0 && (
        <Table<CurrentUser>
          rows={pendingUsers}
          rowKey={(row) => row.id}
          columns={[
            {
              header: 'Name',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.fullName} size="sm" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{row.fullName}</p>
                    <p className="text-xs text-slate-400">{row.email}</p>
                  </div>
                </div>
              ),
            },
            { header: 'Type', render: (row) => userTypeLabels[row.userType] },
            {
              header: 'Details',
              render: (row) => [row.studentId, row.universityName].filter(Boolean).join(' — ') || '—',
            },
            {
              header: 'Roles',
              render: (row) => (
                <div className="flex flex-wrap gap-1">
                  {row.roles.map((role) => (
                    <Badge key={role} tone="info">
                      {role}
                    </Badge>
                  ))}
                </div>
              ),
            },
            {
              header: '',
              render: (row) => (
                <Button
                  variant="primary"
                  size="sm"
                  loading={approveUser.isPending && approveUser.variables === row.id}
                  onClick={() => approveUser.mutate(row.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </Button>
              ),
            },
          ]}
        />
      )}
    </div>
  )
}
