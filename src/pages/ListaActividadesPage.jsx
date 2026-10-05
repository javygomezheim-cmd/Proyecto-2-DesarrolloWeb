export default function ListaActividadesPage({
  actividades,
  asignaturas,
  navegar,
}) {
  return (
    <div className="container py-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">Mis Actividades</h1>
          <p className="text-muted mb-0">
            Organiza y revisa tus actividades académicas
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navegar("nueva")}
        >
          + Nueva actividad
        </button>
      </div>

      {/* Resumen */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Actividades</h6>
              <h2 className="fw-bold">{actividades.length}</h2>
              <p className="mb-0 text-muted">
                Actividades registradas
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Asignaturas</h6>
              <h2 className="fw-bold">{asignaturas.length}</h2>
              <p className="mb-0 text-muted">
                Asignaturas registradas
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Estado</h6>
              <h2 className="fw-bold">Activo</h2>
              <p className="mb-0 text-muted">
                Organiza tus pendientes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actividades */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold mb-0">Actividades académicas</h3>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navegar("asignaturas")}
            >
              Ver asignaturas
            </button>
          </div>

          {actividades.length === 0 ? (
            <div className="text-center py-5">
              <h5>No tienes actividades registradas</h5>
              <p className="text-muted">
                Agrega una nueva actividad para comenzar.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navegar("nueva")}
              >
                Crear actividad
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {actividades.map((actividad) => (
                <div className="col-md-6 col-lg-4" key={actividad.id}>
                  <div className="card h-100 border">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">
                        {actividad.titulo}
                      </h5>

                      <p className="card-text text-muted">
                        {actividad.descripcion || "Sin descripción"}
                      </p>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navegar("detalle", actividad.id)
                        }
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
