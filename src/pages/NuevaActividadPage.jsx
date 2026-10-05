import FormularioActividad from "../components/FormularioActividad";

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
    prioridad: "media",
    estado: "pendiente",
    subtareas: [],
  };

  function guardar(datos) {
    if (editando) {
      actualizarActividad(actividad.id, datos);
      navegar("detalle", actividad.id);
    } else {
      agregarActividad(datos);
      navegar("lista");
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
        actividadInicial={actividad ?? actividadVacia}
        asignaturas={asignaturas}
        editando={editando}
        onGuardar={guardar}
        onCancelar={cancelar}
      />
    </div>
  );
}