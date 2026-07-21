import { useState, type FormEvent } from 'react'
import { ShieldX } from 'lucide-react'
import { useDisqualifySubmission } from '../hooks/useDisqualifySubmission'
import { Alert, Button, Modal, Textarea } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function DisqualifyModal({
  submissionId,
  open,
  onClose,
}: {
  submissionId: string
  open: boolean
  onClose: () => void
}) {
  const disqualify = useDisqualifySubmission(submissionId)
  const [reason, setReason] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    disqualify.mutate(
      { reason },
      {
        onSuccess: () => {
          setReason('')
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Disqualify submission">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Alert tone="warning">
          This marks the submission (and its score, if any) as disqualified. The reason is shown to the
          team and recorded for audit purposes.
        </Alert>

        {disqualify.isError && <Alert tone="danger">{getErrorMessage(disqualify.error)}</Alert>}

        <Textarea
          label="Reason"
          required
          rows={3}
          placeholder="Explain why this submission violates the rules…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <Button type="submit" variant="danger" loading={disqualify.isPending} className="w-fit">
          <ShieldX className="h-4 w-4" />
          Disqualify
        </Button>
      </form>
    </Modal>
  )
}
