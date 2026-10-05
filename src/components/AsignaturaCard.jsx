export default function AsignaturaCard({
  asignatura,
  actividades,
  modoEliminar,
  seleccionada,
  seleccionar,
  navegar,
}) {
  // 1. Filtrar las actividades correspondientes a esta asignatura
  const actividadesDeMateria = actividades.filter(
    (actividad) => actividad.asignaturaId === asignatura.id,
  );
  const cantidad = actividadesDeMateria.length;

  // 2. Obtener el próximo trabajo con fecha límite más cercana
  const proximoTrabajo = (() => {
    const conFecha = actividadesDeMateria
      .filter((act) => act.fechaLimite)
      .map((act) => ({
        ...act,
        fechaObj: new Date(act.fechaLimite),
      }))
      .filter((act) => !isNaN(act.fechaObj.getTime()))
      .sort((a, b) => a.fechaObj - b.fechaObj);

    if (conFecha.length === 0) return null;

    const primerTrabajo = conFecha[0];
    const fechaFormateada = primerTrabajo.fechaObj.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
    const horaFormateada = primerTrabajo.fechaObj.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      titulo: primerTrabajo.titulo,
      fechaYHora: `${fechaFormateada}, ${horaFormateada}`,
    };
  })();

  return (
    <div
      className="card h-100 shadow-sm border-0"
      style={{
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Franja superior con el color de la asignatura */}
      <div
        style={{
          height: "8px",
          backgroundColor: asignatura.color,
        }}
      />

      <div className="card-body d-flex flex-column">
        {/* Checkbox de selección si está activo el modo eliminar */}
        {modoEliminar && (
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={seleccionada}
              onChange={seleccionar}
            />
            <label className="form-check-label">Seleccionar</label>
          </div>
        )}

        {/* Nombre de la asignatura con emoji de hoja escrita */}
        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <span>📄</span>
          <span>{asignatura.nombre}</span>
        </h4>

        {/* Profesor */}
        <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
          👨‍🏫 {asignatura.profesor}
        </p>

        {/* Cantidad de actividades */}
        <div className="mb-2">
          {cantidad > 0 ? (
            <button
              className="btn btn-link p-0 text-primary text-decoration-none"
              style={{ fontSize: "0.9rem" }}
              onClick={() => navegar && navegar("actividades", asignatura.id)}
            >
              📚 {cantidad} {cantidad === 1 ? "actividad" : "actividades"}
            </button>
          ) : (
            <span className="text-muted" style={{ fontSize: "0.9rem" }}>
              📚 Sin actividades
            </span>
          )}
        </div>

        {/* Línea de separación gris */}
        <hr className="my-2 text-secondary opacity-25" />

        {/* Próximo trabajo */}
        <div className="mb-3">
          <small
            className="text-muted d-block fw-bold text-uppercase mb-1"
            style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
          >
            Próximo trabajo
          </small>
          {proximoTrabajo ? (
            <div>
              <p
                className="mb-0 fw-semibold text-truncate text-dark"
                style={{ fontSize: "0.95rem" }}
                title={proximoTrabajo.titulo}
              >
                {proximoTrabajo.titulo}
              </p>
              <small className="text-muted">
                📅 {proximoTrabajo.fechaYHora}
              </small>
            </div>
          ) : (
            <small className="text-muted fst-italic">
              Sin entregas pendientes
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
