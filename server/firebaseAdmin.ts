import { cert, getApps, initializeApp } from 'firebase-admin/app'
import type { App } from 'firebase-admin/app'

interface ServiceAccountValues {
  project_id: string
  client_email: string
  private_key: string
}

function isServiceAccount(value: unknown): value is ServiceAccountValues {
  if (typeof value !== 'object' || value === null) return false
  const account = value as Record<string, unknown>
  return typeof account.project_id === 'string'
    && typeof account.client_email === 'string'
    && typeof account.private_key === 'string'
}

export function getFirebaseAdminApp(): App {
  const existingApp = getApps()[0]
  if (existingApp) return existingApp

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!json) throw new Error('Falta configurar Firebase Admin.')

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('El JSON de Firebase Admin no es válido.')
  }

  if (!isServiceAccount(parsed)) {
    throw new Error('Faltan campos en la cuenta de servicio de Firebase.')
  }

  return initializeApp({
    credential: cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    }),
  })
}
