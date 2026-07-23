import { useState, type FormEvent } from 'react'
import { GraduationCap } from 'lucide-react'
import { useAssignMentor } from '../hooks/useAssignMentor'
import { Alert, Button, Input, Modal } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Track } from '../types'

export function AssignMentorModal({
  eventId,
  track,
  onClose,
}: {
  eventId: string
  track: Track | null
  onClose: () => void
}) {
  const assignMentor = useAssignMentor(eventId, track?.id ?? '')
  const [mentorUserId, setMentorUserId] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    assignMentor.mutate(
      { mentorUserId },
      {
        onSuccess: () => {
          setMentorUserId('')
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={track !== null} onClose={onClose} title={`Assign mentor — ${track?.name ?? ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {assignMentor.isError && <Alert tone="danger">{getErrorMessage(assignMentor.error)}</Alert>}

        <Alert tone="warning">
          Enter the mentor's user ID manually — copy it from the Pending Approvals page.
        </Alert>

        <Input
          label="Mentor user ID"
          required
          value={mentorUserId}
          onChange={(e) => setMentorUserId(e.target.value)}
        />

        {track && track.mentorUserIds.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Currently assigned: {track.mentorUserIds.join(', ')}
          </p>
        )}

        <Button type="submit" loading={assignMentor.isPending} className="w-fit">
          <GraduationCap className="h-4 w-4" />
          Assign mentor
        </Button>
      </form>
    </Modal>
  )
}
