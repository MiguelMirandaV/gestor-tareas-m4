import type { User } from 'firebase/auth'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestTaskSummary } from '../src/features/tasks/summaryService'

const user = { getIdToken: vi.fn().mockResolvedValue('test-token') } as unknown as User

describe('requestTaskSummary', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('envía el token de sesión a la función y devuelve su confirmación', async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Resumen enviado a tu correo.' }),
    })
    vi.stubGlobal('fetch', fetch)

    await expect(requestTaskSummary(user)).resolves.toBe('Resumen enviado a tu correo.')
    expect(fetch).toHaveBeenCalledWith('/api/send-summary', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-token' },
    })
  })

  it('muestra el error devuelto por la función serverless', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'No se pudo enviar el email.' }),
    }))

    await expect(requestTaskSummary(user)).rejects.toThrow('No se pudo enviar el email.')
  })
})
