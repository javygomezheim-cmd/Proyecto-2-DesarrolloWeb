// src/services/publicApi.js

export async function obtenerFeriados() {
  try {
    const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2026/CL");

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const datos = await response.json();

    // Mapeamos los datos recibidos de Nager.Date
    return datos.map((f) => ({
      date: f.date,           // Formato "YYYY-MM-DD"
      localName: f.localName, // Nombre en español (ej: "Año Nuevo")
      tipo: f.types && f.types.length > 0 ? f.types[0] : "Nacional",
      irrenunciable: false
    }));
  } catch (error) {
    console.error("Error consultando la API Nager.Date:", error);
    return [];
  }
}