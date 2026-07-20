import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useCreateTrack } from '../hooks/useCreateTrack'
import { Alert, Button, Input, Modal, Textarea } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function CreateTrackModal({
  eventId,
  open,
  onClose,
}: {
  eventId: string
  open: boolean
  onClose: () => void
}) {
  const createTrack = useCreateTrack(eventId)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [maxTeams, setMaxTeams] = useState('20')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createTrack.mutate(
      { name, description, maxTeams: Number(maxTeams) },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Create track">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {createTrack.isError && <Alert tone="danger">{getErrorMessage(createTrack.error)}</Alert>}

        <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea
          label="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Max teams"
          type="number"
          min="1"
          required
          value={maxTeams}
          onChange={(e) => setMaxTeams(e.target.value)}
        />

        <Button type="submit" loading={createTrack.isPending} className="w-fit">
          <Plus className="h-4 w-4" />
          Create track
        </Button>
      </form>
    </Modal>
  )
}
