import { NavLink, Outlet } from 'react-router-dom'
import {
  CalendarRange,
  Gavel,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Trophy,
  UserCircle,
  UserCog,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Avatar, Badge, ThemeToggle } from '@/shared/components'
import { cn } from '@/shared/lib/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/events', label: 'Events', icon: CalendarRange, end: false },
  { to: '/profile', label: 'My Profile', icon: UserCircle, end: false },
]

const judgeNavItems = [{ to: '/judging', label: 'Judging', icon: Gavel, end: false }]

const adminNavItems = [
  { to: '/admin/pending-users', label: 'Pending Approvals', icon: UserCog, end: false },
  { to: '/admin/guest-judges', label: 'Guest Judges', icon: ShieldCheck, end: false },
]

const logoutButtonClass =
  'rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900'

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
          isActive
            ? 'bg-indigo-50 font-semibold text-indigo-700 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-300'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        )
      }
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      {label}
    </NavLink>
  )
}

export function MainLayout() {
  const { user, logout } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false
  const isJudge = user?.roles.includes('Judge') ?? false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-700 to-slate-900 text-white shadow-sm shadow-indigo-900/30">
            <Trophy className="h-4.5 w-4.5 text-amber-400" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              SEAL Hackathon
            </p>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          {isJudge &&
            judgeNavItems.map((item) => <NavItem key={item.to} {...item} />)}

          {isCoordinator && (
            <>
              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Coordinator
              </p>
              {adminNavItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </>
          )}
        </nav>

        <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-400">Theme</span>
          <ThemeToggle />
        </div>

        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar name={user?.fullName ?? ''} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.fullName}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <button onClick={logout} aria-label="Log out" className={logoutButtonClass}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-700 to-slate-900 text-white">
              <Trophy className="h-4 w-4 text-amber-400" />
            </span>
            <span className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              SEAL Hackathon
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button onClick={logout} aria-label="Log out" className={logoutButtonClass}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 dark:border-slate-800">
          {[...navItems, ...(isJudge ? judgeNavItems : []), ...(isCoordinator ? adminNavItems : [])].map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </header>

      <main className="px-4 py-8 sm:px-6 md:ml-64 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {user && !user.isApproved && (
            <Badge tone="warning" dot className="w-fit">
              Account pending Coordinator approval
            </Badge>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
