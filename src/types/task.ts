import type { Timestamp } from 'firebase/firestore'

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  completed: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type TaskFormValues = Pick<Task, 'title' | 'description'>
