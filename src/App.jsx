import { useState } from "react";
import actividadesIniciales from "./data/actividades.json";
import asignaturasIniciales from "./data/asignaturas.json";
import ListaActividadesPage from "./pages/ListaActividadesPage";
import DetalleActividadPage from "./pages/DetalleActividadPage";
import NuevaActividadPage from "./pages/NuevaActividadPage";
import AsignaturasPage from "./pages/AsignaturasPage";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [vista, setVista] = useState("lista");
  const [actividadId, setActividadId] = useState(null);
  const [actividades, setActividades] = useState(actividadesIniciales);
  const [asignaturas, setAsignaturas] = useState(asignaturasIniciales);

  function navegar(nuevaVista, id = null) {
    setVista(nuevaVista);
    setActividadId(id);
  }

  function agregarActividad(datos) {
    setActividades([...actividades, { ...datos, id: Date.now() }]);
  }

  function actualizarActividad(id, cambios) {
    setActividades(
      actividades.map((a) => (a.id === id ? { ...a, ...cambios } : a))
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
                s.id === idSubtarea ? { ...s, hecha: !s.hecha } : s
              ),
            }
      )
    );
  }

  function agregarAsignatura(datos) {
    setAsignaturas([...asignaturas, { ...datos, id: Date.now() }]);
  }

return (
  <div className="d-flex min-vh-100">
    <Sidebar vista={vista} navegar={navegar} />

    <main className="flex-grow-1">
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
          agregarAsignatura={agregarAsignatura}
          navegar={navegar}
        />
      )}
    </main>
  </div>
);
}