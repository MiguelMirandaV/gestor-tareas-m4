export interface SummaryTask {
  title: string
  description: string
  completed: boolean
}

export function isSummaryTask(value: unknown): value is SummaryTask {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return typeof task.title === 'string'
    && typeof task.description === 'string'
    && typeof task.completed === 'boolean'
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

export function buildTaskSummary(tasks: SummaryTask[]): string {
  const pending = tasks.filter((task) => !task.completed)
  const completed = tasks.filter((task) => task.completed)

  function section(title: string, entries: SummaryTask[]): string {
    if (entries.length === 0) return `${title}: ninguna`
    const lines = entries.map((task, index) => {
      const description = oneLine(task.description)
      return `${index + 1}. ${oneLine(task.title)}${description ? ` — ${description}` : ''}`
    })
    return `${title} (${entries.length}):\n${lines.join('\n')}`
  }

  return [
    'Resumen de tus tareas',
    `Total: ${tasks.length}`,
    section('Pendientes', pending),
    section('Completadas', completed),
  ].join('\n\n')
}
