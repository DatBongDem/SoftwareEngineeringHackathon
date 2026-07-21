import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, User, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Alert, Button, Card, Input, PasswordInput, Select } from '@/shared/components'
import { cn } from '@/shared/lib/cn'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { UserType } from '@/shared/types/enums'

const userTypeOptions = [
  { value: String(UserType.FPTStudent), label: 'FPT Student' },
  { value: String(UserType.ExternalStudent), label: 'External Student' },
  { value: String(UserType.Lecturer), label: 'Lecturer (Mentor / Judge)' },
]

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState(String(UserType.FPTStudent))
  const [studentId, setStudentId] = useState('')
  const [universityName, setUniversityName] = useState('')

  const parsedUserType = Number(userType) as UserType
  const isExternal = parsedUserType === UserType.ExternalStudent
  const isLecturer = parsedUserType === UserType.Lecturer

  const mutation = useMutation({
    mutationFn: () =>
      register({
        fullName,
        email,
        password,
        userType: parsedUserType,
        studentId: isLecturer ? undefined : studentId,
        universityName: isExternal ? universityName : undefined,
      }),
    onSuccess: () => navigate('/', { replace: true }),
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
            Create your account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Join a hackathon event as a student or lecturer.
          </p>
        </div>

        {mutation.isError && <Alert tone="danger">{getErrorMessage(mutation.error)}</Alert>}

        <div className="flex flex-col gap-4">
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
            placeholder="you@fpt.edu.vn"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="At least 6 characters"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select
            label="I am a"
            required
            options={userTypeOptions}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          />

          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-300 ease-out',
              isLecturer ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
            )}
          >
            <div className="overflow-hidden">
              <div className={cn('grid gap-4 pt-0.5', isExternal ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}>
                <Input
                  label="Student ID"
                  required={!isLecturer}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                {isExternal && (
                  <Input
                    label="University name"
                    required
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" loading={mutation.isPending} className="w-full">
          <UserPlus className="h-4 w-4" />
          Register
        </Button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="rounded-sm font-medium text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          >
            Log in
          </Link>
        </p>
      </form>
    </Card>
  )
}
