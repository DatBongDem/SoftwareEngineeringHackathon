import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Gavel } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useSubmissionScores } from '../hooks/useSubmissionScores'
import { useSubmitScores } from '../hooks/useSubmitScores'
import { Alert, Button, Input, Modal, Textarea } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import type { Criteria } from '@/features/criteria/types'

interface ScoreModalProps {
  submissionId: string
  roundId: string
  criteria: Criteria[]
  teamName?: string
  open: boolean
  onClose: () => void
}

type Draft = Record<string, { score: string; comment: string }>

export function ScoreModal({ submissionId, roundId, criteria, teamName, open, onClose }: ScoreModalProps) {
  const { user } = useAuth()
  const { data: existingScores } = useSubmissionScores(submissionId)
  const submitScores = useSubmitScores()

  const [draft, setDraft] = useState<Draft>({})
  const [justSubmitted, setJustSubmitted] = useState(false)

  // Re-populate from this judge's existing scores every time the modal opens
  // (component stays mounted between opens, so state must be reset explicitly).
  useEffect(() => {
    if (!open) return
    const initial: Draft = {}
    for (const criterion of criteria) {
      const existing = existingScores?.find(
        (s) => s.criterionId === criterion.id && s.judgeUserId === user?.id,
      )
      initial[criterion.id] = {
        score: existing ? String(existing.scoreValue) : '',
        comment: existing?.comment ?? '',
      }
    }
    setDraft(initial)
  }, [open, criteria, existingScores, user?.id])

  function handleClose() {
    setJustSubmitted(false)
    onClose()
  }

  function updateDraft(criterionId: string, patch: Partial<{ score: string; comment: string }>) {
    setDraft((prev) => {
      const current = prev[criterionId] ?? { score: '', comment: '' }
      return { ...prev, [criterionId]: { ...current, ...patch } }
    })
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    submitScores.mutate(
      {
        submissionId,
        roundId,
        criterionScores: criteria.map((criterion) => ({
          criterionId: criterion.id,
          score: Number(draft[criterion.id]?.score || 0),
          comment: draft[criterion.id]?.comment || undefined,
        })),
      },
      {
        onSuccess: () => {
          setJustSubmitted(true)
          setTimeout(handleClose, 1200)
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
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Scores saved!</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} title={teamName ? `Score — ${teamName}` : 'Score submission'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {submitScores.isError && <Alert tone="danger">{getErrorMessage(submitScores.error)}</Alert>}

        <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto pr-1">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{criterion.name}</p>
                <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                  weight {criterion.weight} · max {criterion.maxScore}
                </span>
              </div>
              <Input
                type="number"
                min={0}
                max={criterion.maxScore}
                step="0.5"
                required
                placeholder={`0 – ${criterion.maxScore}`}
                value={draft[criterion.id]?.score ?? ''}
                onChange={(e) => updateDraft(criterion.id, { score: e.target.value })}
              />
              <Textarea
                placeholder="Comment (optional)"
                rows={2}
                value={draft[criterion.id]?.comment ?? ''}
                onChange={(e) => updateDraft(criterion.id, { comment: e.target.value })}
              />
            </div>
          ))}
        </div>

        <Button type="submit" loading={submitScores.isPending} className="w-fit">
          <Gavel className="h-4 w-4" />
          Save scores
        </Button>
      </form>
    </Modal>
  )
}
