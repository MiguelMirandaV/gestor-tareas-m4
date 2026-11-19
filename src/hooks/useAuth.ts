import { useContext } from 'react'
import { AuthContext } from '../features/auth/AuthContext'

export function useAuth() {
  const state = useContext(AuthContext)

  if (!state) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return state
}
