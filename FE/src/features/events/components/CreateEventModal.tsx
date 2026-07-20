import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useCreateEvent } from '../hooks/useCreateEvent'
import { Alert, Button, Input, Modal, Select } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

const termOptions = [
  { value: 'Spring', label: 'Spring' },
  { value: 'Summer', label: 'Summer' },
  { value: 'Fall', label: 'Fall' },
]

export function CreateEventModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createEvent = useCreateEvent()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [academicYear, setAcademicYear] = useState(String(new Date().getFullYear()))
  const [term, setTerm] = useState('Spring')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createEvent.mutate(
      {
        title,
        description,
        academicYear,
        term,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Create event">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {createEvent.isError && <Alert tone="danger">{getErrorMessage(createEvent.error)}</Alert>}

        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input
          label="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Academic year"
            required
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          />
          <Select label="Term" required options={termOptions} value={term} onChange={(e) => setTerm(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start date"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End date"
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Button type="submit" loading={createEvent.isPending} className="w-fit">
          <Plus className="h-4 w-4" />
          Create event
        </Button>
      </form>
    </Modal>
  )
}
