import { useState } from 'react'
import type { FormEvent } from 'react'
import { authErrorMessage } from '../features/auth/authErrorMessage'
import { loginWithEmail, registerWithEmail } from '../features/auth/authService'

export type AuthMode = 'login' | 'register'

interface AuthFormProps {
  mode: AuthMode
  onSwitch: () => void
}

export function AuthForm({ mode, onSwitch }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const registering = mode === 'register'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const normalizedEmail = email.trim()
    if (!normalizedEmail || !password) {
      setError('Completa el correo y la contraseña.')
      return
    }
    if (registering && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (registering && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setSubmitting(true)
    try {
      if (registering) {
        await registerWithEmail(normalizedEmail, password)
      } else {
        await loginWithEmail(normalizedEmail, password)
      }
    } catch (cause: unknown) {
      setError(authErrorMessage(cause))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError(null)
          }}
          required
          disabled={submitting}
        />
      </div>

      <div className="field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={registering ? 'new-password' : 'current-password'}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError(null)
          }}
          required
          disabled={submitting}
        />
      </div>

      {registering && (
        <div className="field">
          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setError(null)
            }}
            required
            disabled={submitting}
          />
        </div>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Espera un momento…' : registering ? 'Crear cuenta' : 'Iniciar sesión'}
      </button>
      <button className="text-button" type="button" onClick={onSwitch} disabled={submitting}>
        {registering ? 'Ya tengo cuenta' : 'Crear una cuenta'}
      </button>
    </form>
  )
}
