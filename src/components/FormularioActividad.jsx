import { useState } from "react";

export default function FormularioActividad({
  actividadInicial,
  asignaturas,
  editando,
  onGuardar,
  onCancelar,
}) {
  const [formulario, setFormulario] = useState(actividadInicial);
  const [textoSubtarea, setTextoSubtarea] = useState("");

  function handleChange(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  function agregarSubtarea() {
    const texto = textoSubtarea.trim();
    if (!texto) return;
    const nueva = { id: Date.now(), texto, hecha: false };
    setFormulario({ ...formulario, subtareas: [...formulario.subtareas, nueva] });
    setTextoSubtarea("");
  }

  function quitarSubtarea(id) {
    setFormulario({
      ...formulario,
      subtareas: formulario.subtareas.filter((s) => s.id !== id),
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar({ ...formulario, asignaturaId: Number(formulario.asignaturaId) });
  }

  return (
    <form className="card card-body" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label htmlFor="titulo" className="form-label">Nombre de la actividad</label>
          <input
            id="titulo"
            name="titulo"
            className="form-control"
            placeholder="Ej. Proyecto Final, Ensayo, Examen..."
            value={formulario.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="asignaturaId" className="form-label">Asignatura</label>
          <select
            id="asignaturaId"
            name="asignaturaId"
            className="form-select"
            value={formulario.asignaturaId}
            onChange={handleChange}
          >
            {asignaturas.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="fechaLimite" className="form-label">Fecha y hora de entrega</label>
          <input
            id="fechaLimite"
            name="fechaLimite"
            type="datetime-local"
            className="form-control"
            value={formulario.fechaLimite}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="prioridad" className="form-label">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            className="form-select"
            value={formulario.prioridad}
            onChange={handleChange}
          >
            <option value="alta">Urgente</option>
            <option value="media">Próxima</option>
            <option value="baja">Normal</option>
          </select>
        </div>

        {editando && (
          <div className="col-md-3">
            <label htmlFor="estado" className="form-label">Estado</label>
            <select
              id="estado"
              name="estado"
              className="form-select"
              value={formulario.estado}
              onChange={handleChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
        )}

        <div className="col-12">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            className="form-control"
            placeholder="Escribe los detalles de la entrega aquí..."
            value={formulario.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label htmlFor="subtarea" className="form-label">Subtareas</label>
          <div className="input-group">
            <input
              id="subtarea"
              className="form-control"
              placeholder="Añadir una subtarea nueva..."
              value={textoSubtarea}
              onChange={(e) => setTextoSubtarea(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarSubtarea();
                }
              }}
            />
            <button type="button" className="btn btn-outline-primary" onClick={agregarSubtarea}>
              +
            </button>
          </div>

          <ul className="list-group mt-2">
            {formulario.subtareas.map((s) => (
              <li key={s.id} className="list-group-item d-flex justify-content-between">
                {s.texto}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => quitarSubtarea(s.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary">
          {editando ? "Guardar cambios" : "Guardar actividad"}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}