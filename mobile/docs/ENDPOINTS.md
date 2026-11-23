# Endpoints utilizados por la aplicación móvil

URL base: `EXPO_PUBLIC_API_URL` (ver `mobile/README.md`). Formato: HTTP/JSON.
Todas las rutas, salvo el login, requieren `Authorization: Bearer <accessToken>`.
Código: `mobile/src/services/`.

| Método | Ruta | Archivo | Uso en la app | Pantalla(s) |
|---|---|---|---|---|
| POST | `/auth/login` | `authService.js` | Iniciar sesión y obtener el token | Login |
| GET | `/asignaturas` | `asignaturasService.js` | Listar asignaturas | Asignaturas |
| GET | `/asignaturas/:id` | `asignaturasService.js` | Detalle de una asignatura | Detalle de asignatura |
| GET | `/tareas` | `tareasService.js` | Listar tareas y evaluaciones (campo `tipo`) | Inicio, Agenda, Tareas, Asignaturas |
| GET | `/tareas/:id` | `tareasService.js` | Detalle de una tarea o evaluación | Detalle de tarea |
| PUT | `/tareas/:id` con `{ estado }` | `tareasService.js` | Actualizar el estado | Detalle de tarea |
| PUT | `/tareas/:id` con `{ subtareas }` | `tareasService.js` | Actualizar el avance (subtareas hechas) | Detalle de tarea |

Notas:
- `PUT /tareas/:id` envía solo los campos que cambian (el backend usa `forbidNonWhitelisted`).
- Las reglas de negocio (sincronía `estado` ↔ `completada`, registro del evento en el historial de MongoDB) están en el backend; la app no las replica.