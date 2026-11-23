# Flujos implementados y capturas

Las capturas están en `docs/capturas/`. (Completar con las imágenes reales.)

| Flujo | Descripción | Captura |
|---|---|---|
| Inicio de sesión | Validación de correo y contraseña, error del servidor y persistencia de la sesión | `01-login.png` |
| Inicio | Contadores por estado, actividades vencidas, próximas evaluaciones y tareas de la semana | `02-inicio.png` |
| Agenda | Actividades agrupadas por día con estado; filtro "Por hacer / Todas" | `03-agenda.png` |
| Tareas | Lista con filtros por tipo y estado, prioridad y avance | `04-tareas.png` |
| Detalle de tarea | Cambio de estado (con confirmación al completar) y marcado de subtareas con barra de avance | `05-detalle-tarea.png` |
| Asignaturas | Lista con cantidad de actividades por hacer y detalle con sus tareas y evaluaciones | `06-asignaturas.png` |

## Estados de interfaz
- **Carga:** `LoadingView` al entrar a cada pantalla; botones deshabilitados mientras se guarda.
- **Error:** `ErrorView` con mensaje del backend o de red y botón "Reintentar".
- **Vacío:** `EmptyState` con texto específico por pantalla.
- **Confirmación:** `Toast` tras guardar y `Alert` antes de marcar como completada.

## Persistencia compartida con la web
Un cambio de estado o de subtareas hecho en el móvil se guarda con `PUT /tareas/:id`
en PostgreSQL, el backend registra el evento en el historial (MongoDB) y el cambio se ve
al recargar la aplicación web.