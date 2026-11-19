import { useState } from 'react'
import { authErrorMessage } from '../features/auth/authErrorMessage'
import { logout } from '../features/auth/authService'
import { useAuth } from '../hooks/useAuth'

export function TasksPage() {
  const { user } = useAuth()
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {
    setLogoutError(null)
    try {
      await logout()
    } catch (cause: unknown) {
      setLogoutError(authErrorMessage(cause))
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-card" aria-labelledby="tasks-title">
        <p className="eyebrow">Ruta privada</p>
        <h1 id="tasks-title">Hola, {user?.email}</h1>
        <p className="intro">Tu sesión está protegida. Pronto podrás gestionar tus tareas aquí.</p>
        {logoutError && <p className="form-error" role="alert">{logoutError}</p>}
        <button className="primary-button" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}
