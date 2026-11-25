# Agenda Académica Personal — Aplicación Móvil

Aplicación móvil desarrollada con **React Native y Expo** para el proyecto Agenda Académica Personal. Permite a los estudiantes consultar sus asignaturas, tareas y evaluaciones, revisar su agenda y actualizar el estado y avance de sus actividades.

La aplicación consume la API REST del proyecto y utiliza autenticación mediante JWT, almacenando la sesión de forma segura con `expo-secure-store`.

## 1. Requisitos

- Node.js 22 o superior.
- npm.
- Expo Go instalado en un dispositivo Android o iOS, o un emulador compatible.
- Backend y bases de datos en ejecución (levantados desde la raíz del repositorio con `docker compose up -d`).
- Acceso a la red donde se encuentra disponible el servidor de la API.

## 2. Configuración de variables de entorno

Desde la carpeta `mobile/`, crear el archivo `.env`:

```bash
cp .env.example .env
```

Configurar la variable `EXPO_PUBLIC_API_URL` con la dirección del servidor:

| Entorno | URL |
|---|---|
| Celular físico (misma WiFi que el PC) | `http://IP-DEL-PC:3000` |
| Emulador Android | `http://10.0.2.2:3000` |
| Simulador iOS | `http://localhost:3000` |

Ejemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.50:3000
```

La dirección debe corresponder a la IP real del computador que ejecuta el servidor. No agregar `/` al final.

## 3. Instalación

Abrir una terminal en la carpeta `mobile/` y ejecutar:

```bash
npm install
```

## 4. Ejecución

Primero, levantar el backend y las bases de datos ejecutando desde la **raíz del repositorio**:

```bash
docker compose up -d
```

Luego, desde la carpeta `mobile/`, iniciar Expo con caché limpia:

```bash
npx expo start -c
```

- Escanear el código QR con Expo Go.
- Presionar `a` para abrir en un emulador Android.
- Presionar `i` para abrir en un simulador iOS.

Para utilizar un celular físico, ambos dispositivos deben estar conectados a la misma red WiFi y el firewall debe permitir la conexión al puerto 3000.

## 5. Usuario de prueba

- **Correo:** `demo@agenda.cl`
- **Contraseña:** `Demo1234`

## 6. Funcionalidades

- Inicio de sesión y persistencia segura de la sesión.
- Pantalla de inicio con resumen de actividades.
- Consulta de agenda y próximas evaluaciones.
- Listado y filtrado de tareas.
- Consulta de asignaturas.
- Detalle de tareas y evaluaciones.
- Actualización de estados y avance mediante subtareas.
- Manejo de estados de carga, error y contenido vacío.
- Confirmaciones y notificaciones de operaciones.

## 7. Estructura del proyecto

```text
mobile/
├── src/
│   ├── config/
│   ├── constants/
│   ├── services/
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── docs/
│   ├── capturas/
│   ├── FLUJOS.md
│   ├── ENDPOINTS.md
│   └── USO_IA.md
├── .env.example
├── App.js
└── package.json
```

## 8. Solución de problemas

- **No se pudo conectar con el servidor:** verificar que el backend esté activo (`docker compose up -d` en la raíz), `EXPO_PUBLIC_API_URL`, la IP del computador, la conexión WiFi y el firewall.
- **Los cambios del `.env` no se reflejan:** reiniciar Expo con `npx expo start -c`.
- **La sesión expiró:** volver a iniciar sesión.
- **No se puede abrir la aplicación:** comprobar las dependencias con `npx expo-doctor` y ejecutar `npm install`.

## 9. Documentación adicional

- [Flujos implementados y capturas](docs/FLUJOS.md).
- [Endpoints utilizados](docs/ENDPOINTS.md).
- [Uso de herramientas de IA](docs/USO_IA.md).
