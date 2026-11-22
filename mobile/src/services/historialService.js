import { peticion } from "./httpClient";

// GET /historial?entidad=&limite= (MongoDB). Opcional para la demo.
export function obtenerHistorial(entidad = "", limite = 50) {
  const consulta = [`limite=${encodeURIComponent(limite)}`];
  if (entidad) consulta.push(`entidad=${encodeURIComponent(entidad)}`);
  return peticion(`/historial?${consulta.join("&")}`);
}