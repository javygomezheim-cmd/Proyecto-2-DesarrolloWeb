import { useState } from "react";

export default function ListaActividadesPage({
  actividades,
  asignaturas,
  navegar,
}) {
  const [filtro, setFiltro] = useState("todas");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  function quitarTildes(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const ahora = new Date();

  function obtenerUrgencia(fechaLimite) {
    const ahora = new Date();
    const fecha = new Date(fechaLimite);

    const diferencia = fecha - ahora;
    const dias = diferencia / (1000 * 60 * 60 * 24);

    if (dias < 0) {
      return "atrasada";
    }

    if (dias <= 2) {
      return "urgente";
    }

    if (dias <= 7) {
      return "proxima";
    }

    return "normal";
  }

  const actividadesFiltradas = actividades.filter((actividad) => {
    const textoBusqueda = quitarTildes(busqueda.toLowerCase());

    const titulo = quitarTildes(actividad.titulo.toLowerCase());
    const descripcion = quitarTildes(
      actividad.descripcion.toLowerCase()
    );
    if (actividad.completada) return false;

    if (
      textoBusqueda &&
      !titulo.includes(textoBusqueda) &&
      !descripcion.includes(textoBusqueda)
    ) {
      return false;
    }

    if (filtro === "urgente") {
      return obtenerUrgencia(actividad.fechaLimite) === "urgente";
    }

    if (filtro === "semana") {
      return obtenerUrgencia(actividad.fechaLimite) === "proxima";
    }

    if (filtro === "normal") {
      return obtenerUrgencia(actividad.fechaLimite) === "normal";
    }

    if (filtro === "atrasadas") {
      return obtenerUrgencia(actividad.fechaLimite) === "atrasada";
    }

    return true;
  });

  return (
    <div className="row align-items-start mb-4 px-3 pt-3 w-100 m-0">
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
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
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
          onClick={() => {
            setFiltro("asignaturas");
            setAsignaturaSeleccionada(null);
          }}
        >
          Asignaturas
        </button>

      </div>

      <div className="actividades-contenido d-flex gap-4 align-items-start w-100">

        <div
          className="actividades-lista border rounded p-3 flex-grow-1"
          style={{
            minWidth: 0,
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

            {filtro === "asignaturas" && !asignaturaSeleccionada ? (
              <div className="w-100">
                <h5 className="fw-bold mb-3">
                  Selecciona una asignatura
                </h5>

                <div className="d-flex flex-column gap-2">
                  {asignaturas.map((asignatura) => (
                    <button
                      key={asignatura.id}
                      className="btn btn-outline-primary text-start"
                      onClick={() =>
                        setAsignaturaSeleccionada(asignatura.id)
                      }
                    >
                      📚 {asignatura.nombre}
                    </button>
                  ))}
                </div>
              </div>
            ) : actividadesFiltradas.length === 0 ? (
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

                const urgencia = obtenerUrgencia(actividad.fechaLimite);
                if (actividad.completada) {
                  textoPrioridad = "COMPLETADA";
                  clasePrioridad = "prioridad-completada";
                }


                if (actividad.completada) {
                  textoPrioridad = "COMPLETADA";
                  clasePrioridad = "prioridad-completada";
                } else if (urgencia === "atrasada") {
                  textoPrioridad = "ATRASADA";
                  clasePrioridad = "prioridad-atrasada";
                } else if (urgencia === "urgente") {
                  textoPrioridad = "URGENTE";
                  clasePrioridad = "prioridad-urgente";
                } else if (urgencia === "proxima") {
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

        <div className="actividades-estadisticas">

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
