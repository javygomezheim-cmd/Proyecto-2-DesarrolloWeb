# Agenda Académica Personal — Hitos 3 y 4 (Plataforma Web y Móvil Full Stack)

**Asignatura:** Desarrollo Web y Móvil · Segundo semestre 2026 · **Caso 3.2: Agenda académica personal**

## 1. Integrantes

* Tomas Contreras
* Marcos Contreras
* Cristobal Magnata
* Javier Gomez

## 2. Problema y usuarios objetivo

Los estudiantes de educación superior manejan varias asignaturas con tareas, controles, certámenes y entregas en fechas distintas. La información se dispersa y se pierden vencimientos. La plataforma centraliza asignaturas, tareas, evaluaciones y subtareas, con calendario, prioridades, estados, seguimiento de avance e historial de cambios, accesibles tanto desde la web como desde una aplicación móvil.

**Usuarios:** estudiantes universitarios y de educación superior que necesitan planificar su carga académica por período.

## 3. Continuidad del proyecto (Taller 2, Hito 3 y Hito 4)

| Aspecto | Taller 2 | Hito 3 (Web + Backend) | Hito 4 (Aplicación Móvil) |
|---|---|---|---|
| Datos | `localStorage` + JSON locales | API REST propia + PostgreSQL + MongoDB | Segundo cliente que consume la misma API REST y bases de datos del Hito 3 |
| Usuarios | Sin cuentas | Registro, login y JWT; cada usuario ve solo sus datos | Autenticación con JWT persistido en `expo-secure-store` |
| Asignaturas | Nombre, profesor, color | Gestión de asignaturas: creación, edición y eliminación; incluye período académico | Consulta de asignaturas desde el dispositivo móvil |
| Actividades | Título, fecha, descripción, subtareas | Tareas y evaluaciones con prioridad, estado, fecha límite y porcentaje de avance | Consulta de tareas y evaluaciones próximas; actualización de estado y avance |
| Seguimiento | Actividades completadas | Dashboard con resumen de actividades, pendientes y progreso | Pantallas de inicio, agenda y detalle adaptadas a uso móvil |
| Calendario | Calendario de actividades | Calendario con vencimientos y feriados de Chile | Visualización de agenda y estados de actividades |
| Historial | Actividades completadas (local) | Historial de actividad y cambios almacenado en MongoDB | Los cambios desde el móvil se registran en el mismo historial vía API |
| Interfaz | Interfaz del Taller 2 | Sidebar mejorado, navegación entre vistas e iconos Bootstrap | Navegación móvil (login, pestañas y detalles) con manejo de estados de carga y error |
| API pública | Nager.Date y Open Library | Se mantienen para feriados y búsqueda de libros | Se mantienen en el cliente web |

Funcionalidades obligatorias del caso: asignaturas y períodos, evaluaciones/tareas/subtareas, calendario/agenda con fechas, prioridades y estados, seguimiento de avance, listado de pendientes/vencimientos e historial de actividad y cambios.

## 4. Arquitectura

```
 ┌────────────────────┐   HTTP/JSON + JWT    ┌─────────────────────────────┐
 │  React 19 (Vite)   │ ───────────────────► │  NestJS API REST            │
 │  localhost:5173    │ ◄─────────────────── │  localhost:3000             │
 │  - páginas         │                      │  - Controllers + Guards     │
 │  - services/api.js │                      │  - Services (reglas)        │
 └─────────┬──────────┘                      │  - DTO + ValidationPipe     │
           │                                 │  - Swagger /api/docs        │
           │ fetch (API pública)             └───────▲───────┬───────┬─────┘
           ▼                                         │       │       │
 ┌────────────────────┐      HTTP/JSON + JWT         │       │       │
 │ Nager.Date         │ ┌──────────────────────────┐ │       │       │
 │ Open Library       │ │ React Native + Expo      │─┘       │       │
 └────────────────────┘ │ (mobile/)                │         │       │
                        │ - screens / navigation   │   TypeORM   Mongoose
                        │ - services (fetch)       │         │       │
                        │ - expo-secure-store      │  ┌──────▼─────┐ ┌▼────────────┐
                        └──────────────────────────┘  │PostgreSQL16│ │  MongoDB 7  │
                                                      │usuarios    │ │ historial   │
                                                      │asignaturas │ │ actividads  │
                                                      │tareas      │ │ (eventos)   │
                                                      └────────────┘ └─────────────┘
```

| Componente | Responsabilidad |
|---|---|
| React (`frontend/`) | Interfaz web, navegación, formularios, estados de carga/error/vacío, consumo de API |
| React Native + Expo (`mobile/`) | Segundo cliente móvil: navegación, consulta de asignaturas/agenda/tareas y actualización de estado/avance contra la misma API REST |
| NestJS (`backend/`) | Reglas de negocio, validación, autenticación, coordinación de ambas BD |
| PostgreSQL | Datos relacionales y transaccionales (usuarios, asignaturas, tareas/evaluaciones) |
| MongoDB | Eventos de actividad y cambios (documentos de solo agregado) |
| Swagger | Contrato y pruebas interactivas de la API |
| Docker Compose | PostgreSQL, MongoDB, backend y frontend reproducibles, con esquema y datos de prueba |

## 5. Tecnologías y versiones

| Capa | Tecnología |
|---|---|
| Frontend Web | React ^19.2.8, Vite ^8.3.0, Bootstrap ^5.3.8, Bootstrap Icons, ESLint ^10.10.0 |
| Aplicación Móvil | React Native, Expo, Expo Go, `expo-secure-store` |
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

## 10. Ejecución del backend y web con Docker Compose

### Requisitos

Docker y Docker Compose. Node.js 22+ y npm solo para desarrollo local y la aplicación móvil.

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
   * Aplicación web: http://localhost:5173
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

## 11. Aplicación móvil — Hito 4 (`mobile/`)

Segundo cliente (React Native + Expo) del sistema **Agenda Académica Personal**. Consume la **misma API REST (NestJS)** del Hito 3 y opera sobre los mismos datos en PostgreSQL y MongoDB que la aplicación web; no posee backend ni base de datos propios.

### Requisitos

* Node.js 22+ y npm.
* App **Expo Go** en el celular (o un emulador Android/iOS).
* Backend y bases de datos funcionando (`docker compose up -d` desde la raíz).

### Configuración de la URL base de la API

```bash
cd mobile
cp .env.example .env
```

Editar `mobile/.env` y definir `EXPO_PUBLIC_API_URL` (sin `/` al final):

| Dónde se ejecuta la app | Valor |
|---|---|
| Celular físico (Expo Go, misma WiFi que el PC) | `http://<IP-DEL-PC>:3000` (ej. `http://192.168.1.50:3000`) |
| Emulador Android | `http://10.0.2.2:3000` |
| Simulador iOS | `http://localhost:3000` |

La IP del PC se obtiene con `ipconfig` (Windows) o `ifconfig` / `ip a` (Mac/Linux). Si no se define la variable, se usa un valor por defecto según la plataforma. El valor se lee en `mobile/src/config/env.js`.

### Instalación y ejecución

```bash
cd mobile
npm install
npx expo start -c
```

Escanear el código QR con **Expo Go** (o presionar `a` para Android / `i` para iOS). Usuario de prueba: `demo@agenda.cl` / `Demo1234`.

### Estructura de `mobile/src/`

```
mobile/src/
├── config/        URL de la API
├── constants/     tema y valores de tareas
├── services/      cliente HTTP y servicios de la API (única capa que hace fetch)
├── context/       sesión (JWT en expo-secure-store)
├── navigation/    login / pestañas / detalles
├── screens/       auth, inicio, agenda, tareas, asignaturas
├── components/    common, tareas, asignaturas, agenda, inicio
├── hooks/         useAsync (carga y errores)
└── utils/         fechas, progreso, validaciones
```

### Problemas frecuentes

* **"No se pudo conectar con el servidor"**: revisar la IP en `mobile/.env`, confirmar que el celular y el PC estén en la misma red WiFi y que el firewall permita el puerto `3000`. Probar `http://<IP>:3000/api/docs` desde el navegador del celular.
* **Cambios en `.env` no se reflejan**: reiniciar con `npx expo start -c`.
* **"Tu sesión expiró"**: el token JWT venció; volver a iniciar sesión.

### Documentación específica de la entrega del Hito 4

* [README de la aplicación móvil](mobile/README.md)
* [Flujos y capturas](mobile/docs/FLUJOS.md)
* [Endpoints utilizados](mobile/docs/ENDPOINTS.md)
* [Uso de herramientas de IA (Hito 4)](mobile/docs/USO_IA.md)

## 12. Variables de entorno (`.env.example`)

| Variable | Descripción |
|---|---|
| `POSTGRES_HOST`, `POSTGRES_PORT` | Servidor y puerto de PostgreSQL |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credenciales y base de PostgreSQL (también las usa Compose) |
| `MONGO_HOST`, `MONGO_PORT` | Servidor y puerto de MongoDB |
| `MONGO_USER`, `MONGO_PASSWORD`, `MONGO_DB` | Credenciales y base de MongoDB (también las usa Compose) |
| `JWT_SECRET` | Secreto de firma del token (obligatorio) |
| `FRONTEND_URL` | Origen permitido por CORS |
| `VITE_API_URL` | URL del backend para React (`frontend/.env` en desarrollo local; en Compose usa `http://localhost:3000` por defecto) |
| `EXPO_PUBLIC_API_URL` | URL base del backend para la app móvil (`mobile/.env`, sin `/` al final) |

No se versionan archivos `.env` con secretos (`.gitignore`).

## 13. Pruebas

* Unitarias del backend (Vitest, con mocks): `cd backend && npm test`.
* Prueba e2e actual: `npm run test:e2e` (solo `GET /`); levanta `AppModule`, por lo que requiere `backend/.env` y las bases de datos activas.
* Verificación manual recomendada: registro/login, crear asignatura y tarea, editar tarea, completar, revisar `GET /historial`, probar un payload inválido (400) y un id no UUID (400) en Swagger; en móvil, iniciar sesión, consultar asignaturas/agenda, actualizar estado o avance de una tarea y verificar que el cambio se refleje en la aplicación web.

## 14. Limitaciones conocidas

* Las evaluaciones se modelan como una variante de las tareas (`tipo = 'evaluacion'`); no cuentan con campos propios para nota ni ponderación.
* Las subtareas se almacenan como un arreglo JSONB dentro de cada tarea, sin una tabla independiente.
* No se utilizan migraciones de base de datos; el esquema se crea mediante `init.sql` al iniciar un volumen vacío.
* En la aplicación web, el token JWT se almacena en `localStorage` del navegador (en la app móvil se guarda en `expo-secure-store`).
* Las pruebas automatizadas de integración con PostgreSQL y MongoDB reales todavía no están implementadas.
* Si MongoDB no responde, la operación principal se completa, pero el error del registro de historial queda solamente en el log del servidor.

## 15. Uso de Inteligencia Artificial

### Hito 3 (Web y Backend)

| Elemento | Información |
|---|---|
| **Herramienta** | Claude, ChatGPT, Gemini |
| **Propósito** | Análisis de brechas contra el enunciado, diseño del modelo, generación y depuración de código, documentación |
| **Prompt representativo** | "Audita el repositorio frente a los requisitos obligatorios del Hito 3 – Caso 3.2, cita archivo y línea, y entrega correcciones concretas." |
| **Resultado** | Lista de incumplimientos y bugs (contrato `asignatura`/`asignaturaId`, edición con 400 por `forbidNonWhitelisted`, Docker sin esquema), y parches para período, tipo, prioridad, estado, historial con detalle, `seed.sql` y este README |
| **Validación humana** | Se revisó cada parche contra las entidades, DTO y pantallas; se ajustaron nombres, se probó el flujo en Swagger y React, y se descartó lo que no correspondía al caso |
| **Aprendizaje** | Alinear DTO con `ValidationPipe`, normalizar relaciones TypeORM en el frontend, mantener coherencia entre `init.sql` y las entidades, y justificar MongoDB como registro de eventos |

### Hito 4 (Aplicación Móvil)

El detalle de herramientas de IA, elementos asistidos y validación humana realizados para la aplicación móvil se encuentra documentado en [mobile/docs/USO_IA.md](mobile/docs/USO_IA.md).

El uso de inteligencia artificial fue complementario al trabajo del equipo. Las sugerencias y fragmentos de código generados fueron revisados, adaptados y probados antes de incorporarse al proyecto. Todos los integrantes son responsables de comprender las funcionalidades implementadas y poder explicar sus decisiones técnicas durante la defensa.

## 16. Trabajo colaborativo y Git
<<<<<<< Updated upstream

* Ramas principales: `main` y `develop`; ramas `feature/*` para cada funcionalidad.
* Integración mediante Pull Requests hacia `develop`.
* La evolución desde el Taller 2 hasta los Hitos 3 y 4 queda registrada en el historial de commits del repositorio.
=======
>>>>>>> Stashed changes

* Ramas principales: `main` y `develop`; ramas `feature/*` para cada funcionalidad.
* Integración mediante Pull Requests hacia `develop`.
* La evolución desde el Taller 2 hasta los Hitos 3 y 4 queda registrada en el historial de commits del repositorio.