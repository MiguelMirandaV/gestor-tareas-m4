import { getApp, getApps, initializeApp } from 'firebase/app'

function requiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Falta ${name}. Configura el archivo .env local.`)
  }

  return value
}

const firebaseConfig = {
  apiKey: requiredEnv('VITE_FIREBASE_API_KEY', import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: requiredEnv(
    'VITE_FIREBASE_AUTH_DOMAIN',
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  ),
  projectId: requiredEnv('VITE_FIREBASE_PROJECT_ID', import.meta.env.VITE_FIREBASE_PROJECT_ID),
  appId: requiredEnv('VITE_FIREBASE_APP_ID', import.meta.env.VITE_FIREBASE_APP_ID),
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
