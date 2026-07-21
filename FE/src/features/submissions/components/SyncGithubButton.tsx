import { RefreshCw } from 'lucide-react'
import { useSyncGithub } from '../hooks/useSyncGithub'
import { Button } from '@/shared/components'
import { cn } from '@/shared/lib/cn'

export function SyncGithubButton({ submissionId }: { submissionId: string }) {
  const syncGithub = useSyncGithub(submissionId)

  return (
    <Button variant="secondary" size="sm" onClick={() => syncGithub.mutate()} disabled={syncGithub.isPending}>
      <RefreshCw className={cn('h-3.5 w-3.5', syncGithub.isPending && 'animate-spin')} />
      {syncGithub.isPending ? 'Syncing…' : 'Sync GitHub'}
    </Button>
  )
}
