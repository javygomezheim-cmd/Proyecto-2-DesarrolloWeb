import React, { useState, useEffect } from "react";
import { obtenerFeriados } from "../services/publicApi";

export default function Calendariopage() {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [feriados, setFeriados] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  // 1. Cargar feriados de la API y actividades desde localStorage
  useEffect(() => {
    let montado = true;

    async function cargarDatos() {
      setCargando(true);
      
      // Obtener feriados desde la API
      const datosAPI = await obtenerFeriados();
      
      // Obtener actividades creadas por el usuario desde localStorage
      const actividadesGuardadas = localStorage.getItem("actividades");
      const listaActividades = actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];

      if (montado) {
        setFeriados(datosAPI);
        setActividades(listaActividades);
        setCargando(false);
      }
    }

    cargarDatos();

    // Escuchar cambios en localStorage para actualizar en tiempo real si se elimina o crea una actividad
    const manejarCambioStorage = () => {
      const actividadesGuardadas = localStorage.getItem("actividades");
      setActividades(actividadesGuardadas ? JSON.parse(actividadesGuardadas) : []);
    };

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

  // Mapear feriados por fecha "YYYY-MM-DD"
  const mapaFeriados = {};
  feriados.forEach((f) => {
    if (f && f.date) {
      mapaFeriados[f.date] = f;
    }
  });

  // Mapear actividades por fecha "YYYY-MM-DD" (admite múltiples actividades el mismo día)
  const mapaActividades = {};
  actividades.forEach((act) => {
    if (act && act.fecha) {
      if (!mapaActividades[act.fecha]) {
        mapaActividades[act.fecha] = [];
      }
      mapaActividades[act.fecha].push(act);
    }
  });

  const primerDiaMes = new Date(año, mes, 1);
  const ultimoDiaMes = new Date(año, mes + 1, 0);
  const totalDiasMes = ultimoDiaMes.getDate();
  const diaInicioSemana = (primerDiaMes.getDay() + 6) % 7;

  const celdas = [];
  for (let i = 0; i < diaInicioSemana; i++) {
    celdas.push(null);
  }
  for (let d = 1; d <= totalDiasMes; d++) {
    celdas.push(d);
  }

  const hoy = new Date();
  const esMesActual = hoy.getFullYear() === año && hoy.getMonth() === mes;

  // Filtrar eventos y feriados del mes visible
  const feriadosDelMes = feriados.filter((f) => {
    if (!f || !f.date) return false;
    const [a, m] = f.date.split("-");
    return parseInt(a, 10) === año && parseInt(m, 10) - 1 === mes;
  });

  const actividadesDelMes = actividades.filter((act) => {
    if (!act || !act.fecha) return false;
    const [a, m] = act.fecha.split("-");
    return parseInt(a, 10) === año && parseInt(m, 10) - 1 === mes;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-0">📅 Calendario Académico y Feriados</h2>
          <small className="text-muted">Feriados (Nager.Date) y tus actividades académicas</small>
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
                    if (dia === null) {
                      return <div key={`empty-${idx}`} className="p-3" />;
                    }

                    const fechaStr = formatearFechaStr(año, mes, dia);
                    const feriado = mapaFeriados[fechaStr];
                    const listaActividadesDia = mapaActividades[fechaStr] || [];
                    const esHoy = esMesActual && hoy.getDate() === dia;

                    return (
                      <div
                        key={fechaStr}
                        className={`p-2 border rounded d-flex flex-column justify-content-between align-items-start ${
                          feriado
                            ? "bg-danger bg-opacity-10 border-danger"
                            : esHoy
                            ? "bg-primary bg-opacity-10 border-primary"
                            : "bg-white"
                        }`}
                        style={{ minHeight: "95px" }}
                      >
                        <div className="d-flex justify-content-between w-100 align-items-center">
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
                                ? { width: "26px", height: "26px", display: "inline-flex", alignItems: "center", justifyContent: "center" }
                                : {}
                            }
                          >
                            {dia}
                          </span>
                          {feriado && (
                            <span className="badge bg-danger text-white" style={{ fontSize: "9px" }}>
                              🇨🇱 Feriado
                            </span>
                          )}
                        </div>

                        {/* Mostrar Feriado */}
                        {feriado && (
                          <div
                            className="mt-1 text-danger fw-bold lh-1"
                            style={{ fontSize: "11px", wordBreak: "break-word" }}
                            title={feriado.localName}
                          >
                            {feriado.localName}
                          </div>
                        )}

                        {/* Mostrar Actividades creadas */}
                        {listaActividadesDia.length > 0 && (
                          <div className="w-100 mt-1 d-flex flex-column gap-1">
                            {listaActividadesDia.map((act) => (
                              <div
                                key={act.id || act.titulo}
                                className="badge bg-info text-dark text-truncate text-start w-100 p-1"
                                style={{ fontSize: "10px", fontWeight: "500" }}
                                title={act.titulo || act.nombre}
                              >
                                📌 {act.titulo || act.nombre}
                              </div>
                            ))}
                          </div>
                        )}
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
                  {actividadesDelMes.map((act) => (
                    <li key={act.id || act.titulo} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <strong className="d-block text-dark">{act.titulo || act.nombre}</strong>
                        <small className="text-muted">📅 {act.fecha}</small>
                      </div>
                      {act.asignatura && (
                        <span className="badge bg-primary">{act.asignatura}</span>
                      )}
                    </li>
                  ))}
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