import { useState, type FormEvent } from 'react'
import { GraduationCap } from 'lucide-react'
import { useRegisterTrack } from '../hooks/useRegisterTrack'
import { useTracks } from '@/features/tracks/hooks/useTracks'
import { Alert, Button, Modal, Select } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function RegisterTrackModal({
  teamId,
  eventId,
  open,
  onClose,
}: {
  teamId: string
  eventId: string
  open: boolean
  onClose: () => void
}) {
  const { data: tracks } = useTracks(eventId)
  const registerTrack = useRegisterTrack(teamId)
  const [trackId, setTrackId] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    registerTrack.mutate(
      { trackId },
      {
        onSuccess: () => {
          setTrackId('')
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Register track">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {registerTrack.isError && <Alert tone="danger">{getErrorMessage(registerTrack.error)}</Alert>}

        <Select
          label="Track"
          required
          placeholder="Choose a track"
          options={(tracks ?? []).map((track) => ({ value: track.id, label: track.name }))}
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
        />

        <Button type="submit" loading={registerTrack.isPending} className="w-fit">
          <GraduationCap className="h-4 w-4" />
          Register track
        </Button>
      </form>
    </Modal>
  )
}
