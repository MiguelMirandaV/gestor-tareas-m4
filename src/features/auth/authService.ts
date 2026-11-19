import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { firebaseAuth } from '../../services/firebaseAuth'

export async function registerWithEmail(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(firebaseAuth, email, password)
}

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(firebaseAuth, email, password)
}

export async function logout(): Promise<void> {
  await signOut(firebaseAuth)
}
