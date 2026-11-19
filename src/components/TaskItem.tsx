import { useState } from 'react'
import {
  editTask,
  removeTask,
  setTaskCompleted,
} from '../features/tasks/taskService'
import { taskErrorMessage } from '../features/tasks/taskErrorMessage'
import type { Task, TaskFormValues } from '../types/task'
import { TaskForm } from './TaskForm'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runAction(action: () => Promise<void>) {
    setError(null)
    setBusy(true)
    try {
      await action()
    } catch (cause: unknown) {
      setError(taskErrorMessage(cause))
    } finally {
      setBusy(false)
    }
  }

  async function handleEdit(values: TaskFormValues) {
    await editTask(task.id, values)
    setEditing(false)
  }

  return (
    <li className="task-item">
      {editing ? (
        <TaskForm
          initialValues={{ title: task.title, description: task.description }}
          submitLabel="Guardar cambios"
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="task-main">
            <input
              className="task-checkbox"
              type="checkbox"
              aria-label={`Marcar ${task.title} como ${task.completed ? 'pendiente' : 'completada'}`}
              checked={task.completed}
              onChange={() => void runAction(() => setTaskCompleted(task.id, !task.completed))}
              disabled={busy}
            />
            <div className="task-copy">
              <h3 className={task.completed ? 'task-title completed' : 'task-title'}>{task.title}</h3>
              {task.description && <p className="task-description">{task.description}</p>}
              <span className="task-status">{task.completed ? 'Completada' : 'Pendiente'}</span>
            </div>
          </div>
          <div className="task-actions">
            {confirmingDelete ? (
              <>
                <span>¿Eliminar esta tarea?</span>
                <button
                  className="danger-button"
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction(() => removeTask(task.id))}
                >
                  {busy ? 'Eliminando…' : 'Sí, eliminar'}
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmingDelete(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button className="secondary-button" type="button" disabled={busy} onClick={() => setEditing(true)}>
                  Editar
                </button>
                <button className="secondary-button" type="button" disabled={busy} onClick={() => setConfirmingDelete(true)}>
                  Eliminar
                </button>
              </>
            )}
          </div>
        </>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </li>
  )
}
