import { AuthForm } from '../components/AuthForm'

export function LoginPage() {
  return (
    <main className="app-shell">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">Gestor de tareas</p>
        <h1 id="login-title">Bienvenido</h1>
        <p className="intro">Inicia sesión para organizar tus tareas.</p>
        <AuthForm mode="login" />
      </section>
    </main>
  )
}
