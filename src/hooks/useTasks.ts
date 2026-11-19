import { useEffect, useState } from 'react'
import { taskErrorMessage } from '../features/tasks/taskErrorMessage'
import { subscribeToTasks } from '../features/tasks/taskService'
import type { Task } from '../types/task'

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!userId) {
      return
    }

    return subscribeToTasks(
      userId,
      (nextTasks) => {
        setTasks(nextTasks)
        setLoading(false)
        setError(null)
      },
      (cause) => {
        setLoading(false)
        setError(taskErrorMessage(cause))
      },
    )
  }, [userId, retryCount])

  function retry() {
    setLoading(true)
    setError(null)
    setRetryCount((count) => count + 1)
  }

  return { tasks, loading, error, retry }
}
