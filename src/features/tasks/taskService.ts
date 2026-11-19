import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { firestoreDb } from '../../services/firestoreDb'
import type { Task, TaskFormValues } from '../../types/task'

const tasksCollection = collection(firestoreDb, 'tasks')

export function subscribeToTasks(
  userId: string,
  onTasks: (tasks: Task[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const ownTasks = query(tasksCollection, where('userId', '==', userId))

  return onSnapshot(
    ownTasks,
    (snapshot) => {
      const tasks = snapshot.docs.map((item) => ({
        ...item.data({ serverTimestamps: 'estimate' }),
        id: item.id,
      })) as Task[]

      // Sorting here avoids a composite Firestore index for this small project.
      tasks.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      onTasks(tasks)
    },
    onError,
  )
}

function normalizedValues(values: TaskFormValues): TaskFormValues {
  const title = values.title.trim()
  const description = values.description.trim()

  if (!title || title.length > 120 || description.length > 1000) {
    throw new Error('Escribe un título de hasta 120 caracteres y una descripción de hasta 1000.')
  }

  return { title, description }
}

export async function createTask(userId: string, values: TaskFormValues): Promise<void> {
  await addDoc(tasksCollection, {
    ...normalizedValues(values),
    userId,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function editTask(taskId: string, values: TaskFormValues): Promise<void> {
  await updateDoc(doc(tasksCollection, taskId), {
    ...normalizedValues(values),
    updatedAt: serverTimestamp(),
  })
}

export async function setTaskCompleted(taskId: string, completed: boolean): Promise<void> {
  await updateDoc(doc(tasksCollection, taskId), {
    completed,
    updatedAt: serverTimestamp(),
  })
}

export async function removeTask(taskId: string): Promise<void> {
  await deleteDoc(doc(tasksCollection, taskId))
}
