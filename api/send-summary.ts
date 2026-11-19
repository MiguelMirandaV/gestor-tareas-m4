import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '../server/firebaseAdmin'
import { buildTaskSummary, isSummaryTask } from '../server/taskSummary'
import type { SummaryTask } from '../server/taskSummary'

function jsonResponse(message: string, status: number): Response {
  return Response.json({ message }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function emailConfig() {
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const source = process.env.SES_FROM_EMAIL

  if (!region || !accessKeyId || !secretAccessKey || !source) {
    throw new Error('Falta configurar AWS SES.')
  }

  return { region, accessKeyId, secretAccessKey, source }
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return Response.json({ message: 'Método no permitido.' }, {
        status: 405,
        headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
      })
    }

    const authorization = request.headers.get('Authorization')
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
    if (!token || token.length > 4096) {
      return jsonResponse('Inicia sesión para enviar el resumen.', 401)
    }

    let app
    try {
      app = getFirebaseAdminApp()
    } catch (cause) {
      console.error('Configuración de Firebase Admin incompleta:', cause)
      return jsonResponse('El servicio de email aún no está configurado.', 503)
    }

    let uid: string
    let email: string
    try {
      const decoded = await getAuth(app).verifyIdToken(token, true)
      const account = await getAuth(app).getUser(decoded.uid)
      if (!account.email) return jsonResponse('Tu cuenta no tiene un correo válido.', 422)
      uid = account.uid
      email = account.email
    } catch {
      return jsonResponse('Tu sesión no es válida. Inicia sesión de nuevo.', 401)
    }

    let config
    try {
      config = emailConfig()
    } catch (cause) {
      console.error('Configuración de AWS SES incompleta:', cause)
      return jsonResponse('El servicio de email aún no está configurado.', 503)
    }

    let tasks: SummaryTask[]
    try {
      const snapshot = await getFirestore(app).collection('tasks').where('userId', '==', uid).get()
      tasks = snapshot.docs.map((item) => item.data() as unknown).filter(isSummaryTask)
      if (tasks.length !== snapshot.size) {
        return jsonResponse('Hay una tarea con datos incompletos.', 500)
      }
    } catch (cause) {
      console.error('No se pudo consultar Firestore:', cause)
      return jsonResponse('No se pudo consultar tus tareas.', 500)
    }

    try {
      const ses = new SESClient({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      })
      await ses.send(new SendEmailCommand({
        Source: config.source,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Charset: 'UTF-8', Data: 'Resumen de tus tareas' },
          Body: { Text: { Charset: 'UTF-8', Data: buildTaskSummary(tasks) } },
        },
      }))
      return jsonResponse('Resumen enviado a tu correo.', 200)
    } catch (cause) {
      console.error('No se pudo enviar el resumen con SES:', cause)
      return jsonResponse('No se pudo enviar el email. Inténtalo más tarde.', 502)
    }
  },
}
