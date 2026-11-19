import type { Task } from '../types/task'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">Todavía no tienes tareas. Crea la primera con el formulario.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => <TaskItem key={task.id} task={task} />)}
    </ul>
  )
}
