import { useState } from "react";

export default function ListaActividadesPage({
  actividades,
  asignaturas,
  navegar,
}) {
  const [filtro, setFiltro] = useState("todas");

  const ahora = new Date();

  const actividadesFiltradas = actividades.filter((actividad) => {
    const fechaLimite = new Date(actividad.fechaLimite);
    const atrasada = fechaLimite < ahora;

    if (filtro === "urgente") {
      return actividad.prioridad === "alta" && !atrasada;
    }

    if (filtro === "semana") {
      return actividad.prioridad === "media" && !atrasada;
    }

    if (filtro === "normal") {
      return actividad.prioridad === "baja" && !atrasada;
    }

    if (filtro === "atrasadas") {
      return atrasada;
    }

    return true;
  });

  return (
    <div className="row align-items-start mb-4 px-3 pt-3">
      <div className="col-12 col-md-7">
        <h2 className="fw-bold mb-1">Mis Actividades</h2>

        <p className="text-muted mb-0">
          Organiza y revisa tus actividades académicas
        </p>
      </div>

      <div className="col-12 col-md-5 mt-3 mt-md-0">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Buscar actividades..."
        />
      </div>



      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">

        <button
          className={`btn btn-sm rounded-pill ${filtro === "todas"
            ? "btn-primary"
            : "filtro-boton"
            }`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "urgente"
            ? "btn-primary"
            : "filtro-boton"
            }`}
          onClick={() => setFiltro("urgente")}
        >
          Urgente
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "semana"
            ? "btn-primary"
            : "filtro-boton"
            }`}
          onClick={() => setFiltro("semana")}
        >
          Próxima
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "normal"
            ? "btn-primary"
            : "filtro-boton"
            }`}
          onClick={() => setFiltro("normal")}
        >
          Normal
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "atrasadas"
            ? "btn-primary"
            : "filtro-boton"
            }`}
          onClick={() => setFiltro("atrasadas")}
        >
          Atrasadas
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "asignaturas"
            ? "btn-primary"
            : "filtro-boton"
            }`}
          onClick={() => setFiltro("asignaturas")}
        >
          Asignaturas
        </button>

      </div>

      <div className="d-flex gap-4 align-items-start">

        <div
          className="border rounded p-3"
          style={{
            width: "calc(100% - 240px)",
            height: "550px",
          }}
        >
          <div
            className="d-flex flex-column align-items-center gap-3"
            style={{
              height: "500px",
              overflowY: "auto",
            }}
          >
            {actividadesFiltradas.length === 0 ? (
              <p className="text-muted mt-4">
                No hay actividades para este filtro
              </p>
            ) : (
              actividadesFiltradas.map((actividad) => {
                const asignatura = asignaturas.find(
                  (a) => a.id === actividad.asignaturaId
                );

                const fechaLimite = new Date(
                  actividad.fechaLimite
                );

                const atrasada = fechaLimite < ahora;

                let textoPrioridad;
                let clasePrioridad;

                if (atrasada) {
                  textoPrioridad = "ATRASADA";
                  clasePrioridad = "prioridad-atrasada";
                } else if (actividad.prioridad === "alta") {
                  textoPrioridad = "URGENTE";
                  clasePrioridad = "prioridad-urgente";
                } else if (actividad.prioridad === "media") {
                  textoPrioridad = "PRÓXIMA";
                  clasePrioridad = "prioridad-proxima";
                } else {
                  textoPrioridad = "NORMAL";
                  clasePrioridad = "prioridad-normal";
                }

                return (
                  <div
                    className="card border shadow-sm"
                    key={actividad.id}
                    style={{
                      width: "85%",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navegar("detalle", actividad.id)
                    }
                  >
                    <div className="card-body">

                      <div className="d-flex justify-content-between align-items-start">

                        <div>
                          <p
                            className="mb-2 fw-semibold"
                            style={{
                              color:
                                asignatura?.color || "#2563eb",
                            }}
                          >
                            {asignatura?.nombre ||
                              "Sin asignatura"}
                          </p>

                          <h5 className="card-title fw-bold mb-2">
                            {actividad.titulo}
                          </h5>
                        </div>

                        <span
                          className={`badge rounded-pill ${clasePrioridad}`}
                        >
                          {textoPrioridad}
                        </span>

                      </div>

                      <p className="card-text text-muted mb-3">
                        {actividad.descripcion ||
                          "Sin descripción"}
                      </p>

                      <p className="text-muted mb-0">
                        📅 Fecha límite:{" "}
                        {fechaLimite.toLocaleString("es-CL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

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