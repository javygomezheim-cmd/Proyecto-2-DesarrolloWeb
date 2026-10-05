import { useState, useEffect } from "react";
import { obtenerFeriados } from "../services/publicApi";
import actividadesIniciales from "../data/actividades.json";

export default function Calendariopage() {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [feriados, setFeriados] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  const cargarActividades = () => {
    const actividadesGuardadas = localStorage.getItem("actividades");
    if (actividadesGuardadas) {
      try {
        setActividades(JSON.parse(actividadesGuardadas));
      } catch (e) {
        console.error("Error al parsear actividades de localStorage", e);
        setActividades(actividadesIniciales);
      }
    } else {
      setActividades(actividadesIniciales);
      localStorage.setItem("actividades", JSON.stringify(actividadesIniciales));
    }
  };

  useEffect(() => {
    let montado = true;

    async function cargarDatos() {
      setCargando(true);
      const datosAPI = await obtenerFeriados();
      
      if (montado) {
        setFeriados(datosAPI);
        cargarActividades();
        setCargando(false);
      }
    }

    cargarDatos();

    const manejarCambioStorage = () => cargarActividades();
    window.addEventListener("storage", manejarCambioStorage);

    return () => {
      montado = false;
      window.removeEventListener("storage", manejarCambioStorage);
    };
  }, []);

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const mesAnterior = () => setFechaActual(new Date(año, mes - 1, 1));
  const mesSiguiente = () => setFechaActual(new Date(año, mes + 1, 1));
  const irAHoy = () => setFechaActual(new Date());

  const formatearFechaStr = (a, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${a}-${mm}-${dd}`;
  };

  const obtenerFechaActividad = (act) => {
    const raw = act.fechaLimite || act.fecha || act.fecha_limite;
    if (!raw) return null;
    return raw.split("T")[0];
  };

  const esCompletada = (act) => {
    return (
      act.estado === "completada" ||
      act.estado === "completado" ||
      act.completada === true ||
      act.completado === true
    );
  };

  const mapaFeriados = {};
  feriados.forEach((f) => {
    if (f && f.date) mapaFeriados[f.date] = f;
  });

  const mapaActividades = {};
  actividades.forEach((act) => {
    const fechaClave = obtenerFechaActividad(act);
    if (fechaClave) {
      if (!mapaActividades[fechaClave]) {
        mapaActividades[fechaClave] = [];
      }
      mapaActividades[fechaClave].push(act);
    }
  });

  const primerDiaMes = new Date(año, mes, 1);
  const ultimoDiaMes = new Date(año, mes + 1, 0);
  const totalDiasMes = ultimoDiaMes.getDate();
  const diaInicioSemana = (primerDiaMes.getDay() + 6) % 7;

  const celdas = [];
  for (let i = 0; i < diaInicioSemana; i++) celdas.push(null);
  for (let d = 1; d <= totalDiasMes; d++) celdas.push(d);

  const hoy = new Date();
  const esMesActual = hoy.getFullYear() === año && hoy.getMonth() === mes;

  const feriadosDelMes = feriados.filter((f) => {
    if (!f || !f.date) return false;
    const [a, m] = f.date.split("-");
    return parseInt(a, 10) === año && parseInt(m, 10) - 1 === mes;
  });

  const actividadesDelMes = actividades.filter((act) => {
    const fechaClave = obtenerFechaActividad(act);
    if (!fechaClave) return false;
    const [a, m] = fechaClave.split("-");
    return parseInt(a, 10) === año && parseInt(m, 10) - 1 === mes;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">📅 Calendario Académico y Feriados</h2>
          <small className="text-muted">Feriados y tus actividades académicas sincronizadas</small>
        </div>
        <button className="btn btn-outline-primary" onClick={irAHoy}>
          Ir a Hoy
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <button className="btn btn-outline-secondary btn-sm" onClick={mesAnterior}>
                ◀ Mes Anterior
              </button>
              <h4 className="fw-bold m-0 text-primary">
                {nombresMeses[mes]} {año}
              </h4>
              <button className="btn btn-outline-secondary btn-sm" onClick={mesSiguiente}>
                Mes Siguiente ▶
              </button>
            </div>

            <div className="card-body p-3">
              {cargando ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Cargando datos del calendario...</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                  {diasSemana.map((d, idx) => (
                    <div
                      key={d}
                      className={`text-center fw-bold py-2 rounded ${
                        idx >= 5 ? "bg-light text-danger" : "bg-light text-dark"
                      }`}
                    >
                      {d}
                    </div>
                  ))}

                  {celdas.map((dia, idx) => {
                    if (dia === null) return <div key={`empty-${idx}`} style={{ height: "120px" }} />;

                    const fechaStr = formatearFechaStr(año, mes, dia);
                    const feriado = mapaFeriados[fechaStr];
                    const listaActividadesDia = mapaActividades[fechaStr] || [];
                    const esHoy = esMesActual && hoy.getDate() === dia;

                    return (
                      <div
                        key={fechaStr}
                        className={`p-2 border rounded d-flex flex-column justify-content-start align-items-start ${
                          feriado
                            ? "bg-danger bg-opacity-10 border-danger"
                            : esHoy
                            ? "bg-primary bg-opacity-10 border-primary"
                            : "bg-white"
                        }`}
                        style={{ height: "120px", overflow: "hidden" }} // Mantiene el tamaño estricto
                      >
                        {/* Cabecera de la celda */}
                        <div className="d-flex justify-content-between w-100 align-items-center mb-1 flex-shrink-0">
                          <span
                            className={`fw-bold ${
                              esHoy
                                ? "badge bg-primary rounded-circle"
                                : feriado
                                ? "text-danger"
                                : "text-dark"
                            }`}
                            style={
                              esHoy
                                ? { width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }
                                : { fontSize: "13px" }
                            }
                          >
                            {dia}
                          </span>
                          {feriado && (
                            <span className="badge bg-danger text-white" style={{ fontSize: "8px", padding: "2px 4px" }}>
                              🇨🇱
                            </span>
                          )}
                        </div>

                        {/* Contenedor escroleable si hay muchas tareas/feriado */}
                        <div className="w-100 overflow-auto pe-1" style={{ maxHeight: "85px" }}>
                          {feriado && (
                            <div
                              className="mb-1 text-danger fw-bold lh-sm text-truncate"
                              style={{ fontSize: "10px" }}
                              title={feriado.localName}
                            >
                              🎉 {feriado.localName}
                            </div>
                          )}

                          {listaActividadesDia.map((act) => {
                            const completada = esCompletada(act);
                            return (
                              <div
                                key={act.id || act.titulo}
                                className={`badge text-truncate text-start w-100 mb-1 p-1 ${
                                  completada
                                    ? "bg-success bg-opacity-25 text-success text-decoration-line-through border border-success"
                                    : "bg-info text-dark"
                                }`}
                                style={{ fontSize: "9px", fontWeight: "500", display: "block" }}
                                title={`${act.titulo || act.nombre} ${completada ? "(Completada)" : ""}`}
                              >
                                {completada ? "✅" : "📌"} {act.titulo || act.nombre}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel lateral: Resumen del mes */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold m-0 text-dark">
                📌 Actividades de {nombresMeses[mes]}
              </h5>
            </div>
            <div className="card-body p-3">
              {actividadesDelMes.length === 0 ? (
                <p className="text-muted text-center my-3">No hay actividades programadas este mes.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {actividadesDelMes.map((act) => {
                    const completada = esCompletada(act);
                    const fechaClave = obtenerFechaActividad(act);
                    return (
                      <li key={act.id || act.titulo} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                        <div>
                          <strong className={`d-block ${completada ? "text-decoration-line-through text-muted" : "text-dark"}`}>
                            {completada ? "✅ " : ""}{act.titulo || act.nombre}
                          </strong>
                          <small className="text-muted">📅 {fechaClave}</small>
                        </div>
                        <span className={`badge ${completada ? "bg-success" : "bg-primary"}`}>
                          {completada ? "Completada" : act.estado || "Pendiente"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold m-0 text-dark">
                🇨🇱 Feriados de {nombresMeses[mes]}
              </h5>
            </div>
            <div className="card-body p-3">
              {feriadosDelMes.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <p className="mb-0">No hay feriados en este mes.</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {feriadosDelMes.map((f) => {
                    const diaFeriado = parseInt(f.date.split("-")[2], 10);
                    return (
                      <li key={f.date} className="list-group-item d-flex align-items-center gap-3 px-0 py-2">
                        <div
                          className="bg-danger text-white rounded text-center p-2 d-flex flex-column justify-content-center"
                          style={{ width: "45px", height: "45px" }}
                        >
                          <small style={{ fontSize: "9px", lineHeight: "1" }}>
                            {nombresMeses[mes].slice(0, 3).toUpperCase()}
                          </small>
                          <strong className="fs-6 lh-1">{diaFeriado}</strong>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "14px" }}>{f.localName}</h6>
                          <span className="badge bg-secondary" style={{ fontSize: "10px" }}>
                            {f.tipo}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}