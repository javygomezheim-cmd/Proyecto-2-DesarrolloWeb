import { useState, useEffect } from "react";

export default function AsignaturaModal({ visible, alCerrar, alGuardar, asignaturaEditar, }) {
  const [nombre, setNombre] = useState("");
  const [profesor, setProfesor] = useState("");
  const [color, setColor] = useState("#2563EB");
  const [periodo, setPeriodo] = useState("2026-2");
  const [error, setError] = useState("");

  useEffect(() => {
    if (asignaturaEditar) {
      setNombre(asignaturaEditar.nombre || "");
      setProfesor(asignaturaEditar.profesor || "");
      setColor(asignaturaEditar.color || "#2563EB");
      setPeriodo(asignaturaEditar.periodo || "2026-2");
    } else {
      setNombre("");
      setProfesor("");
      setColor("#2563EB");
      setPeriodo("2026-2");
    }

    setError("");
  }, [asignaturaEditar, visible]);

  if (!visible) return null;

  const limpiarYSalir = () => {
    setNombre("");
    setProfesor("");
    setColor("#2563EB");
    setPeriodo("2026-2");
    setError("");
    alCerrar();
  };

  async function manejarEnvio(e) {
    e.preventDefault();

    setError("");

    if (!nombre.trim() || !profesor.trim()) {
      setError("El nombre y el profesor son obligatorios.");
      return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      setError("El color debe tener un formato hexadecimal válido.");
      return;
    }

    if (!/^\d{4}-[12]$/.test(periodo)) {
      setError("El período debe tener el formato AAAA-1 o AAAA-2.");
      return;
    }

    const resultado = await alGuardar({
      nombre: nombre.trim(),
      profesor: profesor.trim(),
      color: color.toUpperCase(),
      periodo,
    });

    if (resultado !== false) {
      limpiarYSalir();
    }
  }

  return (
    <>
      {/* Fondo oscuro con capa inferior */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={limpiarYSalir}
      />

      {/* Ventana modal con capa superior y foco habilitado */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header">
              <h5 className="modal-title">
                {asignaturaEditar ? "Editar Asignatura" : "Nueva Asignatura"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={limpiarYSalir}
              />
            </div>

            <form onSubmit={manejarEnvio}>
              <div className="modal-body">
                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nombre de la asignatura *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Matemáticas"
                    autoFocus
                  />
                </div>

                {/* Profesor */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Profesor *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profesor}
                    onChange={(e) => setProfesor(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                {/* Período académico */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Período académico *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    placeholder="Ej: 2026-2"
                    maxLength={6}
                  />
                </div>

                {/* Color */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Color *</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="#2563EB"
                    />

                    {/* Contenedor circular */}
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        minWidth: "38px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "1px solid #ced4da",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{
                          border: "none",
                          width: "150%",
                          height: "150%",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2 mb-0">{error}</div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarYSalir}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {asignaturaEditar ? "Guardar cambios" : "Crear asignatura"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
