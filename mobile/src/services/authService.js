import { peticion } from "./httpClient";

// POST /auth/login -> { accessToken, usuario: { id, nombre, correo } }
export function iniciarSesion(correo, password) {
  return peticion("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo: correo.trim(), password }),
  });
}