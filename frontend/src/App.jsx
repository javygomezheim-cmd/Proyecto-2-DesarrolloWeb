// Reemplazo en frontend/src/App.jsx (fragmento clave de carga y estados)
import { useState, useEffect } from "react";
import ListaActividadesPage from "./pages/ListaActividadesPage";
import DetalleActividadPage from "./pages/DetalleActividadPage";
import NuevaActividadPage from "./pages/NuevaActividadPage";
import AsignaturasPage from "./pages/AsignaturasPage";
import Sidebar from "./components/Sidebar";
import AsignaturaModal from "./components/AsignaturaModal";
import CalendarioPage from "./pages/Calendariopage.jsx";
import HistorialPage from "./pages/HistorialPage";
import LibrosPage from "./pages/LibrosPage.jsx";
import { 
  obtenerAsignaturas, crearAsignaturaApi, eliminarAsignaturaApi,
  obtenerActividadesApi, crearActividadApi, actualizarActividadApi, eliminarActividadApi 
} from "./services/api";

export default function App() {
  const [vista, setVista] = useState("lista");
  const [actividadId, setActividadId] = useState(null);
  const [mostrarModalAsignatura, setMostrarModalAsignatura] = useState(false);
  const [filtroAsignaturaId, setFiltroAsignaturaId] = useState(null);

  const [asignaturas, setAsignaturas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApp, setErrorApp] = useState(null);

  // Cargar datos remotos al iniciar
  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        setErrorApp(null);
        const [dataAsignaturas, dataActividades] = await Promise.all([
          obtenerAsignaturas(),
          obtenerActividadesApi()
        ]);
        setAsignaturas(dataAsignaturas);
        setActividades(dataActividades);
      } catch (err) {
        console.error(err);
        setErrorApp("No se pudo conectar con el servidor backend. Verifica que esté encendido.");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  function navegar(nuevaVista, id = null) {
    setVista(nuevaVista);
    if (nuevaVista === "lista") {
      setFiltroAsignaturaId(id);
    } else {
      setActividadId(id);
    }
  }

  async function agregarActividad(datos) {
    try {
      const nueva = await crearActividadApi(datos);
      setActividades([...actividades, nueva]);
    } catch (err) {
      alert("Error al crear la actividad en el servidor.");
    }
  }

  async function actualizarActividad(id, cambios) {
    try {
      const actualizada = await actualizarActividadApi(id, cambios);
      setActividades(actividades.map((a) => (a.id === id ? actualizada : a)));
    } catch (err) {
      alert("Error al actualizar la actividad.");
    }
  }

  async function eliminarActividad(id) {
    try {
      await eliminarActividadApi(id);
      setActividades(actividades.filter((a) => a.id !== id));
    } catch (err) {
      alert("Error al eliminar la actividad.");
    }
  }

  async function toggleSubtarea(idActividad, idSubtarea) {
    const act = actividades.find(a => a.id === idActividad);
    if (!act) return;

    const nuevasSubtareas = act.subtareas.map(s => 
      s.id === idSubtarea ? { ...s, hecha: !s.hecha } : s
    );

    await actualizarActividad(idActividad, { subtareas: nuevasSubtareas });
  }

  async function toggleCompletada(id) {
    const act = actividades.find(a => a.id === id);
    if (!act) return;

    await actualizarActividad(id, { completada: !act.completada });
  }

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
    try {
      for (const id of ids) {
        await eliminarAsignaturaApi(id);
      }
      setAsignaturas((actuales) => actuales.filter((a) => !ids.includes(a.id)));
      setActividades((actuales) =>
        actuales.filter((actividad) => !ids.includes(actividad.asignatura?.id)),
      );
    } catch (err) {
      alert("Error al eliminar asignaturas.");
    }
  }

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <Sidebar
        vista={vista}
        navegar={navegar}
        abrirModalAsignatura={() => setMostrarModalAsignatura(true)}
      />

      <main className="main-content">
        {cargando ? (
          <div className="text-center py-5 mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Cargando datos desde el servidor...</p>
          </div>
        ) : errorApp ? (
          <div className="p-4">
            <div className="alert alert-danger">{errorApp}</div>
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