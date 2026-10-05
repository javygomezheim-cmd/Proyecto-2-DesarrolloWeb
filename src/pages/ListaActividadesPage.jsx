import { useState } from "react";

export default function ListaActividadesPage({
  actividades,
  asignaturas,
  navegar,
}) {
  const [filtro, setFiltro] = useState("todas");

  return (
    <div className="container py-4">

      {/* Título y búsqueda */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">Mis Actividades</h1>

          <p className="text-muted mb-0">
            Organiza y revisa tus actividades académicas
          </p>
        </div>

        <div className="ms-4" style={{ width: "280px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar actividad"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="d-flex align-items-center gap-2 mb-3">

        <button
          className={`btn btn-sm rounded-pill ${
            filtro === "todas"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>

        <button
          className={`btn btn-sm rounded-pill ${
            filtro === "urgente"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => setFiltro("urgente")}
        >
          Urgente (Próximas 24h)
        </button>

        <button
          className={`btn btn-sm rounded-pill ${
            filtro === "semana"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => setFiltro("semana")}
        >
          Próxima (Esta semana)
        </button>

        <button
          className={`btn btn-sm rounded-pill ${
            filtro === "asignaturas"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => setFiltro("asignaturas")}
        >
          Asignaturas
        </button>

      </div>

      {/* Actividades + resumen */}
      <div className="d-flex align-items-start gap-4">

        {/* Bloque de actividades */}
        <div
          className="card shadow-sm border-0 flex-grow-1"
          style={{ height: "550px" }}
        >
          <div className="card-body">

            <div
              style={{
                height: "500px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >

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
                <div className="d-flex flex-column gap-3">

                  {actividades.map((actividad) => (
                    <div
                      className="card border shadow-sm"
                      key={actividad.id}
                      style={{ width: "85%" }}
                    >

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
                  ))}

                </div>
              )}

            </div>

          </div>
        </div>

        {/* Resumen */}
        <div
          style={{
            width: "220px",
            flexShrink: 0,
          }}
        >
          <div className="card shadow-sm border-0">

            <div className="card-body">

              <h5 className="fw-bold mb-1">
                Actividades
              </h5>

              <h2 className="fw-bold mb-1">
                {actividades.length}
              </h2>

              <p className="mb-0 text-muted">
                Actividades registradas
              </p>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
