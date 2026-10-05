import { useState } from "react";

export default function AsignaturaModal({ visible, alCerrar, alGuardar }) {
  const [nombre, setNombre] = useState("");
  const [profesor, setProfesor] = useState("");
  const [color, setColor] = useState("#2563EB");
  const [error, setError] = useState("");

  if (!visible) return null;

  const limpiarYSalir = () => {
    setNombre("");
    setProfesor("");
    setColor("#2563EB");
    setError("");
    alCerrar();
  };

  const manejarEnvio = (e) => {
    if (e) e.preventDefault();

    if (!nombre.trim() || !profesor.trim()) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      setError("El color debe tener un formato HEX válido.");
      return;
    }

    alGuardar({
      nombre: nombre.trim(),
      profesor: profesor.trim(),
      color: color.toUpperCase(),
    });

    limpiarYSalir();
  };

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
              <h5 className="modal-title fw-bold">Nueva Asignatura</h5>
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
