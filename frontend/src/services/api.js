const API_URL = "http://localhost:3000";

let USUARIO_ID_ACTUAL = "f6d1f8dd-9376-45da-866a-8bd9cfd20479"; 

// --- ASIGNATURAS ---
export async function obtenerAsignaturas(usuarioId = USUARIO_ID_ACTUAL) {
  try {
    const res = await fetch(`${API_URL}/asignaturas?usuarioId=${usuarioId}`);
    if (!res.ok) throw new Error("Error al obtener asignaturas");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function crearAsignaturaApi(datos, usuarioId = USUARIO_ID_ACTUAL) {
  try {
    const res = await fetch(`${API_URL}/asignaturas?usuarioId=${usuarioId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error("Error al crear asignatura");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function eliminarAsignaturaApi(id, usuarioId = USUARIO_ID_ACTUAL) {
  try {
    const res = await fetch(`${API_URL}/asignaturas/${id}?usuarioId=${usuarioId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar asignatura");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// --- TAREAS / ACTIVIDADES ---
export async function obtenerActividadesApi(usuarioId = USUARIO_ID_ACTUAL) {
  const res = await fetch(`${API_URL}/tareas?usuarioId=${usuarioId}`);
  if (!res.ok) throw new Error("Error al obtener actividades");
  return await res.json();
}

export async function crearActividadApi(datos, usuarioId = USUARIO_ID_ACTUAL) {
  const res = await fetch(`${API_URL}/tareas?usuarioId=${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al crear actividad");
  return await res.json();
}

export async function actualizarActividadApi(id, datos, usuarioId = USUARIO_ID_ACTUAL) {
  const res = await fetch(`${API_URL}/tareas/${id}?usuarioId=${usuarioId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error al actualizar actividad");
  return await res.json();
}

export async function eliminarActividadApi(id, usuarioId = USUARIO_ID_ACTUAL) {
  const res = await fetch(`${API_URL}/tareas/${id}?usuarioId=${usuarioId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar actividad");
  return true;
}

// --- HISTORIAL ---
export async function obtenerHistorialApi(usuarioId = USUARIO_ID_ACTUAL, entidad = "", limite = 50) {
  let url = `${API_URL}/historial?usuarioId=${usuarioId}&limite=${limite}`;
  if (entidad) url += `&entidad=${entidad}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener el historial");
  return await res.json();
}