import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

interface RoleRouteProps {
  allowedRoles: string[]
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user } = useAuth()

  const hasAccess = user?.roles.some((role) => allowedRoles.includes(role)) ?? false

  if (!hasAccess) return <Navigate to="/403" replace />

  return <Outlet />
}
