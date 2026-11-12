import { useState, useEffect } from "react";
import actividadesIniciales from "./data/actividades.json";
import ListaActividadesPage from "./pages/ListaActividadesPage";
import DetalleActividadPage from "./pages/DetalleActividadPage";
import NuevaActividadPage from "./pages/NuevaActividadPage";
import AsignaturasPage from "./pages/AsignaturasPage";
import Sidebar from "./components/Sidebar";
import AsignaturaModal from "./components/AsignaturaModal";
import CalendarioPage from "./pages/Calendariopage.jsx";
import HistorialPage from "./pages/HistorialPage";
import LibrosPage from "./pages/LibrosPage.jsx";
import { obtenerAsignaturas, crearAsignaturaApi, eliminarAsignaturaApi } from "./services/api";

const STORAGE_ACTIVIDADES = "actividades";

export default function App() {
  const [vista, setVista] = useState("lista");
  const [actividadId, setActividadId] = useState(null);
  const [mostrarModalAsignatura, setMostrarModalAsignatura] = useState(false);
  const [filtroAsignaturaId, setFiltroAsignaturaId] = useState(null);

  // Estados remotos para asignaturas y locales para actividades
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargandoAsignaturas, setCargandoAsignaturas] = useState(true);

  const [actividades, setActividades] = useState(() => {
    const guardadas = localStorage.getItem(STORAGE_ACTIVIDADES);
    const datos = guardadas ? JSON.parse(guardadas) : actividadesIniciales;
    return datos.map((actividad) => ({
      ...actividad,
      completada: actividad.completada ?? false,
    }));
  });

  // Cargar asignaturas desde la API de NestJS al montar
  useEffect(() => {
    async function cargarDatosRemotos() {
      setCargandoAsignaturas(true);
      const datos = await obtenerAsignaturas();
      if (datos && datos.length > 0) {
        setAsignaturas(datos);
      }
      setCargandoAsignaturas(false);
    }
    cargarDatosRemotos();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVIDADES, JSON.stringify(actividades));
  }, [actividades]);

  function navegar(nuevaVista, id = null) {
    setVista(nuevaVista);
    if (nuevaVista === "lista") {
      setFiltroAsignaturaId(id);
    } else {
      setActividadId(id);
    }
  }

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
        a.id === id ? { ...a, completada: !a.completada } : a,
      ),
    );
  }

  // --- Funciones conectadas a la API del Backend ---
  async function agregarAsignatura(datos) {
    try {
      const nuevaCreada = await crearAsignaturaApi(datos);
      setAsignaturas([...asignaturas, nuevaCreada]);
    } catch (e) {
      alert("No se pudo guardar la asignatura en el servidor backend.");
    }
  }

  async function eliminarAsignaturas(idsAEliminar) {
    const ids = Array.isArray(idsAEliminar) ? idsAEliminar : [idsAEliminar];

    for (const id of ids) {
      await eliminarAsignaturaApi(id);
    }

    setAsignaturas((actuales) => actuales.filter((a) => !ids.includes(a.id)));
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
        {cargandoAsignaturas ? (
          <div className="text-center py-5 mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Conectando con el servidor backend...</p>
          </div>
        ) : (
          <>
            {vista === "lista" && (
              <ListaActividadesPage
                key={filtroAsignaturaId ?? "todas"}
                actividades={actividades}
                asignaturas={asignaturas}
                filtroAsignaturaInicial={filtroAsignaturaId}
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

            {vista === "libros" && <LibrosPage asignaturas={asignaturas} />}
          </>
        )}
      </main>

      <AsignaturaModal
        visible={mostrarModalAsignatura}
        alCerrar={() => setMostrarModalAsignatura(false)}
        alGuardar={agregarAsignatura}
      />
    </div>
  );
}