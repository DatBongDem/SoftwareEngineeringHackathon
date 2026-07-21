import { useState, type FormEvent } from 'react'
import { CheckCircle2, Link as LinkIcon, Rocket } from 'lucide-react'
import { useCreateSubmission } from '../hooks/useCreateSubmission'
import { Alert, Button, Input, Modal, Select, Textarea } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Round } from '@/features/events/types'

export function SubmitProjectModal({
  teamId,
  eventId,
  rounds,
  open,
  onClose,
}: {
  teamId: string
  eventId: string
  rounds: Round[]
  open: boolean
  onClose: () => void
}) {
  const createSubmission = useCreateSubmission(eventId)

  const [roundId, setRoundId] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [reportUrl, setReportUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [justSubmitted, setJustSubmitted] = useState(false)

  function reset() {
    setRoundId('')
    setRepoUrl('')
    setDemoUrl('')
    setReportUrl('')
    setNotes('')
  }

  function handleClose() {
    setJustSubmitted(false)
    reset()
    onClose()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createSubmission.mutate(
      {
        teamId,
        eventId,
        roundId,
        repoUrl,
        demoUrl: demoUrl || undefined,
        reportUrl: reportUrl || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setJustSubmitted(true)
          setTimeout(handleClose, 1400)
        },
      },
    )
  }

  if (justSubmitted) {
    return (
      <Modal open={open} onClose={handleClose}>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="animate-pop flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Submitted!</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your project is in. Good luck!</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} title="Submit project">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {createSubmission.isError && <Alert tone="danger">{getErrorMessage(createSubmission.error)}</Alert>}

        <Select
          label="Round"
          required
          placeholder="Choose a round"
          options={rounds.map((round) => ({ value: round.id, label: `Round ${round.roundNumber} — ${round.name}` }))}
          value={roundId}
          onChange={(e) => setRoundId(e.target.value)}
        />

        <Input
          label="Repository URL"
          type="url"
          required
          icon={<LinkIcon className="h-4 w-4" />}
          placeholder="https://github.com/your-team/project"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <Input
          label="Demo URL"
          type="url"
          icon={<LinkIcon className="h-4 w-4" />}
          placeholder="https://youtu.be/..."
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
        />
        <Input
          label="Report / slides URL"
          type="url"
          icon={<LinkIcon className="h-4 w-4" />}
          value={reportUrl}
          onChange={(e) => setReportUrl(e.target.value)}
        />
        <Textarea label="Notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />

        <Button type="submit" loading={createSubmission.isPending} className="w-fit">
          <Rocket className="h-4 w-4" />
          Submit
        </Button>
      </form>
    </Modal>
  )
}
