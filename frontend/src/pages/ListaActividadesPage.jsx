import { useState, useEffect } from "react";
import { CLASE_PRIORIDAD, ETIQUETA_ESTADO } from "../constants/tareas";
import AsignaturasEstadisticas from "../components/AsignaturasEstadisticas";
import { obtenerHistorialApi } from "../services/api";

export default function ListaActividadesPage({
  actividades,
  asignaturas,
  filtroAsignaturaInicial,
  navegar,
}) {
  // Inicialización directa sin necesidad de useEffect
  const [filtro, setFiltro] = useState(() =>
    filtroAsignaturaInicial ? "asignaturas" : "todas",
  );

  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(
    () => filtroAsignaturaInicial || null,
  );

  const [busqueda, setBusqueda] = useState("");
  const [fechasCompletadas, setFechasCompletadas] = useState({});
  const [cargandoCompletadas, setCargandoCompletadas] = useState(false);
  const [errorCompletadas, setErrorCompletadas] = useState("");

  useEffect(() => {
    if (filtro !== "completadas") return;

    let cancelado = false;

    async function cargarFechasCompletadas() {
      try {
        setCargandoCompletadas(true);
        setErrorCompletadas("");

        const eventos = await obtenerHistorialApi("", 1000);
        const fechas = {};

        eventos.forEach((evento) => {
          if (evento.accion !== "completada" || !evento.entidadId) return;

          const fechaAnterior = fechas[evento.entidadId];

          if (
            !fechaAnterior ||
            new Date(evento.fecha) > new Date(fechaAnterior)
          ) {
            fechas[evento.entidadId] = evento.fecha;
          }
        });

        if (!cancelado) {
          setFechasCompletadas(fechas);
        }
      } catch (error) {
        if (!cancelado) {
          setErrorCompletadas(
            error.message || "No se pudieron cargar las fechas de finalización.",
          );
        }
      } finally {
        if (!cancelado) {
          setCargandoCompletadas(false);
        }
      }
    }

    cargarFechasCompletadas();

    return () => {
      cancelado = true;
    };
  }, [filtro]);

  function quitarTildes(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const ahora = new Date();

  const actividadesFiltradas = actividades.filter((actividad) => {
    const estaCompletada =
      actividad.completada || actividad.estado === "completada";

    if (filtro === "completadas") {
      return estaCompletada;
    }

    if (estaCompletada) {
      return false;
    }

    const fechaLimite = new Date(actividad.fechaLimite);
    const atrasada = fechaLimite < ahora;

    const textoBusqueda = quitarTildes(busqueda.toLowerCase());

    const titulo = quitarTildes((actividad.titulo ?? "").toLowerCase());
    const descripcion = quitarTildes((actividad.descripcion ?? "").toLowerCase());

    if (
      textoBusqueda &&
      !titulo.includes(textoBusqueda) &&
      !descripcion.includes(textoBusqueda)
    ) {
      return false;
    }

    if (filtro === "asignaturas") {
      return actividad.asignaturaId === asignaturaSeleccionada;
    }

    if (filtro === "urgente") {
      const dias = (fechaLimite - ahora) / (1000 * 60 * 60 * 24);
      return dias >= 0 && dias <= 2;
    }

    if (filtro === "semana") {
      const dias = (fechaLimite - ahora) / (1000 * 60 * 60 * 24);
      return dias > 2 && dias <= 7;
    }

    if (filtro === "normal") {
      const dias = (fechaLimite - ahora) / (1000 * 60 * 60 * 24);
      return dias > 7;
    }

    if (filtro === "atrasadas") {
      return atrasada;
    }

    return true;
  });

  const actividadesParaMostrar =
    filtro === "completadas"
      ? [...actividadesFiltradas].sort(
        (a, b) =>
          (Date.parse(fechasCompletadas[b.id] || "") || 0) -
          (Date.parse(fechasCompletadas[a.id] || "") || 0),
      )
      : actividadesFiltradas;

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

      <div className="col-12 mt-3">
        <AsignaturasEstadisticas asignaturas={asignaturas} actividades={actividades} />
      </div>

      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <button
          className={`btn btn-sm rounded-pill ${filtro === "todas" ? "btn-primary" : "filtro-boton"
            }`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "urgente" ? "btn-primary" : "filtro-boton"
            }`}
          onClick={() => setFiltro("urgente")}
        >
          Urgente
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "semana" ? "btn-primary" : "filtro-boton"
            }`}
          onClick={() => setFiltro("semana")}
        >
          Próxima
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "normal" ? "btn-primary" : "filtro-boton"
            }`}
          onClick={() => setFiltro("normal")}
        >
          Normal
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "atrasadas" ? "btn-primary" : "filtro-boton"
            }`}
          onClick={() => setFiltro("atrasadas")}
        >
          Atrasadas
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "asignaturas" ? "btn-primary" : "filtro-boton"
            }`}
          onClick={() => {
            setFiltro("asignaturas");
            setAsignaturaSeleccionada(null);
          }}
        >
          Asignaturas
        </button>

        <button
          className={`btn btn-sm rounded-pill ${filtro === "completadas" ? "btn-primary" : "filtro-boton"
            }`}
          onClick={() => setFiltro("completadas")}
        >
          Completadas
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
            ) : cargandoCompletadas && filtro === "completadas" ? (
              <p className="text-muted mt-4">Cargando actividades completadas...</p>
            ) : errorCompletadas && filtro === "completadas" ? (
              <p className="text-danger mt-4">{errorCompletadas}</p>
            ) : actividadesParaMostrar.length === 0 ? (
              <p className="text-muted mt-4">
                No hay actividades para este filtro
              </p>
            ) : (
              actividadesParaMostrar.map((actividad) => {
                const asignatura = asignaturas.find(
                  (a) => a.id === actividad.asignaturaId,
                );

                const fechaLimite = new Date(actividad.fechaLimite);

                const dias =
                  (fechaLimite - ahora) /
                  (1000 * 60 * 60 * 24);

                let textoPrioridad;
                let clasePrioridad;

                if (dias < 0) {
                  textoPrioridad = "ATRASADA";
                  clasePrioridad = "prioridad-atrasada";
                } else if (dias <= 2) {
                  textoPrioridad = "URGENTE";
                  clasePrioridad = "prioridad-urgente";
                } else if (dias <= 7) {
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
                            {actividad.tipo === "evaluacion" ? "📝 " : ""}
                            {actividad.titulo}
                          </h5>
                        </div>

                        <div className="d-flex flex-column align-items-end gap-1">
                          <span className={`badge rounded-pill ${clasePrioridad}`}>
                            {textoPrioridad}
                          </span>
                          <span
                            className={`badge rounded-pill ${CLASE_PRIORIDAD[actividad.prioridad] ?? "bg-secondary"
                              }`}
                          >
                            Prioridad {actividad.prioridad ?? "media"}
                          </span>
                          <span className="badge rounded-pill bg-light text-dark border">
                            {ETIQUETA_ESTADO[actividad.estado] ?? "Pendiente"}
                          </span>
                        </div>
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
              <h5 className="fw-bold mb-1">Actividades</h5>

              <h2 className="fw-bold mb-1">
                {actividadesParaMostrar.length}
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