import { FirebaseError } from 'firebase/app'

const messages: Record<string, string> = {
  'auth/email-already-in-use': 'Ya existe una cuenta con este correo.',
  'auth/invalid-email': 'Ingresa un correo electrónico válido.',
  'auth/weak-password': 'La contraseña no cumple los requisitos de seguridad.',
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  'auth/network-request-failed': 'No pudimos conectar con Firebase. Revisa tu conexión.',
  'auth/operation-not-allowed': 'Este método de acceso no está habilitado.',
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return messages[error.code] ?? 'No pudimos completar la solicitud. Inténtalo de nuevo.'
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}
