import { useLocation, Outlet } from 'react-router-dom'
import { Gavel, ShieldCheck, Trophy, Users } from 'lucide-react'
import { ThemeToggle } from '@/shared/components'
import { cn } from '@/shared/lib/cn'

const highlights = [
  { icon: Trophy, text: 'Three hackathon seasons a year: Spring, Summer, Fall', accent: true },
  { icon: Users, text: 'Teams of 3–5 members, open to FPT students and partner universities' },
  { icon: Gavel, text: 'Transparent criteria-based scoring with a full audit trail' },
  { icon: ShieldCheck, text: 'Automated ranking, promotion, and prize awarding' },
]

const heroCopy = {
  login: {
    headline: (
      <>
        Software Engineering
        <br />
        Agile League
      </>
    ),
    description:
      "The academic hackathon management platform run by the Software Engineering Department, in partnership with PDP — FPT University HCMC.",
  },
  register: {
    headline: (
      <>
        Start your
        <br />
        Hackathon journey
      </>
    ),
    description:
      'Create an account to form a team, register for a track, submit your project, and track your scoring results — it only takes a minute.',
  },
}

export function AuthLayout() {
  const location = useLocation()
  const copy = location.pathname.startsWith('/register') ? heroCopy.register : heroCopy.login

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-indigo-700 via-indigo-800 to-slate-900 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Trophy className="h-5 w-5 text-amber-400" />
          </span>
          <span className="font-display text-lg font-semibold">SEAL Hackathon</span>
        </div>

        <div className="relative flex flex-col gap-8">
          <div>
            <h2 className="font-display text-3xl leading-tight font-semibold">{copy.headline}</h2>
            <p className="mt-3 max-w-sm text-sm text-indigo-100">{copy.description}</p>
          </div>
          <ul className="flex flex-col gap-4">
            {highlights.map(({ icon: Icon, text, accent }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-indigo-50">
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                    accent ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-200">© {new Date().getFullYear()} SEAL — FPT University HCMC</p>
      </div>

      <div className="relative flex w-full flex-col lg:w-1/2 overflow-hidden">
        {/* Animated Background Glowing Blobs */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute -top-12 -left-12 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-12 -right-12 h-96 w-96 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative flex justify-end px-4 pt-4 sm:px-6 lg:pt-6">
          <ThemeToggle />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="animate-in fade-in w-full max-w-md">
            <div className="mb-6 text-center lg:hidden">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-700 to-slate-900 text-white">
                <Trophy className="h-5 w-5 text-amber-400" />
              </div>
              <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
                SEAL Hackathon
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Software Engineering Agile League</p>
            </div>
            <Outlet />
          </div>
        </div>

        <p className="relative pb-6 text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} SEAL — FPT University HCMC
        </p>
      </div>
    </div>
  )
}
