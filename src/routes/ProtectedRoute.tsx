import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../types'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  member: 0,
  pr: 1,
  core_team: 2,
  admin: 3,
}

export function RoleRoute({
  children,
  minRole,
}: {
  children: React.ReactNode
  minRole: UserRole
}) {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    )
  }

  if (!profile || ROLE_HIERARCHY[profile.role] < ROLE_HIERARCHY[minRole]) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
