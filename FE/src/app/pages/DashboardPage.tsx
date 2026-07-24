import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, CalendarRange, ShieldCheck, UserCircle, UserCog } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useEvents } from '@/features/events/hooks/useEvents'
import { Alert, Badge, Card, Reveal, Stat } from '@/shared/components'

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
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 via-violet-750 to-indigo-950 p-6 text-white shadow-lg sm:p-8 border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative flex flex-col gap-3">
          <span className="w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            System Dashboard
          </span>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl drop-shadow-sm">
            Welcome back, {user?.fullName?.split(' ').pop()}
          </h1>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user?.roles.map((role) => (
              <Badge key={role} tone="info" className="bg-white/15 text-white ring-1 ring-white/20 px-3 py-1 font-semibold">
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
        <Reveal>
          <Card>
            <Stat label="Total events" value={events?.length ?? '—'} icon={CalendarRange} />
          </Card>
        </Reveal>
        <Reveal delayMs={60}>
          <Card>
            <Stat
              label="Active right now"
              value={activeEventsCount}
              icon={CalendarCheck}
              iconClassName="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            />
          </Card>
        </Reveal>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">Quick access</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...quickLinks, ...(isCoordinator ? adminLinks : [])].map(({ to, label, description, icon: Icon }, i) => (
            <Reveal key={to} delayMs={i * 60} className="h-full">
              <Link
                to={to}
                className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
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
            </Reveal>
          ))}
        </div>
      </div>

      <Card className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>SEAL Software Engineering Agile League · FPT University HCMC</span>
        <span className="font-medium text-indigo-500 hover:underline cursor-pointer">v1.2.0 (Stable)</span>
      </Card>
    </div>
  )
}
