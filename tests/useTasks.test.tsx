import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { subscribeToTasks } from '../src/features/tasks/taskService'
import { useTasks } from '../src/hooks/useTasks'
import type { Task } from '../src/types/task'

vi.mock('../src/features/tasks/taskService', () => ({
  subscribeToTasks: vi.fn(),
}))

const subscribe = vi.mocked(subscribeToTasks)

describe('useTasks', () => {
  beforeEach(() => {
    subscribe.mockReset()
  })

  it('muestra las tareas recibidas y cancela la suscripción al desmontarse', () => {
    const unsubscribe = vi.fn()
    subscribe.mockReturnValue(unsubscribe)
    const { result, unmount } = renderHook(() => useTasks('user-1'))

    expect(result.current.loading).toBe(true)
    expect(subscribe).toHaveBeenCalledWith('user-1', expect.any(Function), expect.any(Function))

    const task = { id: 'task-1', title: 'Estudiar' } as Task
    const onTasks = subscribe.mock.calls[0][1]
    act(() => onTasks([task]))

    expect(result.current.loading).toBe(false)
    expect(result.current.tasks).toEqual([task])
    unmount()
    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('muestra el error de Firestore y vuelve a suscribirse al reintentar', () => {
    const firstUnsubscribe = vi.fn()
    subscribe.mockReturnValueOnce(firstUnsubscribe).mockReturnValueOnce(vi.fn())
    const { result } = renderHook(() => useTasks('user-1'))

    const onError = subscribe.mock.calls[0][2]
    act(() => onError(new Error('Conexión perdida')))
    expect(result.current.error).toBe('Conexión perdida')
    expect(result.current.loading).toBe(false)

    act(() => result.current.retry())
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(firstUnsubscribe).toHaveBeenCalledOnce()
    expect(subscribe).toHaveBeenCalledTimes(2)
  })
})
