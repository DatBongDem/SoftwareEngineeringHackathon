import { useState } from 'react'
import { Bell, Check, Eye, Megaphone, Inbox } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead'
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead'
import { BroadcastModal } from '../components/BroadcastModal'
import { Alert, Badge, Button, Card, EmptyState, PageHeader, Spinner } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function NotificationsPage() {
  const { user } = useAuth()
  const isCoordinator = user?.roles.includes('Coordinator') ?? false

  const { data: notifications, isLoading, error } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const [broadcastOpen, setBroadcastOpen] = useState(false)

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0

  if (isLoading) return <Spinner label="Loading notifications..." />
  if (error) return <Alert tone="danger">{getErrorMessage(error)}</Alert>

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Thông báo"
        description={`Bạn có ${unreadCount} thông báo chưa đọc.`}
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                loading={markAllRead.isPending}
                onClick={() => markAllRead.mutate()}
              >
                <Check className="h-3.5 w-3.5" />
                Đọc tất cả
              </Button>
            )}
            {isCoordinator && (
              <Button size="sm" onClick={() => setBroadcastOpen(true)}>
                <Megaphone className="h-3.5 w-3.5" />
                Phát thông báo BTC
              </Button>
            )}
          </div>
        }
      />

      {notifications && notifications.length === 0 ? (
        <EmptyState icon={Inbox} message="Hộp thư của bạn đang trống." />
      ) : (
        <div className="flex flex-col gap-3">
          {notifications
            ?.slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((n) => (
              <Card
                key={n.id}
                className={`relative flex items-start justify-between gap-4 p-4 border transition-all ${
                  n.isRead
                    ? 'border-slate-200/50 bg-white/40 dark:border-slate-800/40 dark:bg-slate-900/20 opacity-80'
                    : 'border-indigo-100 bg-white shadow-sm ring-1 ring-indigo-500/5 dark:border-indigo-950 dark:bg-slate-900/60'
                }`}
              >
                <div className="flex gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      n.isRead
                        ? 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500'
                        : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 animate-pulse-slow'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm ${
                          n.isRead
                            ? 'text-slate-650 dark:text-slate-400'
                            : 'font-medium text-slate-900 dark:text-white'
                        }`}
                      >
                        {n.message}
                      </span>
                      <Badge tone={n.type === 'System' ? 'info' : 'warning'}>{n.type}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {new Date(n.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={markRead.isPending && markRead.variables === n.id}
                    onClick={() => markRead.mutate(n.id)}
                    title="Đánh dấu đã đọc"
                    className="shrink-0"
                  >
                    <Eye className="h-4 w-4 text-slate-400 hover:text-indigo-650" />
                  </Button>
                )}
              </Card>
            ))}
        </div>
      )}

      {isCoordinator && (
        <BroadcastModal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} />
      )}
    </div>
  )
}
