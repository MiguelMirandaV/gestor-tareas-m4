import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <main className="app-shell"><p role="status">Comprobando tu sesión…</p></main>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
