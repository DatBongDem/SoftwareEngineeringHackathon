import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Spinner } from '@/shared/components'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Spinner label="Checking session..." />

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  if (!user.isApproved && location.pathname !== '/pending-approval') {
    return <Navigate to="/pending-approval" replace />
  }

  if (user.isApproved && location.pathname === '/pending-approval') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
