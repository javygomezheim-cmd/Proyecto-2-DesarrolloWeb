import FormularioActividad from "../components/FormularioActividad";

// Convierte la fecha ISO al formato que necesita input datetime-local
const aInputLocal = (iso) => {
  if (!iso) return "";

  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export default function NuevaActividadPage({
  actividadId,
  actividades,
  asignaturas,
  agregarActividad,
  actualizarActividad,
  navegar,
}) {
  const actividad = actividades.find((a) => a.id === actividadId);
  const editando = Boolean(actividad);

  const actividadVacia = {
    titulo: "",
    asignaturaId: asignaturas[0]?.id ?? "",
    fechaLimite: "",
    descripcion: "",
    completada: false,
    tipo: "tarea",
    prioridad: "media",
    estado: "pendiente",
    subtareas: [],
  };

  const inicial = actividad
    ? {
        titulo: actividad.titulo,
        descripcion: actividad.descripcion ?? "",
        fechaLimite: aInputLocal(actividad.fechaLimite),
        completada: actividad.completada,
        tipo: actividad.tipo ?? "tarea",
        prioridad: actividad.prioridad ?? "media",
        estado: actividad.estado ?? "pendiente",
        subtareas: actividad.subtareas ?? [],
        asignaturaId: actividad.asignatura?.id ?? actividad.asignaturaId ?? "",
      }
    : actividadVacia;

  async function guardar(datos) {
    const payload = {
      ...datos,
      fechaLimite: datos.fechaLimite
        ? new Date(datos.fechaLimite).toISOString()
        : "",
    };

    if (editando) {
      const ok = await actualizarActividad(actividad.id, payload);
      if (ok) navegar("detalle", actividad.id);
    } else {
      const ok = await agregarActividad(payload);
      if (ok) navegar("lista");
    }
  }

  function cancelar() {
    if (editando) navegar("detalle", actividad.id);
    else navegar("lista");
  }

  return (
    <div className="p-4">
      <h1 className="h2 fw-bold">
        {editando ? "Editar actividad" : "Nueva actividad"}
      </h1>

      <FormularioActividad
        key={actividadId}
        actividadInicial={inicial}
        asignaturas={asignaturas}
        editando={editando}
        onGuardar={guardar}
        onCancelar={cancelar}
      />
    </div>
  );
}