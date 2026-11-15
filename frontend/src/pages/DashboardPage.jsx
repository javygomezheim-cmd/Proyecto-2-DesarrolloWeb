
export default function DashboardPage({
  actividades,
  asignaturas,
  navegar,
}) {
  const ahora = new Date();

  const completadas = actividades.filter(
    (actividad) =>
      actividad.completada || actividad.estado === "completada",
  );

  const pendientes = actividades.filter(
    (actividad) =>
      !actividad.completada && actividad.estado !== "completada",
  );

  const atrasadas = pendientes.filter((actividad) => {
    const fecha = new Date(actividad.fechaLimite);
    return !isNaN(fecha.getTime()) && fecha < ahora;
  });

  const proximas = pendientes
    .filter((actividad) => {
      const fecha = new Date(actividad.fechaLimite);
      return !isNaN(fecha.getTime()) && fecha >= ahora;
    })
    .sort(
      (a, b) =>
        new Date(a.fechaLimite) - new Date(b.fechaLimite),
    )
    .slice(0, 5);

  const progreso =
    actividades.length > 0
      ? Math.round((completadas.length / actividades.length) * 100)
      : 0;

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h2 className="fw-bold">
          <i className="bi bi-speedometer2 text-primary me-2"></i>
          Dashboard
        </h2>
        <p className="text-muted">
          Resumen general de tu actividad académica
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Total de actividades
              </p>
              <h2 className="fw-bold mb-0">{actividades.length}</h2>
              <small className="text-primary">
                <i className="bi bi-clipboard-check me-1"></i>
                Registradas
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Pendientes</p>
              <h2 className="fw-bold mb-0">{pendientes.length}</h2>
              <small className="text-warning">
                <i className="bi bi-clock me-1"></i>
                Por completar
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Atrasadas</p>
              <h2 className="fw-bold mb-0">{atrasadas.length}</h2>
              <small className="text-danger">
                <i className="bi bi-exclamation-triangle me-1"></i>
                Fuera de plazo
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <p className="text-muted mb-1">Completadas</p>
              <h2 className="fw-bold mb-0">{completadas.length}</h2>
              <small className="text-success">
                <i className="bi bi-check-circle me-1"></i>
                Finalizadas
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso general */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0">
              <i className="bi bi-graph-up-arrow text-success me-2"></i>
              Progreso general
            </h5>
            <span className="fw-bold">{progreso}%</span>
          </div>

          <div
            className="progress"
            role="progressbar"
            aria-valuenow={progreso}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ height: "12px" }}
          >
            <div
              className="progress-bar bg-success"
              style={{ width: `${progreso}%` }}
            />
          </div>

          <small className="text-muted">
            {completadas.length} de {actividades.length} actividades completadas
          </small>
        </div>
      </div>

      <div className="row g-4">
        {/* Próximas entregas */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-calendar-event text-primary me-2"></i>
                Próximas entregas
              </h5>

              {proximas.length === 0 ? (
                <p className="text-muted mb-0">
                  No tienes entregas próximas.
                </p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {proximas.map((actividad) => {
                    const asignatura = asignaturas.find(
                      (a) => a.id === actividad.asignaturaId,
                    );

                    return (
                      <button
                        key={actividad.id}
                        type="button"
                        className="btn btn-light text-start border"
                        onClick={() => navegar("detalle", actividad.id)}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <strong>{actividad.titulo}</strong>
                            <div className="small text-muted">
                              <i className="bi bi-journal-bookmark me-1"></i>
                              {asignatura?.nombre || "Sin asignatura"}
                            </div>
                          </div>

                          <small className="text-primary text-nowrap">
                            <i className="bi bi-calendar3 me-1"></i>
                            {new Date(
                              actividad.fechaLimite,
                            ).toLocaleDateString("es-CL", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                className="btn btn-outline-primary btn-sm mt-3"
                onClick={() => navegar("lista")}
              >
                Ver todas las actividades
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Resumen por asignatura */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-journal-bookmark text-primary me-2"></i>
                Progreso por asignatura
              </h5>

              {asignaturas.length === 0 ? (
                <p className="text-muted mb-0">
                  Todavía no tienes asignaturas registradas.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {asignaturas.map((asignatura) => {
                    const actividadesAsignatura = actividades.filter(
                      (actividad) =>
                        actividad.asignaturaId === asignatura.id,
                    );

                    const completadasAsignatura =
                      actividadesAsignatura.filter(
                        (actividad) =>
                          actividad.completada ||
                          actividad.estado === "completada",
                      ).length;

                    const total = actividadesAsignatura.length;

                    const porcentaje =
                      total > 0
                        ? Math.round(
                            (completadasAsignatura / total) * 100,
                          )
                        : 0;

                    return (
                      <div key={asignatura.id}>
                        <div className="d-flex justify-content-between mb-1">
                          <strong>{asignatura.nombre}</strong>
                          <small className="text-muted">
                            {completadasAsignatura}/{total}
                          </small>
                        </div>

                        <div
                          className="progress"
                          style={{ height: "8px" }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${porcentaje}%`,
                              backgroundColor:
                                asignatura.color || "#2563eb",
                            }}
                          />
                        </div>

                        <small className="text-muted">
                          {porcentaje}% completado
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="btn btn-outline-primary btn-sm mt-3"
                onClick={() => navegar("asignaturas")}
              >
                Ver asignaturas
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
