export default function HistorialPage({
  actividades,
  asignaturas,
  navegar,
}) {
  const actividadesCompletadas = actividades.filter(
    (actividad) => actividad.completada
  );

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-1">Historial</h1>

      <p className="text-muted mb-4">
        Actividades que has completado
      </p>

      {actividadesCompletadas.length === 0 ? (
        <div className="text-center py-5">
          <h5>No hay actividades completadas.</h5>

          <p className="text-muted">
            Las actividades que marques como completadas aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {actividadesCompletadas.map((actividad) => {
            const asignatura = asignaturas.find(
              (a) => a.id === actividad.asignaturaId
            );

            return (
              <div
                key={actividad.id}
                className="card shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => navegar("detalle", actividad.id)}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <p
                        className="mb-1 fw-semibold"
                        style={{
                          color: asignatura?.color || "#2563eb",
                        }}
                      >
                        {asignatura?.nombre || "Sin asignatura"}
                      </p>

                      <h5 className="fw-bold mb-2">
                        {actividad.titulo}
                      </h5>
                    </div>

                    <span className="badge badge-completada">
                      Completada
                    </span>
                  </div>

                  <p className="text-muted mb-0">
                    {actividad.descripcion || "Sin descripción"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}