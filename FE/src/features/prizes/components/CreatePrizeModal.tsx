import { useState, type FormEvent } from 'react'
import { Trophy } from 'lucide-react'
import { useTeamsByEvent } from '@/features/teams/hooks/useTeamsByEvent'
import { useTracks } from '@/features/tracks/hooks/useTracks'
import { useCreatePrize } from '../hooks/useCreatePrize'
import { Alert, Button, Input, Modal, Select } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function CreatePrizeModal({
  eventId,
  open,
  onClose,
}: {
  eventId: string
  open: boolean
  onClose: () => void
}) {
  const { data: teams } = useTeamsByEvent(eventId)
  const { data: tracks } = useTracks(eventId)
  const createPrize = useCreatePrize(eventId)

  const [name, setName] = useState('')
  const [teamId, setTeamId] = useState('')
  const [trackId, setTrackId] = useState('')
  const [reward, setReward] = useState('')

  function reset() {
    setName('')
    setTeamId('')
    setTrackId('')
    setReward('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createPrize.mutate(
      { name, teamId, trackId: trackId || undefined, reward },
      { onSuccess: handleClose },
    )
  }

  return (
    <Modal open={open} onClose={handleClose} title="Create prize">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {createPrize.isError && <Alert tone="danger">{getErrorMessage(createPrize.error)}</Alert>}

        <Input
          label="Prize name"
          required
          placeholder="Best Overall, Best UI/UX, ..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          label="Track (optional)"
          placeholder="Event-wide prize (no specific track)"
          options={(tracks ?? []).map((track) => ({ value: track.id, label: track.name }))}
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
        />
        <Select
          label="Winning team"
          required
          placeholder="Choose a team"
          options={(teams ?? []).map((team) => ({ value: team.id, label: team.teamName }))}
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <Input
          label="Reward"
          required
          placeholder="10,000,000 VND + certificate"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
        />

        <Button type="submit" loading={createPrize.isPending} className="w-fit">
          <Trophy className="h-4 w-4" />
          Create prize
        </Button>
      </form>
    </Modal>
  )
}
