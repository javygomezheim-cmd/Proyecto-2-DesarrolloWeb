const MS_DIA = 24 * 60 * 60 * 1000;

const estaCompletada = (a) => a.completada || a.estado === "completada";

function Tarjeta({ icono, valor, etiqueta, capitalizar = false }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body d-flex align-items-center gap-3 py-3">
          <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{icono}</span>
          <div className="d-flex flex-column">
            <span
              className={`fw-bold text-dark lh-sm ${capitalizar ? "text-capitalize" : ""}`}
            >
              {valor}
            </span>
            <span className="text-muted small mt-1">{etiqueta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AsignaturasEstadisticas({ asignaturas = [], actividades = [] }) {
  const ahora = new Date();
  const limite = new Date(ahora.getTime() + 7 * MS_DIA);

  const conFecha = actividades
    .map((a) => ({ ...a, fecha: new Date(a.fechaLimite) }))
    .filter((a) => !isNaN(a.fecha.getTime()));

  const pendientes = conFecha.filter((a) => !estaCompletada(a));
  const vencidas = pendientes.filter((a) => a.fecha < ahora);
  const vigentes = pendientes
    .filter((a) => a.fecha >= ahora)
    .sort((a, b) => a.fecha - b.fecha);
  const proximos7 = vigentes.filter((a) => a.fecha <= limite);
  const proxima = vigentes[0];

  const avanceGeneral = actividades.length
    ? Math.round(
        (actividades.reduce((suma, a) => {
          if (estaCompletada(a)) return suma + 1;
          const subs = a.subtareas ?? [];
          if (subs.length === 0) return suma;
          return suma + subs.filter((s) => s.hecha).length / subs.length;
        }, 0) /
          actividades.length) *
          100,
      )
    : 0;

  const textoProxima = proxima
    ? proxima.fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    : "Sin entregas";

  return (
    <div className="row g-3 mb-4">
      <Tarjeta icono="📖" valor={asignaturas.length} etiqueta="Asignaturas activas" />
      <Tarjeta icono="📝" valor={pendientes.length} etiqueta="Pendientes" />
      <Tarjeta icono="⚠️" valor={vencidas.length} etiqueta="Vencidas" />
      <Tarjeta icono="📆" valor={proximos7.length} etiqueta="Vencen en 7 días" />
      <Tarjeta icono="⏰" valor={textoProxima} etiqueta="Próxima entrega" capitalizar />
      <Tarjeta icono="📊" valor={`${avanceGeneral}%`} etiqueta="Avance general" />
    </div>
  );
}