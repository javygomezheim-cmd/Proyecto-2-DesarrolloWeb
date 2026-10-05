import { useState, useEffect } from "react";
import actividadesIniciales from "./data/actividades.json";
import asignaturasIniciales from "./data/asignaturas.json";
import ListaActividadesPage from "./pages/ListaActividadesPage";
import DetalleActividadPage from "./pages/DetalleActividadPage";
import NuevaActividadPage from "./pages/NuevaActividadPage";
import AsignaturasPage from "./pages/AsignaturasPage";
import Sidebar from "./components/Sidebar";
import AsignaturaModal from "./components/AsignaturaModal";
import CalendarioPage from "./pages/Calendariopage.jsx";
import HistorialPage from "./pages/HistorialPage";

const STORAGE_ACTIVIDADES = "actividades";
const STORAGE_ASIGNATURAS = "asignaturas";

export default function App() {
  const [vista, setVista] = useState("lista");
  const [actividadId, setActividadId] = useState(null);

  // Estado del modal global de nueva asignatura
  const [mostrarModalAsignatura, setMostrarModalAsignatura] = useState(false);

  // 1. Inicialización con localStorage (si no existe, usa los JSON)
  const [actividades, setActividades] = useState(() => {
    const guardadas = localStorage.getItem(STORAGE_ACTIVIDADES);

    const datos = guardadas
      ? JSON.parse(guardadas)
      : actividadesIniciales;

    return datos.map((actividad) => ({
      ...actividad,
      completada: actividad.completada ?? false,
    }));
  });

  const [asignaturas, setAsignaturas] = useState(() => {
    const guardadas = localStorage.getItem(STORAGE_ASIGNATURAS);
    return guardadas ? JSON.parse(guardadas) : asignaturasIniciales;
  });

  // 2. Guardar automáticamente en localStorage cuando haya cambios
  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVIDADES, JSON.stringify(actividades));
  }, [actividades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ASIGNATURAS, JSON.stringify(asignaturas));
  }, [asignaturas]);

  // Navegación
  function navegar(nuevaVista, id = null) {
    setVista(nuevaVista);
    setActividadId(id);
  }

  // --- Funciones para Actividades ---
  function agregarActividad(datos) {
    setActividades([...actividades, { ...datos, id: Date.now() }]);
  }

  function actualizarActividad(id, cambios) {
    setActividades(
      actividades.map((a) => (a.id === id ? { ...a, ...cambios } : a)),
    );
  }

  function eliminarActividad(id) {
    setActividades(actividades.filter((a) => a.id !== id));
  }

  function toggleSubtarea(idActividad, idSubtarea) {
    setActividades(
      actividades.map((a) =>
        a.id !== idActividad
          ? a
          : {
            ...a,
            subtareas: a.subtareas.map((s) =>
              s.id === idSubtarea ? { ...s, hecha: !s.hecha } : s,
            ),
          },
      ),
    );
  }

  function toggleCompletada(id) {
    setActividades(
      actividades.map((a) =>
        a.id === id
          ? { ...a, completada: !a.completada }
          : a
      )
    );
  }

  // --- Funciones para Asignaturas ---
  function agregarAsignatura(datos) {
    setAsignaturas([...asignaturas, { ...datos, id: datos.id || Date.now() }]);
  }

  function eliminarAsignaturas(idsAEliminar) {
    const ids = Array.isArray(idsAEliminar) ? idsAEliminar : [idsAEliminar];

    // 1. Eliminamos las asignaturas seleccionadas
    setAsignaturas((actuales) => actuales.filter((a) => !ids.includes(a.id)));

    // 2. Eliminamos en cascada todas las actividades asociadas a esas asignaturas
    setActividades((actuales) =>
      actuales.filter((actividad) => !ids.includes(actividad.asignaturaId)),
    );
  }

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <Sidebar
        vista={vista}
        navegar={navegar}
        abrirModalAsignatura={() => setMostrarModalAsignatura(true)}
      />

      <main className="main-content">
        {vista === "lista" && (
          <ListaActividadesPage
            actividades={actividades}
            asignaturas={asignaturas}
            navegar={navegar}
          />
        )}

        {vista === "detalle" && (
          <DetalleActividadPage
            actividadId={actividadId}
            actividades={actividades}
            asignaturas={asignaturas}
            toggleSubtarea={toggleSubtarea}
            toggleCompletada={toggleCompletada}
            eliminarActividad={eliminarActividad}
            navegar={navegar}
          />
        )}

        {vista === "nueva" && (
          <NuevaActividadPage
            actividadId={actividadId}
            actividades={actividades}
            asignaturas={asignaturas}
            agregarActividad={agregarActividad}
            actualizarActividad={actualizarActividad}
            navegar={navegar}
          />
        )}

        {vista === "asignaturas" && (
          <AsignaturasPage
            asignaturas={asignaturas}
            actividades={actividades}
            eliminarAsignaturas={eliminarAsignaturas}
            abrirModalAsignatura={() => setMostrarModalAsignatura(true)}
            navegar={navegar}
          />
        )}

        {vista === "calendario" && <CalendarioPage actividades={actividades} />}
        {vista === "historial" && (
          <HistorialPage
            actividades={actividades}
            asignaturas={asignaturas}
            navegar={navegar}
          />
        )}
      </main>

      {/* Modal global accesible desde cualquier botón */}
      <AsignaturaModal
        visible={mostrarModalAsignatura}
        alCerrar={() => setMostrarModalAsignatura(false)}
        alGuardar={agregarAsignatura}
      />
    </div>
  );
}
