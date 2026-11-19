import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { editTask, removeTask, setTaskCompleted } from '../src/features/tasks/taskService'
import { TaskList } from '../src/components/TaskList'
import type { Task } from '../src/types/task'

vi.mock('../src/features/tasks/taskService', () => ({
  editTask: vi.fn(),
  removeTask: vi.fn(),
  setTaskCompleted: vi.fn(),
}))

const task = {
  id: 'task-1',
  title: 'Estudiar React',
  description: 'Repasar componentes',
  completed: false,
} as Task

describe('TaskList', () => {
  beforeEach(() => {
    vi.mocked(editTask).mockReset().mockResolvedValue(undefined)
    vi.mocked(removeTask).mockReset().mockResolvedValue(undefined)
    vi.mocked(setTaskCompleted).mockReset().mockResolvedValue(undefined)
  })

  it('permite marcar una tarea como completada', async () => {
    const user = userEvent.setup()
    render(<TaskList tasks={[task]} />)

    await user.click(screen.getByRole('checkbox', { name: 'Marcar Estudiar React como completada' }))

    expect(setTaskCompleted).toHaveBeenCalledWith('task-1', true)
  })

  it('edita los datos y exige confirmar antes de eliminar', async () => {
    const user = userEvent.setup()
    render(<TaskList tasks={[task]} />)

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    await user.clear(screen.getByRole('textbox', { name: 'Título' }))
    await user.type(screen.getByRole('textbox', { name: 'Título' }), 'Estudiar TypeScript')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(editTask).toHaveBeenCalledWith('task-1', {
      title: 'Estudiar TypeScript',
      description: 'Repasar componentes',
    })

    await user.click(await screen.findByRole('button', { name: 'Eliminar' }))
    expect(removeTask).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Sí, eliminar' }))
    expect(removeTask).toHaveBeenCalledWith('task-1')
  })
})
