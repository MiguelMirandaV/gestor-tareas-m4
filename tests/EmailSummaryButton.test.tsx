import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailSummaryButton } from '../src/components/EmailSummaryButton'
import { requestTaskSummary } from '../src/features/tasks/summaryService'

vi.mock('../src/features/tasks/summaryService', () => ({
  requestTaskSummary: vi.fn(),
}))

const user = { uid: 'test-user' } as User
const sendSummary = vi.mocked(requestTaskSummary)

describe('EmailSummaryButton', () => {
  beforeEach(() => {
    sendSummary.mockReset()
  })

  it('deshabilita el botón durante el envío y muestra el éxito', async () => {
    const actor = userEvent.setup()
    let completeSend!: (message: string) => void
    sendSummary.mockImplementation(() => new Promise((resolve) => {
      completeSend = resolve
    }))
    render(<EmailSummaryButton user={user} />)

    await actor.click(screen.getByRole('button', { name: 'Enviar resumen por email' }))
    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled()
    expect(sendSummary).toHaveBeenCalledWith(user)

    completeSend('Resumen enviado a tu correo.')
    expect(await screen.findByRole('status')).toHaveTextContent('Resumen enviado a tu correo.')
    expect(screen.getByRole('button', { name: 'Enviar resumen por email' })).toBeEnabled()
  })

  it('muestra el error de envío y permite reintentar', async () => {
    const actor = userEvent.setup()
    sendSummary.mockRejectedValue(new Error('No se pudo enviar el email.'))
    render(<EmailSummaryButton user={user} />)

    await actor.click(screen.getByRole('button', { name: 'Enviar resumen por email' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo enviar el email.')
    expect(screen.getByRole('button', { name: 'Enviar resumen por email' })).toBeEnabled()
  })
})
