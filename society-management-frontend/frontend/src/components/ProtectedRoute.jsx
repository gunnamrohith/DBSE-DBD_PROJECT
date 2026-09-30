import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from '../services/auth'
import { canAccessPath, firstAllowedPath } from '../config/permissions'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  if (!canAccessPath(user, location.pathname)) return <Navigate to={firstAllowedPath(user)} replace />
  return children
}
