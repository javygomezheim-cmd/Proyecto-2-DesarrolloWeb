// frontend/src/services/publicApi.js
export async function obtenerFeriados() {
  try {
    const anioActual = new Date().getFullYear();
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${anioActual}/CL`);

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const datos = await response.json();

    return datos.map((f) => ({
      date: f.date,
      localName: f.localName,
      tipo: f.types && f.types.length > 0 ? f.types[0] : "Nacional",
      irrenunciable: false
    }));
  } catch (error) {
    console.error("Error consultando la API Nager.Date:", error);
    throw error; // Propagamos el error para que la UI pueda manejarlo si es necesario
  }
}