export default function AsignaturasEstadisticas({ asignaturas, actividades }) {
  // 1. Total de asignaturas activas
  const totalAsignaturas = asignaturas.length;

  // 2. Total de actividades registradas
  const totalActividades = actividades.filter(
    (act) => !act.completada && act.estado !== "completada",
  ).length;

  // 3. Próxima entrega (solo día y mes)
  const fechaProxima = (() => {
    if (!actividades || actividades.length === 0) return "Sin entregas";

    const conFecha = actividades
      .filter((act) => act.fechaLimite)
      .map((act) => new Date(act.fechaLimite))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a - b);

    if (conFecha.length === 0) return "Sin entregas";

    const proxima = conFecha[0];
    return proxima.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  })();

  return (
    <div className="row g-3 mb-4">
      {/* 1. Asignaturas activas */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body d-flex align-items-center gap-3 py-3">
            <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>📖</span>
            <div className="d-flex flex-column">
              <span className="fw-bold text-dark lh-sm">
                {totalAsignaturas}
              </span>
              <span className="text-muted small mt-1">Asignaturas activas</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Actividades registradas */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body d-flex align-items-center gap-3 py-3">
            <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>📝</span>
            <div className="d-flex flex-column">
              <span className="fw-bold text-dark lh-sm">
                {totalActividades}
              </span>
              <span className="text-muted small mt-1">
                Actividades registradas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Próxima entrega */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-body d-flex align-items-center gap-3 py-3">
            <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>⏰</span>
            <div className="d-flex flex-column">
              <span className="fw-bold text-dark lh-sm text-capitalize">
                {fechaProxima}
              </span>
              <span className="text-muted small mt-1">Próxima entrega</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
