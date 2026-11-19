import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskForm } from '../src/components/TaskForm'

describe('TaskForm', () => {
  it('rechaza un título que solo contiene espacios', () => {
    const onSubmit = vi.fn()
    const { container } = render(<TaskForm submitLabel="Crear tarea" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Título' }), { target: { value: '   ' } })
    fireEvent.submit(container.querySelector('form')!)

    expect(screen.getByRole('alert')).toHaveTextContent('Escribe un título')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envía los datos y limpia el formulario después de guardar', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm submitLabel="Crear tarea" onSubmit={onSubmit} resetOnSuccess />)

    await user.type(screen.getByRole('textbox', { name: 'Título' }), 'Estudiar React')
    await user.type(screen.getByRole('textbox', { name: 'Descripción' }), 'Repasar hooks')
    await user.click(screen.getByRole('button', { name: 'Crear tarea' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
      title: 'Estudiar React',
      description: 'Repasar hooks',
    }))
    expect(screen.getByRole('textbox', { name: 'Título' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'Descripción' })).toHaveValue('')
  })

  it('muestra un error y conserva los datos si falla el guardado', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('No se pudo guardar.'))
    render(<TaskForm submitLabel="Crear tarea" onSubmit={onSubmit} />)

    await user.type(screen.getByRole('textbox', { name: 'Título' }), 'Estudiar')
    await user.click(screen.getByRole('button', { name: 'Crear tarea' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar.')
    expect(screen.getByRole('textbox', { name: 'Título' })).toHaveValue('Estudiar')
  })
})
