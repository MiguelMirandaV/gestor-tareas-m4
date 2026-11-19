import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { taskErrorMessage } from '../features/tasks/taskErrorMessage'
import type { TaskFormValues } from '../types/task'

interface TaskFormProps {
  initialValues?: TaskFormValues
  submitLabel: string
  onSubmit: (values: TaskFormValues) => Promise<void>
  onCancel?: () => void
  resetOnSuccess?: boolean
}

export function TaskForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
}: TaskFormProps) {
  const formId = useId()
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Escribe un título para la tarea.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ title, description })
      if (resetOnSuccess) {
        setTitle('')
        setDescription('')
      }
    } catch (cause: unknown) {
      setError(taskErrorMessage(cause))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor={`${formId}-title`}>Título</label>
        <input
          id={`${formId}-title`}
          name="title"
          type="text"
          maxLength={120}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            setError(null)
          }}
          required
          disabled={submitting}
        />
      </div>
      <div className="field">
        <label htmlFor={`${formId}-description`}>Descripción</label>
        <textarea
          id={`${formId}-description`}
          name="description"
          rows={3}
          maxLength={1000}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value)
            setError(null)
          }}
          disabled={submitting}
        />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={submitting || !title.trim()}>
          {submitting ? 'Guardando…' : submitLabel}
        </button>
        {onCancel && (
          <button className="secondary-button" type="button" onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
