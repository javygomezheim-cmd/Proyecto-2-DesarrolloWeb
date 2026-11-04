import { useState } from "react";
import AsignaturaCard from "../components/AsignaturaCard";
import ConfirmarEliminarModal from "../components/ConfirmarEliminarModal";
import AsignaturasEstadisticas from "../components/AsignaturasEstadisticas";

export default function AsignaturasPage({
  asignaturas,
  actividades,
  eliminarAsignaturas,
  abrirModalAsignatura,
  navegar,
}) {
  const [modoEliminar, setModoEliminar] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Manejador para seleccionar o deseleccionar una asignatura
  const alternarSeleccion = (id) => {
    setSeleccionadas((actuales) =>
      actuales.includes(id)
        ? actuales.filter((item) => item !== id)
        : [...actuales, id],
    );
  };

  // Manejador para seleccionar o deseleccionar todas
  const alternarTodas = () => {
    if (seleccionadas.length === asignaturas.length) {
      setSeleccionadas([]);
    } else {
      setSeleccionadas(asignaturas.map((a) => a.id));
    }
  };

  // Manejador al confirmar eliminación
  const confirmarEliminacion = () => {
    eliminarAsignaturas(seleccionadas);
    setSeleccionadas([]);
    setMostrarConfirmacion(false);
    setModoEliminar(false);
  };

  return (
    <div className="container py-4">
      {/* Encabezado Responsivo */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Asignaturas</h1>
          <p className="text-muted mb-0">
            Gestiona tus materias y docentes a cargo.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setModoEliminar(!modoEliminar);
              setSeleccionadas([]);
            }}
          >
            {modoEliminar ? "Cancelar" : "Eliminar asignaturas"}
          </button>

          <button className="btn btn-primary" onClick={abrirModalAsignatura}>
            + Nueva Asignatura
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <AsignaturasEstadisticas
        asignaturas={asignaturas}
        actividades={actividades}
      />

      {/* Barra de acciones de eliminación */}
      {modoEliminar && asignaturas.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={alternarTodas}
          >
            {seleccionadas.length === asignaturas.length
              ? "Deseleccionar todas"
              : "Seleccionar todas"}
          </button>

          <button
            className="btn btn-danger btn-sm"
            disabled={seleccionadas.length === 0}
            onClick={() => setMostrarConfirmacion(true)}
          >
            Eliminar seleccionadas ({seleccionadas.length})
          </button>
        </div>
      )}

      {/* Grid de asignaturas */}
      {asignaturas.length === 0 ? (
        <div className="text-center py-5">
          <h5>No hay asignaturas registradas.</h5>
          <p className="text-muted">Agrega una asignatura para comenzar.</p>
        </div>
      ) : (
        <div className="row g-4">
          {asignaturas.map((asignatura) => (
            <div className="col-md-6 col-lg-4" key={asignatura.id}>
              <AsignaturaCard
                asignatura={asignatura}
                actividades={actividades}
                modoEliminar={modoEliminar}
                seleccionada={seleccionadas.includes(asignatura.id)}
                seleccionar={() => alternarSeleccion(asignatura.id)}
                navegar={navegar}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <ConfirmarEliminarModal
        visible={mostrarConfirmacion}
        alCancelar={() => setMostrarConfirmacion(false)}
        alConfirmar={confirmarEliminacion}
      />
    </div>
  );
}
