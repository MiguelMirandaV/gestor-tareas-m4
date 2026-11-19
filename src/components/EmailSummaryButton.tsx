import { useState } from 'react'
import type { User } from 'firebase/auth'
import { requestTaskSummary } from '../features/tasks/summaryService'

interface EmailSummaryButtonProps {
  user: User
}

export function EmailSummaryButton({ user }: EmailSummaryButtonProps) {
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    setSuccess(null)
    setError(null)
    setSending(true)
    try {
      setSuccess(await requestTaskSummary(user))
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'No se pudo enviar el resumen.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="email-summary">
      <p>Recibe por correo un resumen de tus tareas pendientes y completadas.</p>
      <button className="primary-button" type="button" onClick={() => void handleSend()} disabled={sending}>
        {sending ? 'Enviando…' : 'Enviar resumen por email'}
      </button>
      {success && <p className="form-success" role="status">{success}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  )
}
