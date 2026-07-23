import { useState, type FormEvent } from 'react'
import { Mail, ShieldPlus, User } from 'lucide-react'
import { useCreateGuestJudge } from '../hooks/useCreateGuestJudge'
import { Alert, Button, Card, CopyIdButton, Input, PageHeader } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function GuestJudgePage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const mutation = useCreateGuestJudge()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate(
      { fullName, email },
      {
        onSuccess: () => {
          setFullName('')
          setEmail('')
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Guest Judges" description="Create temporary judge accounts for an event." />

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
              <ShieldPlus className="h-4.5 w-4.5" />
            </span>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Create guest judge</h2>
          </div>

          {mutation.isError && <Alert tone="danger">{getErrorMessage(mutation.error)}</Alert>}
          {mutation.isSuccess && (
            <Alert tone="success">
              <div className="flex flex-col gap-2">
                <p>
                  Guest judge account created for{' '}
                  <span className="font-medium">{mutation.data.fullName}</span>. They can't log in
                  yet — assign scoring access manually.
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{mutation.data.id}</span>
                  <CopyIdButton value={mutation.data.id} />
                </div>
              </div>
            </Alert>
          )}

          <Input
            label="Full name"
            icon={<User className="h-4 w-4" />}
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" loading={mutation.isPending} className="w-fit">
            <ShieldPlus className="h-4 w-4" />
            Create guest judge
          </Button>
        </form>
      </Card>
    </div>
  )
}
