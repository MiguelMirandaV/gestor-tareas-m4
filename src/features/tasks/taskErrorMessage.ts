import { FirebaseError } from 'firebase/app'

export function taskErrorMessage(cause: unknown): string {
  if (cause instanceof FirebaseError) {
    switch (cause.code) {
      case 'permission-denied':
        return 'No tienes permiso para realizar esta operación. Revisa tu sesión y las reglas de Firestore.'
      case 'unavailable':
      case 'deadline-exceeded':
        return 'No pudimos conectar con Firestore. Revisa tu conexión e inténtalo de nuevo.'
      case 'unauthenticated':
        return 'Tu sesión terminó. Inicia sesión de nuevo.'
      default:
        return 'No se pudo guardar el cambio. Inténtalo de nuevo.'
    }
  }

  return cause instanceof Error ? cause.message : 'Ocurrió un error inesperado.'
}
