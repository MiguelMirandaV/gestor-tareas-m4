import { AuthForm } from '../components/AuthForm'

interface LoginPageProps {
  onRegister: () => void
}

export function LoginPage({ onRegister }: LoginPageProps) {
  return (
    <main className="app-shell">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">Gestor de tareas</p>
        <h1 id="login-title">Bienvenido</h1>
        <p className="intro">Inicia sesión para organizar tus tareas.</p>
        <AuthForm mode="login" onSwitch={onRegister} />
      </section>
    </main>
  )
}
