import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useCreateTeam } from '../hooks/useCreateTeam'
import { useTracks } from '@/features/tracks/hooks/useTracks'
import { Alert, Button, Input, Modal, Select } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function CreateTeamModal({
  eventId,
  open,
  onClose,
}: {
  eventId: string
  open: boolean
  onClose: () => void
}) {
  const { data: tracks } = useTracks(eventId)
  const createTeam = useCreateTeam(eventId)

  const [teamName, setTeamName] = useState('')
  const [trackId, setTrackId] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createTeam.mutate(
      { eventId, teamName, trackId: trackId || undefined },
      {
        onSuccess: () => {
          setTeamName('')
          setTrackId('')
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Create team">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {createTeam.isError && <Alert tone="danger">{getErrorMessage(createTeam.error)}</Alert>}

        <Input label="Team name" required value={teamName} onChange={(e) => setTeamName(e.target.value)} />

        <Select
          label="Track (optional — can register later)"
          placeholder="No track yet"
          options={(tracks ?? []).map((track) => ({ value: track.id, label: track.name }))}
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
        />

        <Button type="submit" loading={createTeam.isPending} className="w-fit">
          <Plus className="h-4 w-4" />
          Create team
        </Button>
      </form>
    </Modal>
  )
}
