import { API_URL, TIMEOUT_MS } from "../config/env";

let token = null;
let alExpirarSesion = null;

export const setToken = (nuevoToken) => {
  token = nuevoToken;
};

export const setUnauthorizedHandler = (funcion) => {
  alExpirarSesion = funcion;
};

export class ApiError extends Error {
  constructor(message, { status, esRed = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.esRed = esRed;
  }
}

export async function peticion(ruta, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      signal: controlador.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new ApiError(
      `No se pudo conectar con el servidor (${API_URL}). Revisa tu conexión y la URL de la API.`,
      { esRed: true }
    );
  } finally {
    clearTimeout(temporizador);
  }

  const texto = await respuesta.text();
  let cuerpo = null;
  try {
    cuerpo = texto ? JSON.parse(texto) : null;
  } catch {
    throw new ApiError("El servidor devolvió una respuesta que no es JSON válido.", {
      status: respuesta.status,
    });
  }

  // Solo expira la sesión si había token (un login fallido también devuelve 401).
  if (respuesta.status === 401 && token) {
    alExpirarSesion?.();
  }

  if (!respuesta.ok) {
    const mensaje = Array.isArray(cuerpo?.message)
      ? cuerpo.message.join(", ")
      : cuerpo?.message;
    throw new ApiError(mensaje || `Error ${respuesta.status}`, {
      status: respuesta.status,
    });
  }

  return cuerpo;
}