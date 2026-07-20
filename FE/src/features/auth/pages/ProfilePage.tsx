import { useAuth } from '../context/AuthContext'
import { Alert, Avatar, Badge, Card, PageHeader } from '@/shared/components'
import { userTypeLabels } from '@/shared/types/enums'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  )
}

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="My Profile" description="Your account details and current status." />

      {!user.isApproved && (
        <Alert tone="warning">Your account is awaiting Coordinator approval.</Alert>
      )}

      <Card className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar name={user.fullName} size="lg" />
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user.fullName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800">
          <Field label="Account type" value={userTypeLabels[user.userType]} />
          {user.studentId && <Field label="Student ID" value={user.studentId} />}
          {user.universityName && <Field label="University" value={user.universityName} />}

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Roles</span>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <Badge key={role} tone="info">
                  {role}
                </Badge>
              ))}
              <Badge tone={user.isApproved ? 'success' : 'warning'} dot>
                {user.isApproved ? 'Approved' : 'Pending approval'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
