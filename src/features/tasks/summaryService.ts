import type { User } from 'firebase/auth'

interface SummaryResponse {
  message?: string
}

export async function requestTaskSummary(user: User): Promise<string> {
  const token = await user.getIdToken()
  let response: Response

  try {
    response = await fetch('/api/send-summary', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error('No pudimos conectar con el servicio de email.')
  }

  const data: unknown = await response.json().catch(() => null)
  const payload: SummaryResponse = typeof data === 'object' && data !== null ? data : {}
  if (!response.ok) {
    throw new Error(payload.message ?? 'No se pudo enviar el resumen.')
  }

  return payload.message ?? 'Resumen enviado a tu correo.'
}
