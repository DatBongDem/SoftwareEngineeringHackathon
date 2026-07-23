import { useState, type FormEvent } from 'react'
import { Gavel } from 'lucide-react'
import { useAssignJudges } from '../hooks/useAssignJudges'
import { Alert, Button, Modal, Textarea } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Round } from '../types'

export function AssignJudgesModal({
  eventId,
  round,
  onClose,
}: {
  eventId: string
  round: Round | null
  onClose: () => void
}) {
  const assignJudges = useAssignJudges(eventId, round?.id ?? '')
  const [judgeIdsText, setJudgeIdsText] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const judgeUserIds = judgeIdsText
      .split(/[\n,]/)
      .map((id) => id.trim())
      .filter(Boolean)

    assignJudges.mutate(
      { judgeUserIds },
      {
        onSuccess: () => {
          setJudgeIdsText('')
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={round !== null} onClose={onClose} title={`Assign judges — ${round?.name ?? ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {assignJudges.isError && <Alert tone="danger">{getErrorMessage(assignJudges.error)}</Alert>}

        <Alert tone="warning">
          Enter judge user IDs manually — copy them from the Pending Approvals page.
        </Alert>

        <Textarea
          label="Judge user IDs (one per line, or comma-separated)"
          required
          rows={4}
          value={judgeIdsText}
          onChange={(e) => setJudgeIdsText(e.target.value)}
        />

        {round && round.judgeUserIds.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Currently assigned: {round.judgeUserIds.join(', ')}
          </p>
        )}

        <Button type="submit" loading={assignJudges.isPending} className="w-fit">
          <Gavel className="h-4 w-4" />
          Assign judges
        </Button>
      </form>
    </Modal>
  )
}
