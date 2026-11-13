
export default function Sidebar({
  vista,
  navegar,
  abrirModalAsignatura,
  onSalir,
}) {
  return (
    <aside className="bg-dark text-white d-flex flex-column p-4">
      <h3 className="fw-bold mb-4">Mis Actividades</h3>

      <hr />

      <div className="d-grid gap-2">
        {/* Dashboard */}
        <button
          type="button"
          className={`btn text-start ${
            vista === "dashboard" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("dashboard")}
        >
          📊 Dashboard
        </button>

        {/* Actividades */}
        <button
          type="button"
          className={`btn text-start ${
            vista === "lista" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("lista")}
        >
          📋 Actividades
        </button>

        {/* Asignaturas */}
        <button
          type="button"
          className={`btn text-start ${
            vista === "asignaturas" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("asignaturas")}
        >
          📚 Asignaturas
        </button>

        {/* Calendario */}
        <button
          type="button"
          className={`btn text-start ${
            vista === "calendario" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("calendario")}
        >
          📅 Calendario
        </button>

        {/* Historial */}
        <button
          type="button"
          className={`btn text-start ${
            vista === "historial" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("historial")}
        >
          📜 Historial
        </button>

        {/* Libros */}
        <button
          type="button"
          className={`btn text-start ${
            vista === "libros" ? "btn-primary" : "btn-outline-light"
          }`}
          onClick={() => navegar("libros")}
        >
          📖 Libros
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
            + Nueva actividad
          </button>

          <button
            type="button"
            className="btn btn-outline-light"
            onClick={abrirModalAsignatura}
          >
            + Nueva asignatura
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
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
