import { CircleDot, Clock, FolderGit2, GitFork, Star } from 'lucide-react'
import { Card } from '@/shared/components'
import { cn } from '@/shared/lib/cn'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import type { GithubRepoMetadata } from '../types'

const languageDotPalette = [
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-indigo-500',
]

function languageDotColor(language: string) {
  let hash = 0
  for (let i = 0; i < language.length; i++) hash = language.charCodeAt(i) + ((hash << 5) - hash)
  return languageDotPalette[Math.abs(hash) % languageDotPalette.length]
}

interface Stat {
  icon: typeof Star
  label: string
  value: string
  iconClassName: string
}

export function GithubMetadataCard({ metadata }: { metadata: GithubRepoMetadata | null }) {
  if (!metadata) {
    return (
      <Card className="flex items-center gap-3 border-dashed text-sm text-slate-500 dark:text-slate-400">
        <FolderGit2 className="h-5 w-5 shrink-0" />
        No GitHub metadata yet — sync to fetch stars, forks, and activity.
      </Card>
    )
  }

  const stats: Stat[] = [
    { icon: Star, label: 'Stars', value: String(metadata.stars), iconClassName: 'text-amber-500' },
    { icon: GitFork, label: 'Forks', value: String(metadata.forks), iconClassName: 'text-indigo-500' },
    {
      icon: CircleDot,
      label: 'Open issues',
      value: String(metadata.openIssues),
      iconClassName: 'text-rose-500',
    },
    {
      icon: Clock,
      label: 'Last commit',
      value: metadata.lastCommitDate ? formatRelativeTime(metadata.lastCommitDate) : 'Unknown',
      iconClassName: 'text-slate-400',
    },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FolderGit2 className="h-4 w-4 text-slate-400" />
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
          <span className={cn('h-2 w-2 rounded-full', languageDotColor(metadata.primaryLanguage))} />
          {metadata.primaryLanguage}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-in slide-in-from-bottom flex flex-col gap-1"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <stat.icon className={cn('h-4 w-4', stat.iconClassName)} />
            <span className="text-xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
              {stat.value}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
