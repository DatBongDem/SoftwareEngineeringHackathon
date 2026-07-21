import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { LogIn, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Alert, Button, Card, Input, PasswordInput } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const mutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: () => navigate(from, { replace: true }),
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <Card className="sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Log in to manage your event, team, or scoring.
          </p>
        </div>

        {mutation.isError && <Alert tone="danger">{getErrorMessage(mutation.error)}</Alert>}

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="you@fpt.edu.vn"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" loading={mutation.isPending} className="w-full">
          <LogIn className="h-4 w-4" />
          Log in
        </Button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="rounded-sm font-medium text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          >
            Register
          </Link>
        </p>
      </form>
    </Card>
  )
}
