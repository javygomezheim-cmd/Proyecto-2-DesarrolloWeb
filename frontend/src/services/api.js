const API_URL = "http://localhost:3000";
const CLAVE_TOKEN = "agenda_token";
const CLAVE_USUARIO = "agenda_usuario";

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function obtenerUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO));
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}

async function peticion(ruta, opciones = {}) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  });

  if (res.status === 401) {
    cerrarSesion();
    window.dispatchEvent(new Event("sesion-expirada"));
  }

  const texto = await res.text();
  const cuerpo = texto ? JSON.parse(texto) : null;

  if (!res.ok) {
    const mensaje = Array.isArray(cuerpo?.message)
      ? cuerpo.message.join(", ")
      : cuerpo?.message;
    throw new Error(mensaje || `Error ${res.status}`);
  }
  return cuerpo;
}

// --- AUTH ---
export async function iniciarSesion(correo, password) {
  const datos = await peticion("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });
  localStorage.setItem(CLAVE_TOKEN, datos.accessToken);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(datos.usuario));
  return datos.usuario;
}

export function registrarUsuario(nombre, correo, password) {
  return peticion("/usuarios/registro", {
    method: "POST",
    body: JSON.stringify({ nombre, correo, password }),
  });
}

// --- ASIGNATURAS ---
export const obtenerAsignaturas = () => peticion("/asignaturas");

export const crearAsignaturaApi = (datos) =>
  peticion("/asignaturas", { method: "POST", body: JSON.stringify(datos) });

export async function eliminarAsignaturaApi(id) {
  try {
    await peticion(`/asignaturas/${id}`, { method: "DELETE" });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// --- TAREAS / ACTIVIDADES ---
export const obtenerActividadesApi = () => peticion("/tareas");

export const crearActividadApi = (datos) =>
  peticion("/tareas", { method: "POST", body: JSON.stringify(datos) });

export const actualizarActividadApi = (id, datos) =>
  peticion(`/tareas/${id}`, { method: "PUT", body: JSON.stringify(datos) });

export async function eliminarActividadApi(id) {
  await peticion(`/tareas/${id}`, { method: "DELETE" });
  return true;
}

// --- HISTORIAL ---
export function obtenerHistorialApi(entidad = "", limite = 50) {
  const params = new URLSearchParams({ limite });
  if (entidad) params.set("entidad", entidad);
  return peticion(`/historial?${params}`);
}