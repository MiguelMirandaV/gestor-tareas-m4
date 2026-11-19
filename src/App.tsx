import { useState } from 'react'
import { authErrorMessage } from './features/auth/authErrorMessage'
import { logout } from './features/auth/authService'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import './App.css'

function App() {
  const { user, loading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {
    setLogoutError(null)
    try {
      await logout()
    } catch (cause: unknown) {
      setLogoutError(authErrorMessage(cause))
    }
  }

  if (loading) {
    return <main className="app-shell"><p role="status">Comprobando tu sesión…</p></main>
  }

  if (!user) {
    return showRegister
      ? <RegisterPage onLogin={() => setShowRegister(false)} />
      : <LoginPage onRegister={() => setShowRegister(true)} />
  }

  return (
    <main className="app-shell">
      <section className="auth-card" aria-labelledby="welcome-title">
        <p className="eyebrow">Sesión activa</p>
        <h1 id="welcome-title">Hola, {user.email}</h1>
        <p className="intro">Ya puedes acceder con tu cuenta. La gestión de tareas viene después.</p>
        {logoutError && <p className="form-error" role="alert">{logoutError}</p>}
        <button className="primary-button" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}

export default App
