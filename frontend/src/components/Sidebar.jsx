
export default function Sidebar({
  vista,
  navegar,
  abrirModalAsignatura,
  onSalir,
}) {
  return (
    <aside className="sidebar bg-dark text-white d-flex flex-column p-4">
      <h3 className="fw-bold mb-4">Mis Actividades</h3>

      <hr />

      <div className="d-grid gap-2">
        <button
          type="button"
          className={`btn text-start ${
            vista === "dashboard" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("dashboard")}
        >
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </button>

        <button
          type="button"
          className={`btn text-start ${
            vista === "lista" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("lista")}
        >
          <i className="bi bi-list-task me-2"></i>
          Actividades
        </button>

        <button
          type="button"
          className={`btn text-start ${
            vista === "asignaturas" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("asignaturas")}
        >
          <i className="bi bi-journal-bookmark me-2"></i>
          Asignaturas
        </button>

        <button
          type="button"
          className={`btn text-start ${
            vista === "calendario" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("calendario")}
        >
          <i className="bi bi-calendar3 me-2"></i>
          Calendario
        </button>

        <button
          type="button"
          className={`btn text-start ${
            vista === "historial" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("historial")}
        >
          <i className="bi bi-clock-history me-2"></i>
          Historial
        </button>

        <button
          type="button"
          className={`btn text-start ${
            vista === "libros" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("libros")}
        >
          <i className="bi bi-book me-2"></i>
          Libros
        </button>
      </div>

      <div className="mt-auto">
        <hr />

        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navegar("nueva")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nueva actividad
          </button>

          <button
            type="button"
            className="btn btn-outline-light"
            onClick={abrirModalAsignatura}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nueva asignatura
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <hr />
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onSalir}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
