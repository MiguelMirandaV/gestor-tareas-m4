import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function PublicOnlyRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const state: unknown = location.state
  const requestedPath =
    typeof state === 'object' && state !== null && 'from' in state &&
    typeof state.from === 'string' && state.from.startsWith('/') &&
    !state.from.startsWith('//')
      ? state.from
      : '/tasks'

  if (loading) {
    return <main className="app-shell"><p role="status">Comprobando tu sesión…</p></main>
  }

  return user ? <Navigate to={requestedPath} replace /> : <Outlet />
}
