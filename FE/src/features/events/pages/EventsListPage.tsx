import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Plus } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useEvents } from '../hooks/useEvents'
import { CreateEventModal } from '../components/CreateEventModal'
import { Alert, Badge, Button, Card, CardGridSkeleton, EmptyState, PageHeader } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function EventsListPage() {
  const { user } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false
  const { data: events, isLoading, error } = useEvents()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Events"
        description="Hackathon events, tracks, and rounds."
        action={
          isCoordinator && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create event
            </Button>
          )
        }
      />

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
      {isLoading && <CardGridSkeleton />}

      {events && events.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          message="No hackathon events yet."
          action={
            isCoordinator && (
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create the first event
              </Button>
            )
          }
        />
      )}

      {events && events.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              <Card interactive className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-900/40 dark:text-indigo-300">
                    <CalendarDays className="h-4.5 w-4.5" />
                  </span>
                  <Badge tone={event.isActive ? 'success' : 'neutral'} dot>
                    {event.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <h2 className="font-medium text-slate-900 dark:text-slate-100">{event.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {event.description}
                  </p>
                </div>
                <p className="mt-auto text-xs font-medium text-slate-400">
                  {event.term} {event.academicYear}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateEventModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
