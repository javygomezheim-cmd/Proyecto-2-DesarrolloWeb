# Agenda Académica Personal — Hito 3 (Plataforma Web Full Stack)

**Asignatura:** Desarrollo Web y Móvil · Segundo semestre 2026 · **Caso 3.2: Agenda académica personal**

## 1. Integrantes

* Tomas Contreras
* Marcos Contreras
* Cristobal Magnata
* Javier Gomez

## 2. Problema y usuarios objetivo

Los estudiantes de educación superior manejan varias asignaturas con tareas, controles, certámenes y entregas en fechas distintas. La información se dispersa y se pierden vencimientos. La plataforma centraliza asignaturas, tareas, evaluaciones y subtareas, con calendario, prioridades, estados, seguimiento de avance e historial de cambios.

**Usuarios:** estudiantes universitarios y de educación superior que necesitan planificar su carga académica por período.

## 3. Continuidad con el Taller 2 y funcionalidades del Hito 3

| Aspecto | Taller 2 | Hito 3 |
|---|---|---|
| Datos | `localStorage` + JSON locales | API REST propia + PostgreSQL + MongoDB |
| Usuarios | Sin cuentas | Registro, login y JWT; cada usuario ve solo sus datos |
| Asignaturas | Nombre, profesor, color | Gestión de asignaturas: creación, edición y eliminación; incluye período académico |
| Actividades | Título, fecha, descripción, subtareas | Tareas y evaluaciones con prioridad, estado, fecha límite y porcentaje de avance |
| Seguimiento | Actividades completadas | Dashboard con resumen de actividades, pendientes y progreso |
| Calendario | Calendario de actividades | Calendario con vencimientos y feriados de Chile |
| Historial | Actividades completadas (local) | Historial de actividad y cambios almacenado en MongoDB |
| Interfaz | Interfaz del Taller 2 | Sidebar mejorado, navegación entre vistas e iconos Bootstrap |
| API pública | Nager.Date y Open Library | Se mantienen para feriados y búsqueda de libros |

Funcionalidades obligatorias del caso: asignaturas y períodos, evaluaciones/tareas/subtareas, calendario con fechas, prioridades y estados, seguimiento de avance, listado de pendientes/vencimientos e historial de actividad y cambios.

## 4. Arquitectura

```
 ┌────────────────────┐   HTTP/JSON + JWT    ┌─────────────────────────────┐
 │  React 19 (Vite)   │ ───────────────────► │  NestJS API REST            │
 │  localhost:5173    │ ◄─────────────────── │  localhost:3000             │
 │  - páginas         │                      │  - Controllers + Guards     │
 │  - services/api.js │                      │  - Services (reglas)        │
 └─────────┬──────────┘                      │  - DTO + ValidationPipe     │
           │                                 │  - Swagger /api/docs        │
           │ fetch (API pública)             └───────┬─────────────┬───────┘
           ▼                                         │ TypeORM     │ Mongoose
 ┌────────────────────┐                      ┌───────▼──────┐ ┌────▼─────────┐
 │ Nager.Date         │                      │ PostgreSQL 16│ │  MongoDB 7   │
 │ Open Library       │                      │ usuarios     │ │ historial    │
 └────────────────────┘                      │ asignaturas  │ │ actividads   │
                                             │ tareas       │ │ (eventos)    │
                                             └──────────────┘ └──────────────┘
```

| Componente | Responsabilidad |
|---|---|
| React | Interfaz, navegación, formularios, estados de carga/error/vacío, consumo de API |
| NestJS | Reglas de negocio, validación, autenticación, coordinación de ambas BD |
| PostgreSQL | Datos relacionales y transaccionales (usuarios, asignaturas, tareas/evaluaciones) |
| MongoDB | Eventos de actividad y cambios (documentos de solo agregado) |
| Swagger | Contrato y pruebas interactivas de la API |
| Docker Compose | PostgreSQL, MongoDB, backend y frontend reproducibles, con esquema y datos de prueba |

## 5. Tecnologías y versiones

| Capa | Tecnología |
|---|---|
| Frontend | React ^19.2.8, Vite ^8.3.0, Bootstrap ^5.3.8, Bootstrap Icons, ESLint ^10.10.0 |
| Backend | NestJS ^12.0.1, TypeORM ^1.1.2, Mongoose ^9.12.1, `pg` ^8.23.1, class-validator ^0.15.1, bcrypt ^6.0.0, `@nestjs/jwt` ^12.0.4, `@nestjs/swagger` ^12.1.1, TypeScript ^6.0.2 |
| Pruebas | Vitest ^4.1.2, Supertest ^7.0.0 |
| Bases de datos | PostgreSQL 16 (`postgres:16`), MongoDB 7 (`mongo:7`) |
| Infraestructura | Docker Compose |
| Herramientas | Git, GitHub, Visual Studio Code |

## 6. Modelo SQL (PostgreSQL)

Script: `database/init.sql`. Datos de prueba: `database/seed.sql`.

```
usuarios (1) ──< asignaturas (1) ──< tareas >── (1) usuarios
```

| Tabla | Columnas principales | Restricciones |
|---|---|---|
| `usuarios` | `id` uuid PK, `nombre`, `correo`, `password_hash`, `creado_en` | `UNIQUE(correo)` |
| `asignaturas` | `id` PK, `nombre`, `profesor`, `color`, `periodo`, `usuario_id` FK, `creado_en` | FK `ON DELETE CASCADE`; `CHECK periodo ~ '^[0-9]{4}-[12]$'` |
| `evaluaciones` (vista) | Mismas columnas que `tareas` | `SELECT * FROM tareas WHERE tipo = 'evaluacion'` |
| `tareas` | `id` PK, `titulo`, `descripcion`, `fecha_limite` timestamptz, `completada`, `tipo`, `prioridad`, `estado`, `subtareas` jsonb, `asignatura_id` FK, `usuario_id` FK, `creado_en` | FK `ON DELETE CASCADE`; `CHECK` de `tipo`, `prioridad`, `estado` y `completada = (estado = 'completada')` |

* **Evaluaciones:** se modelan como `tareas` con `tipo = 'evaluacion'` (comparten fecha, prioridad, estado y subtareas) y se exponen en SQL mediante la vista `evaluaciones`. Su historial se registra con `entidad: 'evaluacion'`.
* **Subtareas:** arreglo `jsonb` dentro de la tarea (`{ id, texto, hecha }`). El % de avance se calcula como `hechas / total`.
* **Índices:** `(usuario_id, fecha_limite)` para listados y vencimientos; `asignatura_id` para filtros.

## 7. Justificación de MongoDB frente a SQL

MongoDB almacena el **historial de actividad y cambios** (colección `historialactividads`). Cada documento es un evento inmutable:

```json
{
  "usuarioId": "a0000000-0000-4000-8000-000000000001",
  "accion": "editada",
  "entidad": "evaluacion",
  "entidadId": "c0000000-0000-4000-8000-000000000001",
  "titulo": "Control 1 de integrales",
  "detalle": "Estado: pendiente → en_progreso; Subtareas: 0/2 → 1/2",
  "fecha": "2026-11-13T12:00:00.000Z"
}
```

* **No duplica SQL:** PostgreSQL guarda el estado actual; MongoDB guarda la secuencia de eventos (qué pasó y cuándo), incluyendo eventos de elementos ya eliminados.
* **Esquema flexible:** `detalle` varía según el evento (cambio de fecha, estado, avance) sin migrar tablas.
* **Escritura intensiva y solo agregado:** cada operación de asignaturas y tareas agrega un documento sin bloquear las tablas relacionales.
* **Integración real:** `AsignaturasService` y `TareasService` llaman a `HistorialService.registrarEvento()`; el frontend lo consulta con `GET /historial`.

## 8. API REST y Swagger

* Swagger UI: **http://localhost:3000/api/docs** (usar "Authorize" con el token de `POST /auth/login`).
* Validación global: `ValidationPipe` con `whitelist`, `forbidNonWhitelisted` y `transform`.
* Los `:id` se validan con `ParseUUIDPipe` (UUID inválido → 400).

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/usuarios/registro` | No | Registrar usuario |
| POST | `/auth/login` | No | Obtener `accessToken` |
| GET | `/auth/perfil` | Sí | Usuario del token |
| GET / PUT / DELETE | `/usuarios/me` | Sí | Ver, actualizar o eliminar mi cuenta |
| GET / POST | `/asignaturas` | Sí | Listar / crear (incluye `periodo`) |
| GET / PUT / DELETE | `/asignaturas/:id` | Sí | Ver / actualizar / eliminar |
| GET / POST | `/tareas` | Sí | Listar / crear tarea o evaluación (`tipo`) |
| GET / PUT / DELETE | `/tareas/:id` | Sí | Ver / actualizar / eliminar |
| GET | `/historial?entidad=&limite=` | Sí | Historial de actividad (MongoDB) |

Códigos usados: 200, 201, 204, 400 (validación), 401 (token), 404 (no existe o no pertenece al usuario), 409 (correo duplicado).

## 9. APIs públicas

### Nager.Date (feriados de Chile)

* Documentación: https://date.nager.at/
* Endpoint: `GET https://date.nager.at/api/v3/PublicHolidays/{año}/CL` (el año es el año actual).
* Uso: `frontend/src/services/publicApi.js` → se muestran los feriados en el calendario junto a los vencimientos.
* Integración desde el **frontend** (no requiere clave ni lógica de negocio). Ante fallo, el calendario sigue mostrando las actividades sin feriados.

### Open Library (búsqueda de libros)

* Documentación: https://openlibrary.org/developers/api
* Endpoint: `GET https://openlibrary.org/search.json?q=...&limit=12&fields=...`
* Uso: `frontend/src/pages/LibrosPage.jsx` → bibliografía de apoyo por asignatura. Maneja estados de carga, vacío y error.
* Integración desde el **frontend** (consulta pública de solo lectura).

La API pública es complementaria: no sustituye al backend propio.

## 10. Ejecución con Docker Compose

### Requisitos

Docker y Docker Compose. Node.js 22+ y npm solo para el modo desarrollo local.

### Opción A: todo con Docker Compose (recomendada)

1. Clonar y entrar al repositorio.
2. Crear el archivo de entorno y generar el secreto JWT:
   ```bash
   cp .env.example .env
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Pegar el resultado en `JWT_SECRET` dentro de `.env`.
3. Construir y levantar los 4 servicios (crea las tablas con `init.sql` y carga `seed.sql`):
   ```bash
   docker compose up -d --build
   docker compose ps
   ```
4. Abrir:
   * Aplicación: http://localhost:5173
   * Swagger: http://localhost:3000/api/docs
   * Usuario de prueba: `demo@agenda.cl` / `Demo1234`

Reiniciar datos desde cero: `docker compose down -v && docker compose up -d --build`.

### Opción B: desarrollo local (bases de datos en Docker)

```bash
cp .env.example .env
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up -d postgres mongo
cd backend && npm install && npm run start:dev      # terminal 1
cd frontend && npm install && npm run dev           # terminal 2
```

No ejecutar la opción B con los contenedores `backend` y `frontend` levantados (puertos 3000 y 5173 en uso).

### Servicios y puertos

| Servicio | Imagen | Puerto | Volumen / notas |
|---|---|---|---|
| `postgres` | `postgres:16` | 5432 | `postgres_data`, `init.sql`, `seed.sql` |
| `mongo` | `mongo:7` | 27017 | `mongo_data` |
| `backend` | build `./backend` (Node 22) | 3000 | Espera a que PostgreSQL y MongoDB estén saludables |
| `frontend` | build `./frontend` (Vite + nginx) | 5173 | `VITE_API_URL` se fija al construir la imagen |

## 11. Variables de entorno (`.env.example`)

| Variable | Descripción |
|---|---|
| `POSTGRES_HOST`, `POSTGRES_PORT` | Servidor y puerto de PostgreSQL |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credenciales y base de PostgreSQL (también las usa Compose) |
| `MONGO_HOST`, `MONGO_PORT` | Servidor y puerto de MongoDB |
| `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_DB` | Credenciales y base de MongoDB (también las usa Compose) |
| `JWT_SECRET` | Secreto de firma del token (obligatorio) |
| `FRONTEND_URL` | Origen permitido por CORS |
| `VITE_API_URL` | URL del backend para React (`frontend/.env` en desarrollo local; en Compose usa `http://localhost:3000` por defecto) |

No se versionan archivos `.env` con secretos (`.gitignore`).

## 12. Pruebas

* Unitarias del backend (Vitest, con mocks): `cd backend && npm test`.
* Prueba e2e actual: `npm run test:e2e` (solo `GET /`); levanta `AppModule`, por lo que requiere `backend/.env` y las bases de datos activas.
* Verificación manual recomendada: registro/login, crear asignatura y tarea, editar tarea, completar, revisar `GET /historial`, probar un payload inválido (400) y un id no UUID (400) en Swagger.

## 13. Limitaciones conocidas

* Las evaluaciones se modelan como una variante de las tareas (`tipo = 'evaluacion'`); no cuentan con campos propios para nota ni ponderación.
* Las subtareas se almacenan como un arreglo JSONB dentro de cada tarea, sin una tabla independiente.
* No se utilizan migraciones de base de datos; el esquema se crea mediante `init.sql` al iniciar un volumen vacío.
* El token JWT se almacena en `localStorage` del navegador.
* Las pruebas automatizadas de integración con PostgreSQL y MongoDB reales todavía no están implementadas.
* Si MongoDB no responde, la operación principal se completa, pero el error del registro de historial queda solamente en el log del servidor..

## 14. Uso de Inteligencia Artificial

| Elemento | Información |
|---|---|
| **Herramienta** | Claude, ChatGPT, Gemini |
| **Propósito** | Análisis de brechas contra el enunciado, diseño del modelo, generación y depuración de código, documentación |
| **Prompt representativo** | "Audita el repositorio frente a los requisitos obligatorios del Hito 3 – Caso 3.2, cita archivo y línea, y entrega correcciones concretas." |
| **Resultado** | Lista de incumplimientos y bugs (contrato `asignatura`/`asignaturaId`, edición con 400 por `forbidNonWhitelisted`, Docker sin esquema), y parches para período, tipo, prioridad, estado, historial con detalle, `seed.sql` y este README |
| **Validación humana** | Se revisó cada parche contra las entidades, DTO y pantallas; se ajustaron nombres, se probó el flujo en Swagger y React, y se descartó lo que no correspondía al caso |
| **Aprendizaje** | Alinear DTO con `ValidationPipe`, normalizar relaciones TypeORM en el frontend, mantener coherencia entre `init.sql` y las entidades, y justificar MongoDB como registro de eventos |

El uso de inteligencia artificial fue complementario al trabajo del equipo. Las sugerencias y fragmentos de código generados fueron revisados, adaptados y probados antes de incorporarse al proyecto. Todos los integrantes son responsables de comprender las funcionalidades implementadas y poder explicar sus decisiones técnicas durante la defensa.

## 15. Trabajo colaborativo y Git

* Ramas principales: `main` y `develop`; ramas `feature/*` para cada funcionalidad.
* Integración mediante Pull Requests hacia `develop`.
* La evolución desde el Taller 2 queda en el historial de commits del repositorio.
