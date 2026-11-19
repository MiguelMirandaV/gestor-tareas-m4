import { describe, expect, it } from 'vitest'
import { buildTaskSummary, isSummaryTask } from '../server/taskSummary'

describe('resumen de tareas', () => {
  it('explica que no hay tareas cuando la lista está vacía', () => {
    expect(buildTaskSummary([])).toContain('Total: 0')
    expect(buildTaskSummary([])).toContain('Pendientes: ninguna')
    expect(buildTaskSummary([])).toContain('Completadas: ninguna')
  })

  it('separa pendientes y completadas y normaliza los saltos de línea', () => {
    const summary = buildTaskSummary([
      { title: '  Comprar\n pan ', description: 'Integral\n y fresco', completed: false },
      { title: 'Estudiar', description: '', completed: true },
    ])

    expect(summary).toContain('Pendientes (1):\n1. Comprar pan — Integral y fresco')
    expect(summary).toContain('Completadas (1):\n1. Estudiar')
    expect(summary).toContain('Total: 2')
  })

  it('rechaza tareas incompletas antes de redactar el email', () => {
    expect(isSummaryTask({ title: 'Sin estado', description: '' })).toBe(false)
  })
})
