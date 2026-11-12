const API_URL = "http://localhost:3000";

// Para propósitos de este hito/prueba, puedes utilizar un ID de usuario registrado en tu BD de PostgreSQL.
// Si ya tienes un usuario creado, puedes colocar su UUID aquí o gestionarlo mediante estado.
let USUARIO_ID_ACTUAL = "f6d1f8dd-9376-45da-866a-8bd9cfd20479"; 

export async function obtenerAsignaturas(usuarioId = USUARIO_ID_ACTUAL) {
  try {
    const res = await fetch(`${API_URL}/asignaturas?usuarioId=${usuarioId}`);
    if (!res.ok) throw new Error("Error al obtener asignaturas");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
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
