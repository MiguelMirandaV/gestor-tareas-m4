import { AuthForm } from '../components/AuthForm'

export function RegisterPage() {
  return (
    <main className="app-shell">
      <section className="auth-card" aria-labelledby="register-title">
        <p className="eyebrow">Gestor de tareas</p>
        <h1 id="register-title">Crea tu cuenta</h1>
        <p className="intro">Tus tareas estarán asociadas a tu usuario.</p>
        <AuthForm mode="register" />
      </section>
    </main>
  )
}
