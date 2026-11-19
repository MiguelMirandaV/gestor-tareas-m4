import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { firebaseAuth } from '../../services/firebaseAuth'
import { AuthContext } from './AuthContext'
import type { AuthState } from './AuthContext'

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      setState({ user, loading: false })
    })
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
