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
import DashboardPage from "./pages/DashboardPage";
import {
  obtenerAsignaturas, crearAsignaturaApi, actualizarAsignaturaApi, eliminarAsignaturaApi,
  obtenerActividadesApi, crearActividadApi, actualizarActividadApi, eliminarActividadApi,
  obtenerUsuarioGuardado, cerrarSesion
} from "./services/api";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [vista, setVista] = useState("dashboard");
  const [actividadId, setActividadId] = useState(null);
  const [mostrarModalAsignatura, setMostrarModalAsignatura] = useState(false);
  const [filtroAsignaturaId, setFiltroAsignaturaId] = useState(null);
  const [asignaturaEditar, setAsignaturaEditar] = useState(null);

  const [asignaturas, setAsignaturas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApp, setErrorApp] = useState(null);
  const [usuario, setUsuario] = useState(obtenerUsuarioGuardado());

  // Cargar datos remotos al iniciar
  useEffect(() => {
    if (!usuario) return;
    async function cargarDatos() {
      try {
        setCargando(true);
        setErrorApp(null);
        const [dataAsignaturas, dataActividades] = await Promise.all([
          obtenerAsignaturas(),
          obtenerActividadesApi(),
        ]);
        setAsignaturas(dataAsignaturas);
        setActividades(dataActividades);
      } catch (err) {
        console.error(err);
        setErrorApp(err.message || "No se pudo cargar la información.");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [usuario]);

  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    window.addEventListener("sesion-expirada", alExpirar);
    return () => window.removeEventListener("sesion-expirada", alExpirar);
  }, []);

  function salir() {
    cerrarSesion();
    setUsuario(null);
    setAsignaturas([]);
    setActividades([]);
    setVista("lista");
  }

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
      setActividades((actuales) => [...actuales, nueva]);
      return true;
    } catch (err) {
      alert(err.message || "Error al crear la actividad en el servidor.");
      return false;
    }
  }

  async function actualizarActividad(id, cambios) {
    try {
      const actualizada = await actualizarActividadApi(id, cambios);
      setActividades((actuales) =>
        actuales.map((a) => (a.id === id ? actualizada : a)),
      );
      return true;
    } catch (err) {
      alert(err.message || "Error al actualizar la actividad.");
      return false;
    }
  }

  async function eliminarActividad(id) {
    try {
      await eliminarActividadApi(id);
      setActividades((actuales) => actuales.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar la actividad.");
    }
  }

  async function toggleSubtarea(idActividad, idSubtarea) {
    const act = actividades.find((a) => a.id === idActividad);
    if (!act) return;

    const nuevasSubtareas = (act.subtareas || []).map((s) =>
      s.id === idSubtarea ? { ...s, hecha: !s.hecha } : s,
    );

    await actualizarActividad(idActividad, { subtareas: nuevasSubtareas });
  }

  async function toggleCompletada(id) {
    const act = actividades.find((a) => a.id === id);
    if (!act) return;

    await actualizarActividad(id, { completada: !act.completada });
  }

  async function agregarAsignatura(datos) {
    try {
      const nuevaCreada = await crearAsignaturaApi(datos);
      setAsignaturas((actuales) => [...actuales, nuevaCreada]);
      return true;
    } catch (err) {
      alert(err.message || "No se pudo guardar la asignatura en el servidor backend.");
      return false;
    }
  }

  async function actualizarAsignatura(id, datos) {
    try {
      const actualizada = await actualizarAsignaturaApi(id, datos);

      setAsignaturas((actuales) =>
        actuales.map((asignatura) =>
          asignatura.id === id ? actualizada : asignatura,
        ),
      );

      return true;
    } catch (err) {
      alert(err.message || "No se pudo actualizar la asignatura.");
      return false;
    }
  }

  async function eliminarAsignaturas(idsAEliminar) {
    const ids = Array.isArray(idsAEliminar) ? idsAEliminar : [idsAEliminar];
    const eliminadas = [];

    try {
      for (const id of ids) {
        const ok = await eliminarAsignaturaApi(id);
        if (!ok) throw new Error("Error al eliminar asignatura");
        eliminadas.push(id);
      }
    } catch (err) {
      alert(err.message || "Error al eliminar asignaturas.");
    } finally {
      if (eliminadas.length > 0) {
        setAsignaturas((actuales) => actuales.filter((a) => !eliminadas.includes(a.id)));
        setActividades((actuales) =>
          actuales.filter(
            (actividad) =>
              !eliminadas.includes(actividad.asignaturaId) &&
              !eliminadas.includes(actividad.asignatura?.id),
          ),
        );
      }
    }
  }

  if (!usuario) return <LoginPage onLogin={setUsuario} />;

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <Sidebar
        vista={vista}
        navegar={navegar}
        abrirModalAsignatura={() => {
          setAsignaturaEditar(null);
          setMostrarModalAsignatura(true);
        }}
        onSalir={salir}
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
            {vista === "dashboard" && (
              <DashboardPage
                actividades={actividades}
                asignaturas={asignaturas}
                navegar={navegar}
              />
            )}

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
                abrirModalAsignatura={() => {
                  setAsignaturaEditar(null);
                  setMostrarModalAsignatura(true);
                }}
                editarAsignatura={(asignatura) => {
                  setAsignaturaEditar(asignatura);
                  setMostrarModalAsignatura(true);
                }}
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
        alGuardar={(datos) => {
          if (asignaturaEditar) {
            return actualizarAsignatura(asignaturaEditar.id, datos);
          }

          return agregarAsignatura(datos);
        }}
        asignaturaEditar={asignaturaEditar}
      />
    </div>
  );
}
