import { useState, type FormEvent } from 'react'
import { UserPlus } from 'lucide-react'
import { useInviteMember } from '../hooks/useInviteMember'
import { Alert, Button, Input, Modal } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function InviteMemberModal({
  teamId,
  open,
  onClose,
}: {
  teamId: string
  open: boolean
  onClose: () => void
}) {
  const inviteMember = useInviteMember(teamId)
  const [emailOrStudentId, setEmailOrStudentId] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    inviteMember.mutate(
      { emailOrStudentId },
      {
        onSuccess: () => {
          setEmailOrStudentId('')
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite member">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {inviteMember.isError && <Alert tone="danger">{getErrorMessage(inviteMember.error)}</Alert>}

        <Input
          label="Email or Student ID"
          required
          value={emailOrStudentId}
          onChange={(e) => setEmailOrStudentId(e.target.value)}
        />

        <Button type="submit" loading={inviteMember.isPending} className="w-fit">
          <UserPlus className="h-4 w-4" />
          Invite
        </Button>
      </form>
    </Modal>
  )
}
