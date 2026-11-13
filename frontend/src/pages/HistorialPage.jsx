import { useState, useEffect } from "react";
import { obtenerHistorialApi } from "../services/api";

const ETIQUETA_ENTIDAD = {
  asignatura: "Asignatura",
  tarea: "Tarea",
  subtarea: "Subtarea",
  evaluacion: "Evaluación",
};

export default function HistorialPage() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarHistorial() {
      try {
        setCargando(true);
        setError(null);
        setEventos(await obtenerHistorialApi());
      } catch (err) {
        setError(err.message || "No se pudo cargar el historial.");
      } finally {
        setCargando(false);
      }
    }
    cargarHistorial();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-1">Historial</h1>
      <p className="text-muted mb-4">Registro de acciones y cambios en tu cuenta</p>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-5">
          <h5>No hay eventos registrados en el historial.</h5>
          <p className="text-muted">Las acciones que realices aparecerán aquí.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {eventos.map((evento) => {
            const fechaFormateada = new Date(evento.fecha).toLocaleString("es-CL", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <div
                key={evento._id || `${evento.entidadId}-${evento.fecha}`}
                className="card shadow-sm border-0"
              >
                <div className="card-body">
                  <span
                    className="badge bg-secondary text-uppercase mb-1"
                    style={{ fontSize: "10px" }}
                  >
                    {ETIQUETA_ENTIDAD[evento.entidad] ?? evento.entidad} - {evento.accion}
                  </span>
                  <h5 className="fw-bold mb-1 text-dark">{evento.titulo}</h5>
                  {evento.detalle && (
                    <p className="mb-1 text-muted small">{evento.detalle}</p>
                  )}
                  <small className="text-muted">📅 {fechaFormateada}</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}