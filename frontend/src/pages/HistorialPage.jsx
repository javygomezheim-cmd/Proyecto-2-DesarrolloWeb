// frontend/src/pages/HistorialPage.jsx
import { useState, useEffect } from "react";
import { obtenerHistorialApi } from "../services/api";

export default function HistorialPage({ asignaturas, navegar }) {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarHistorial() {
      try {
        setCargando(true);
        const data = await obtenerHistorialApi();
        setEventos(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarHistorial();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-1">Historial</h1>
      <p className="text-muted mb-4">Registro de acciones y eventos en tu cuenta</p>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
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
              <div key={evento._id || evento.entidadId} className="card shadow-sm border-0">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-secondary text-uppercase mb-1" style={{ fontSize: "10px" }}>
                      {evento.entidad} - {evento.accion}
                    </span>
                    <h5 className="fw-bold mb-1 text-dark">{evento.titulo}</h5>
                    <small className="text-muted">📅 {fechaFormateada}</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}