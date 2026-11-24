import { peticion } from "./httpClient";

// Deja la tarea siempre con la misma forma, venga de GET o de PUT.
const normalizar = (t) => ({
  ...t,
  asignaturaId: t.asignatura?.id ?? t.asignaturaId,
  descripcion: t.descripcion ?? "",
  subtareas: t.subtareas ?? [],
});

// GET /tareas -> incluye tareas y evaluaciones (campo "tipo"), ordenadas por fechaLimite
export async function obtenerTareas() {
  const lista = await peticion("/tareas");
  return lista.map(normalizar);
}

// GET /tareas/:id
export async function obtenerTarea(id) {
  return normalizar(await peticion(`/tareas/${id}`));
}

// PUT /tareas/:id
// IMPORTANTE: el backend usa forbidNonWhitelisted. Enviar SOLO los campos que cambian.
async function actualizar(id, parcial) {
  const tarea = await peticion(`/tareas/${id}`, {
    method: "PUT",
    body: JSON.stringify(parcial),
  });
  return normalizar(tarea);
}

// Cambia solo el estado: "pendiente" | "en_progreso" | "completada"
export const cambiarEstado = (id, estado) => actualizar(id, { estado });

// Reemplaza el arreglo completo de subtareas: [{ id, texto, hecha }]
export const guardarSubtareas = (id, subtareas) => actualizar(id, { subtareas });

// POST /tareas -> Crear una nueva tarea o evaluación
export const crearTarea = (datos) =>
  peticion("/tareas", {
    method: "POST",
    body: JSON.stringify(datos),
  });