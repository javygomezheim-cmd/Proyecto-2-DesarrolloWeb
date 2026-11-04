export default function ConfirmarEliminarModal({
  visible,
  alCancelar,
  alConfirmar,
}) {
  if (!visible) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-body text-center p-4">
            <h5 className="fw-bold">¿Estás seguro?</h5>
            <p className="text-muted">
              Se eliminarán las asignaturas seleccionadas.
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-secondary" onClick={alCancelar}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={alConfirmar}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}