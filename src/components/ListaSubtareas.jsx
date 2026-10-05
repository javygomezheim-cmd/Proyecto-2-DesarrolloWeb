export default function ListaSubtareas({ subtareas, onToggle }) {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="h6 text-uppercase fw-bold">Lista de subtareas</h2>
        {subtareas.length === 0 ? (
          <p className="text-muted mb-0">Sin subtareas</p>
        ) : (
          subtareas.map((s) => (
            <div className="form-check" key={s.id}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`subtarea-${s.id}`}
                checked={s.hecha}
                onChange={() => onToggle(s.id)}
              />
              <label
                className={`form-check-label ${
                  s.hecha ? "text-decoration-line-through text-muted" : ""
                }`}
                htmlFor={`subtarea-${s.id}`}
              >
                {s.texto}
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}