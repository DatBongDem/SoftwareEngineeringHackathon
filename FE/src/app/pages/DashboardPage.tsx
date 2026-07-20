import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, CalendarRange, ShieldCheck, UserCircle, UserCog } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useEvents } from '@/features/events/hooks/useEvents'
import { Alert, Badge, Card, Stat } from '@/shared/components'

const quickLinks = [
  {
    to: '/events',
    label: 'Events',
    description: 'Browse hackathon events, tracks, rounds, and criteria.',
    icon: CalendarRange,
  },
  {
    to: '/profile',
    label: 'My Profile',
    description: 'View your account details and approval status.',
    icon: UserCircle,
  },
]

const adminLinks = [
  {
    to: '/admin/pending-users',
    label: 'Pending Approvals',
    description: 'Review and approve newly registered accounts.',
    icon: UserCog,
  },
  {
    to: '/admin/guest-judges',
    label: 'Guest Judges',
    description: 'Create temporary judge accounts for an event.',
    icon: ShieldCheck,
  },
]

export function DashboardPage() {
  const { user } = useAuth()
  const { data: events } = useEvents()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false

  const activeEventsCount = events?.filter((event) => event.isActive).length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-sm sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.15),transparent_45%)]" />
        <div className="relative flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, {user?.fullName?.split(' ').pop()}
          </h1>
          <div className="flex flex-wrap gap-2">
            {user?.roles.map((role) => (
              <Badge key={role} tone="info" className="bg-white/15 text-white ring-white/20">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {user?.isApproved === false && (
        <Alert tone="warning">
          Your account is awaiting Coordinator approval. Some actions will be unavailable until then.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <Stat label="Total events" value={events?.length ?? '—'} icon={CalendarRange} />
        </Card>
        <Card>
          <Stat label="Active right now" value={activeEventsCount} icon={CalendarCheck} />
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Quick access</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...quickLinks, ...(isCoordinator ? adminLinks : [])].map(({ to, label, description, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              <Card interactive className="flex h-full flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-900/40 dark:text-indigo-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-sm font-medium text-indigo-600">
                  Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="text-sm text-slate-600 dark:text-slate-300">
        Team, Submission, Judging, Ranking, and Prize modules will appear here as they're built. See{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">docs/frontend-plan.md</code>{' '}
        for progress.
      </Card>
    </div>
  )
}
