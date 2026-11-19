# Gestor de tareas — Proyecto Integrador M4

Desarrollé una aplicación SPA para organizar tareas personales desde cualquier dispositivo. Cada persona puede registrarse, iniciar sesión y gestionar sus tareas; los cambios se guardan en Firestore y se reflejan en pantalla en tiempo real. También puede solicitar por correo un resumen de sus tareas pendientes y completadas.

**Aplicación:** https://gestor-tareas-m4-olive.vercel.app  
**Repositorio:** https://github.com/MiguelMirandaV/gestor-tareas-m4

## Funcionalidades

- Registro e inicio de sesión con correo y contraseña; cierre de sesión y persistencia de la sesión.
- Rutas privadas para impedir el acceso a las tareas sin autenticación.
- Creación, consulta, edición, eliminación y marcado de tareas como completadas.
- Tareas asociadas al usuario autenticado y sincronizadas con `onSnapshot`.
- Resumen por correo enviado desde una función de Vercel mediante AWS SES.
- Interfaz adaptable a pantallas pequeñas y mensajes de carga, éxito y error.

## Tecnologías y organización

Usé React con TypeScript y Vite para el frontend, React Router para la navegación, Firebase Authentication para la identidad y Cloud Firestore para la persistencia. La función `api/send-summary.ts` usa Firebase Admin para verificar la sesión y consultar las tareas del usuario, y AWS SES para enviar el correo. Desplegué la aplicación en Vercel y probé la lógica y los componentes con Vitest y React Testing Library.

```text
src/
├── pages/        # Vistas de registro, acceso y tareas
├── components/   # Formularios, lista, tarea y botón de correo
├── features/     # Lógica de los dominios auth y tasks
├── services/     # Inicialización de Firebase
├── routes/       # Protección y redirección de rutas
├── hooks/        # Estado de autenticación y suscripción a tareas
└── types/        # Modelo y valores de formularios
api/              # Función HTTP de Vercel
server/           # Firebase Admin y formato del resumen
tests/            # Pruebas unitarias y de componentes
firestore.rules   # Reglas de acceso a las tareas
vercel.json       # Build y rutas SPA
```

Separé la interfaz de las operaciones con servicios para que los componentes expresen la interacción y los servicios concentren las llamadas externas. Mantuve el modelo `Task` tipado y usé reglas de Firestore que comprueban la identidad del propietario y la forma de cada documento. La función de correo consulta las tareas en el servidor a partir del UID verificado; no acepta una dirección de destino ni una lista de tareas proporcionadas por el navegador.

## Instalación local

Necesito Node.js 24, npm, un proyecto de Firebase con Authentication por correo/contraseña y Cloud Firestore, y acceso a las cuentas de AWS SES y Vercel para probar el envío de correo.

```bash
git clone https://github.com/MiguelMirandaV/gestor-tareas-m4.git
cd gestor-tareas-m4
npm ci
cp .env.example .env
npm run dev
```

Completo en `.env` las cuatro variables `VITE_FIREBASE_*` de la aplicación web de Firebase. Luego abro la URL que muestre Vite. Publico las reglas de [`firestore.rules`](firestore.rules) en Firestore antes de usar la base de datos. `npm run dev` ejecuta el frontend; para probar localmente la función de correo también necesito la configuración privada del servidor y `vercel dev`.

| Variable | Uso |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Clave de configuración web de Firebase. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de Firebase Authentication. |
| `VITE_FIREBASE_PROJECT_ID` | Identificador del proyecto Firebase. |
| `VITE_FIREBASE_APP_ID` | Identificador de la aplicación web. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | JSON de una cuenta de servicio para la función de Vercel. |
| `AWS_REGION` | Región de AWS SES, `us-east-2` en este despliegue. |
| `AWS_ACCESS_KEY_ID` | Identificador de la clave IAM para SES. |
| `AWS_SECRET_ACCESS_KEY` | Clave privada IAM para SES. |
| `SES_FROM_EMAIL` | Remitente verificado en SES. |

Las variables `VITE_` forman parte de la configuración pública del navegador; la seguridad de los datos depende de Authentication y de las reglas de Firestore. Guardo la cuenta de servicio y las claves de AWS solo en variables privadas del servidor. `.env`, `.env.local` y los archivos de claves de Firebase están excluidos de Git; `.env.example` no contiene valores reales.

## Flujo del resumen por correo

1. Al pulsar **Enviar resumen por email**, el frontend obtiene el token de la sesión y llama a `POST /api/send-summary`.
2. La función verifica el token con Firebase Admin y obtiene del usuario verificado su UID y su dirección de correo.
3. Consulta en Firestore las tareas cuyo `userId` coincide con ese UID y construye el resumen de pendientes y completadas.
4. Envía el texto a esa dirección mediante AWS SES y devuelve un mensaje de éxito o error que se muestra en la interfaz.

En la cuenta de AWS configuré una identidad remitente verificada y un usuario IAM limitado a `ses:SendEmail` desde esa identidad. Si SES permanece en *sandbox*, AWS solo permite enviar a destinatarios verificados; para habilitar envíos a cualquier usuario registrado debo solicitar acceso de producción a SES.

## Verificación y despliegue

```bash
npm run test
npm run lint
npm run build
```

Las pruebas cubren validación de formularios, comportamiento de la lista, suscripción a tareas, composición del resumen y estados del envío de correo con servicios externos simulados. En Vercel configuro las mismas variables para **Production**, guardando como privadas las claves y el JSON de Firebase Admin. El despliegue se genera desde la rama `main` del repositorio; `vercel.json` define el build de Vite y las rutas de la SPA.

## Cómo usé IA

Usé IA como apoyo para descomponer la consigna en pasos, revisar decisiones de arquitectura y proponer casos de prueba. Mis solicitudes incluían el contexto del módulo, el alcance mínimo, los criterios de evaluación y restricciones concretas, por ejemplo, mantener los secretos fuera del frontend y explicar cada integración antes de implementarla. Cuando surgieron dudas sobre Firebase, Vercel o SES, contrasté las propuestas con documentación oficial y con el comportamiento observado en la aplicación.

El patrón que más me sirvió fue pedir una explicación del flujo completo, implementar una parte pequeña y comprobarla con una prueba o una ejecución real antes de avanzar. Así pude distinguir qué responsabilidad corresponde a React, a las reglas de Firestore y a la función del servidor, y detectar errores de integración que una revisión visual no habría mostrado.
