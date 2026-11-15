import "../styles/DetalleActividad.css";
import ListaSubtareas from "../components/ListaSubtareas";
import { CLASE_PRIORIDAD, ETIQUETA_ESTADO } from "../constants/tareas";

export default function DetalleActividadPage({
  actividadId,
  actividades,
  asignaturas,
  toggleSubtarea,
  toggleCompletada,
  eliminarActividad,
  navegar,
}) {
  const actividad = actividades.find((a) => a.id === actividadId);

  if (!actividad) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">No se encontró la actividad.</div>

        <button
          className="btn btn-primary"
          onClick={() => navegar("lista")}
        >
          Volver a actividades
        </button>
      </div>
    );
  }

  const asignatura = asignaturas.find(
    (s) => s.id === actividad.asignaturaId
  );

  const fecha = new Date(actividad.fechaLimite);

  const dia = fecha.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const hora = fecha.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  function obtenerUrgencia(fechaLimite) {
    const ahora = new Date();
    const fecha = new Date(fechaLimite);

    const diferencia = fecha - ahora;
    const dias = diferencia / (1000 * 60 * 60 * 24);

    if (dias < 0) {
      return {
        texto: "ATRASADA",
        clase: "prioridad-atrasada",
      };
    }

    if (dias <= 2) {
      return {
        texto: "URGENTE",
        clase: "prioridad-urgente",
      };
    }

    if (dias <= 7) {
      return {
        texto: "PRÓXIMA",
        clase: "prioridad-proxima",
      };
    }

    return {
      texto: "NORMAL",
      clase: "prioridad-normal",
    };
  }

  const urgencia = actividad.completada
    ? {
        texto: "COMPLETADA",
        clase: "prioridad-completada",
      }
    : obtenerUrgencia(actividad.fechaLimite);

  const subtareas = actividad.subtareas ?? [];
  const hechas = subtareas.filter((s) => s.hecha).length;
  const avance = subtareas.length
    ? Math.round((hechas / subtareas.length) * 100)
    : actividad.completada
      ? 100
      : 0;

  function handleEliminar() {
    if (window.confirm("¿Eliminar esta actividad?")) {
      eliminarActividad(actividad.id);
      navegar("lista");
    }
  }

  return (
    <div className="p-4">
      <button
        type="button"
        className="btn btn-link p-0 mb-3 text-decoration-none"
        onClick={() => navegar("lista")}
      >
        ← Atrás a actividades
      </button>

      <p className="text-primary fw-semibold small text-uppercase mb-1">
        {asignatura?.nombre}
      </p>

      <h1 className="h2 fw-bold">{actividad.titulo}</h1>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        <span className={`badge ${urgencia.clase}`}>{urgencia.texto}</span>
        <span className="badge bg-dark">
          {actividad.tipo === "evaluacion" ? "Evaluación" : "Tarea"}
        </span>
        <span className={`badge ${CLASE_PRIORIDAD[actividad.prioridad] ?? "bg-secondary"}`}>
          Prioridad {actividad.prioridad ?? "media"}
        </span>
        <span className="badge bg-secondary">
          {ETIQUETA_ESTADO[actividad.estado] ?? "Pendiente"}
        </span>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 order-lg-2">
          <div className="card">
            <div className="card-body">
              <p className="small text-uppercase text-muted mb-0">
                Fecha límite
              </p>

              <p className="fw-semibold">
                {dia}, {hora}
              </p>

              <hr />

              <p className="small text-uppercase text-muted mb-0">
                Profesor
              </p>

              <p className="fw-semibold mb-0">
                {asignatura?.profesor}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-8 order-lg-1">
          <h2 className="h6 text-uppercase fw-bold">
            Descripción
          </h2>

          <p className="text-muted">
            {actividad.descripcion}
          </p>

          <div className="mb-3">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>Avance</span>
              <span>{hechas}/{subtareas.length} subtareas · {avance}%</span>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-valuenow={avance}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div className="progress-bar" style={{ width: `${avance}%` }} />
            </div>
          </div>
          
          <ListaSubtareas
            subtareas={actividad.subtareas}
            onToggle={(idSubtarea) =>
              toggleSubtarea(actividad.id, idSubtarea)
            }
          />

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="actividadCompletada"
              checked={actividad.completada}
              onChange={() => toggleCompletada(actividad.id)}
            />

            <label
              className="form-check-label fw-semibold"
              htmlFor="actividadCompletada"
            >
              Marcar como completada
            </label>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navegar("nueva", actividad.id)}
            >
              Editar actividad
            </button>

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleEliminar}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}