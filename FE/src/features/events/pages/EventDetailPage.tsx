import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarClock, Download, ListChecks, ListOrdered, Medal, ScrollText, Trophy, Users, UsersRound } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useEvent } from '../hooks/useEvent'
import { RoundsPanel } from '../components/RoundsPanel'
import { TracksPanel } from '@/features/tracks/components/TracksPanel'
import { CriteriaPanel } from '@/features/criteria/components/CriteriaPanel'
import { TeamsPanel } from '@/features/teams/components/TeamsPanel'
import { PrizesPanel } from '@/features/prizes/components/PrizesPanel'
import { ExportPanel } from '@/features/export/components/ExportPanel'
import { AuditLogPanel } from '@/features/auditlog/components/AuditLogPanel'
import { EventRankingPanel } from '@/features/ranking/components/EventRankingPanel'
import { Alert, Badge, Card, Spinner } from '@/shared/components'
import { cn } from '@/shared/lib/cn'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

type Tab = 'tracks' | 'rounds' | 'criteria' | 'teams' | 'prizes' | 'ranking' | 'export' | 'audit-log'

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'tracks', label: 'Tracks', icon: Users },
  { id: 'rounds', label: 'Rounds', icon: Medal },
  { id: 'criteria', label: 'Criteria', icon: ListChecks },
  { id: 'teams', label: 'Teams', icon: UsersRound },
  { id: 'prizes', label: 'Prizes', icon: Trophy },
  { id: 'ranking', label: 'Ranking', icon: ListOrdered },
]

const coordinatorTabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'export', label: 'Export', icon: Download },
  { id: 'audit-log', label: 'Audit Log', icon: ScrollText },
]

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { user } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false
  const { data: event, isLoading, error } = useEvent(eventId)
  const [activeTab, setActiveTab] = useState<Tab>('tracks')

  const visibleTabs = isCoordinator ? [...tabs, ...coordinatorTabs] : tabs

  if (isLoading) return <Spinner />
  if (error) return <Alert tone="danger">{getErrorMessage(error)}</Alert>
  if (!event) return null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to="/events"
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to events
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {event.title}
          </h1>
          <Badge tone={event.isActive ? 'success' : 'neutral'} dot>
            {event.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{event.description}</p>
      </div>

      <Card className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
          <CalendarClock className="h-4.5 w-4.5" />
        </span>
        <span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {event.term} {event.academicYear}
          </span>{' '}
          · {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}
        </span>
      </Card>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tracks' && <TracksPanel eventId={event.id} />}
      {activeTab === 'rounds' && <RoundsPanel eventId={event.id} />}
      {activeTab === 'criteria' && <CriteriaPanel eventId={event.id} />}
      {activeTab === 'teams' && <TeamsPanel eventId={event.id} />}
      {activeTab === 'prizes' && <PrizesPanel eventId={event.id} />}
      {activeTab === 'ranking' && <EventRankingPanel eventId={event.id} />}
      {activeTab === 'export' && isCoordinator && <ExportPanel eventId={event.id} />}
      {activeTab === 'audit-log' && isCoordinator && <AuditLogPanel eventId={event.id} />}
    </div>
  )
}
