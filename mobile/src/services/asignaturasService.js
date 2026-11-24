import { peticion } from "./httpClient";

// GET /asignaturas -> [{ id, nombre, profesor, color, periodo }]
export const obtenerAsignaturas = () => peticion("/asignaturas");

// GET /asignaturas/:id
export const obtenerAsignatura = (id) => peticion(`/asignaturas/${id}`);

// POST /asignaturas -> Crear una nueva asignatura
export const crearAsignatura = (datos) =>
  peticion("/asignaturas", {
    method: "POST",
    body: JSON.stringify(datos),
  });