import { useState, type FormEvent } from 'react'
import { ListChecks, Plus } from 'lucide-react'
import { useDefaultCriteriaTemplates } from '../hooks/useDefaultCriteriaTemplates'
import { useCreateDefaultTemplate } from '../hooks/useCreateDefaultTemplate'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageHeader,
  Skeleton,
  Textarea,
} from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function CriteriaTemplatesPage() {
  const { data: templates, isLoading, error } = useDefaultCriteriaTemplates()
  const createTemplate = useCreateDefaultTemplate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('1')
  const [maxScore, setMaxScore] = useState('100')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createTemplate.mutate(
      { name, description, weight: Number(weight), maxScore: Number(maxScore) },
      {
        onSuccess: () => {
          setName('')
          setDescription('')
          setWeight('1')
          setMaxScore('100')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Criteria Templates"
        description="Reusable default criteria — apply the same set manually when adding an event's criteria instead of retyping them each time."
      />

      {error && <Alert tone="danger">{getErrorMessage(error)}</Alert>}

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && templates && templates.length === 0 && (
        <EmptyState icon={ListChecks} message="No default criteria templates yet." />
      )}

      {templates && templates.length > 0 && (
        <div className="flex flex-col gap-2">
          {templates.map((template) => (
            <Card key={template.id} className="flex items-center gap-3 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                <ListChecks className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">{template.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{template.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Badge tone="info">
                  Weight <span className="tabular-nums">{template.weight}</span>
                </Badge>
                <Badge tone="neutral">
                  Max <span className="tabular-nums">{template.maxScore}</span>
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Plus className="h-4 w-4" /> Add template
          </h3>
          {createTemplate.isError && <Alert tone="danger">{getErrorMessage(createTemplate.error)}</Alert>}
          <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            label="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Weight"
              type="number"
              step="0.1"
              min="0"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Input
              label="Max score"
              type="number"
              min="1"
              required
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
            />
          </div>
          <Button type="submit" loading={createTemplate.isPending} className="w-fit">
            Add template
          </Button>
        </form>
      </Card>
    </div>
  )
}
