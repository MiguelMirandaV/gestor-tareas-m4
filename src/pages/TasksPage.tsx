import { useState } from 'react'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { authErrorMessage } from '../features/auth/authErrorMessage'
import { logout } from '../features/auth/authService'
import { createTask } from '../features/tasks/taskService'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import type { TaskFormValues } from '../types/task'

export function TasksPage() {
  const { user } = useAuth()
  const { tasks, loading, error, retry } = useTasks(user?.uid)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleCreate(values: TaskFormValues) {
    if (!user) {
      throw new Error('Inicia sesión de nuevo para crear tareas.')
    }
    await createTask(user.uid, values)
  }

  async function handleLogout() {
    setLogoutError(null)
    try {
      await logout()
    } catch (cause: unknown) {
      setLogoutError(authErrorMessage(cause))
    }
  }

  return (
    <main className="tasks-shell">
      <header className="tasks-header">
        <div>
          <p className="eyebrow">Gestor de tareas</p>
          <h1 id="tasks-title">Tus tareas</h1>
          <p className="intro">Organiza tu día desde cualquier dispositivo.</p>
          <p className="account-label">Sesión: {user?.email}</p>
        </div>
        <div>
          <button className="secondary-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
          {logoutError && <p className="form-error" role="alert">{logoutError}</p>}
        </div>
      </header>

      <section className="task-panel" aria-labelledby="new-task-title">
        <h2 id="new-task-title">Nueva tarea</h2>
        <TaskForm submitLabel="Crear tarea" onSubmit={handleCreate} resetOnSuccess />
      </section>

      <section className="task-panel" aria-labelledby="task-list-title">
        <div className="list-heading">
          <h2 id="task-list-title">Mi lista</h2>
          {!loading && !error && <span>{tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}</span>}
        </div>
        {loading && <p role="status">Cargando tareas…</p>}
        {error && (
          <div className="load-error">
            <p className="form-error" role="alert">{error}</p>
            <button className="secondary-button" type="button" onClick={retry}>Reintentar</button>
          </div>
        )}
        {!loading && !error && <TaskList tasks={tasks} />}
      </section>
    </main>
  )
}
