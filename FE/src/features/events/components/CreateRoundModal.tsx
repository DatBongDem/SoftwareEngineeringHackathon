import { useState, type FormEvent } from 'react'
import { Check, Plus } from 'lucide-react'
import { useCreateRound } from '../hooks/useCreateRound'
import { useEventCriteria } from '@/features/criteria/hooks/useEventCriteria'
import { Alert, Button, Input, Modal } from '@/shared/components'
import { cn } from '@/shared/lib/cn'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function CreateRoundModal({
  eventId,
  open,
  onClose,
}: {
  eventId: string
  open: boolean
  onClose: () => void
}) {
  const { data: criteria } = useEventCriteria(eventId)
  const createRound = useCreateRound(eventId)

  const [roundNumber, setRoundNumber] = useState('1')
  const [name, setName] = useState('')
  const [submissionDeadline, setSubmissionDeadline] = useState('')
  const [promotionRuleTopN, setPromotionRuleTopN] = useState('5')
  const [criteriaIds, setCriteriaIds] = useState<string[]>([])

  function toggleCriterion(id: string) {
    setCriteriaIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createRound.mutate(
      {
        roundNumber: Number(roundNumber),
        name,
        submissionDeadline: new Date(submissionDeadline).toISOString(),
        promotionRuleTopN: Number(promotionRuleTopN),
        criteriaIds,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Create round">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {createRound.isError && <Alert tone="danger">{getErrorMessage(createRound.error)}</Alert>}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Round number"
            type="number"
            min="1"
            required
            value={roundNumber}
            onChange={(e) => setRoundNumber(e.target.value)}
          />
          <Input
            label="Promotion top N"
            type="number"
            min="1"
            required
            value={promotionRuleTopN}
            onChange={(e) => setPromotionRuleTopN(e.target.value)}
          />
        </div>
        <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Submission deadline"
          type="datetime-local"
          required
          value={submissionDeadline}
          onChange={(e) => setSubmissionDeadline(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Criteria</span>
          {!criteria?.length && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No criteria on this event yet — add some in the Criteria tab first.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {criteria?.map((criterion) => {
              const selected = criteriaIds.includes(criterion.id)
              return (
                <button
                  key={criterion.id}
                  type="button"
                  onClick={() => toggleCriterion(criterion.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    selected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-300'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                  {criterion.name}
                </button>
              )
            })}
          </div>
        </div>

        <Button type="submit" loading={createRound.isPending} className="w-fit">
          <Plus className="h-4 w-4" />
          Create round
        </Button>
      </form>
    </Modal>
  )
}
