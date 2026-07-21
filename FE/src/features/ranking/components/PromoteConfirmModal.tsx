import { Award } from 'lucide-react'
import { usePromoteTopTeams } from '../hooks/usePromoteTopTeams'
import { Alert, Button, Modal } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

interface PromoteConfirmModalProps {
  roundId: string
  eventId: string
  topN: number
  open: boolean
  onClose: () => void
}

export function PromoteConfirmModal({ roundId, eventId, topN, open, onClose }: PromoteConfirmModalProps) {
  const promoteTopTeams = usePromoteTopTeams(roundId, eventId)

  function handleConfirm() {
    promoteTopTeams.mutate(undefined, { onSuccess: onClose })
  }

  return (
    <Modal open={open} onClose={onClose} title="Promote top teams">
      <div className="flex flex-col gap-4">
        {promoteTopTeams.isError && <Alert tone="danger">{getErrorMessage(promoteTopTeams.error)}</Alert>}
        <Alert tone="warning">
          This promotes the top <span className="font-semibold tabular-nums">{topN}</span> non-disqualified
          team{topN === 1 ? '' : 's'} <span className="font-semibold">within each Track</span> by final
          weighted score to the next round (a round with multiple Tracks gets top {topN} promoted per
          Track, not top {topN} overall). This cannot be undone from here.
        </Alert>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} loading={promoteTopTeams.isPending}>
            <Award className="h-4 w-4" />
            Promote top {topN} per track
          </Button>
        </div>
      </div>
    </Modal>
  )
}
