import { useState } from "react";

function LibrosPage({ asignaturas }) {
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscarLibros = async () => {
    if (!busqueda.trim()) {
      setError("Escribe el nombre de un libro o tema para buscar.");
      return;
    }

    setCargando(true);
    setError("");
    setLibros([]);

    try {
      const params = new URLSearchParams({
        q: busqueda,
        limit: "12",
        fields:
          "key,title,author_name,first_publish_year,cover_i,isbn,subject"
      });

      const respuesta = await fetch(
        `https://openlibrary.org/search.json?${params.toString()}`
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo conectar con Open Library.");
      }

      const datos = await respuesta.json();

      setLibros(datos.docs || []);

      if (!datos.docs || datos.docs.length === 0) {
        setError("No se encontraron libros para esa búsqueda.");
      }
    } catch (error) {
      console.error(error);
      setError("Ocurrió un error al buscar los libros.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">📖 Buscar libros</h1>

      <div className="card shadow-sm p-4 mb-4">
        <div className="row g-3">

          {/* Asignatura */}
          <div className="col-md-4">
            <label className="form-label fw-bold">
              Asignatura
            </label>

            <select
              className="form-select"
              value={asignaturaSeleccionada}
              onChange={(e) =>
                setAsignaturaSeleccionada(e.target.value)
              }
            >
              <option value="">Selecciona una asignatura</option>

              {asignaturas.map((asignatura) => (
                <option
                  key={asignatura.id}
                  value={asignatura.nombre}
                >
                  {asignatura.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Búsqueda */}
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Buscar libro
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Ej: cálculo, programación, física..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarLibros();
                }
              }}
            />
          </div>

          {/* Botón */}
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              onClick={buscarLibros}
              disabled={cargando}
            >
              {cargando ? "Buscando..." : "🔎 Buscar"}
            </button>
          </div>
        </div>

        {/* Información de asignatura */}
        {asignaturaSeleccionada && (
          <div className="alert alert-info mt-3 mb-0">
            Buscando libros para:{" "}
            <strong>{asignaturaSeleccionada}</strong>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-warning">
          {error}
        </div>
      )}

      {/* Resultados */}
      {libros.length > 0 && (
        <>
          <h2 className="mb-3">
            Resultados ({libros.length})
          </h2>

          <div className="row g-4">
            {libros.map((libro, index) => {
              const portada = libro.cover_i
                ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
                : null;

              return (
                <div
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  key={`${libro.key}-${index}`}
                >
                  <div className="card h-100 shadow-sm">

                    {portada ? (
                      <img
                        src={portada}
                        className="card-img-top"
                        alt={`Portada de ${libro.title}`}
                        style={{
                          height: "280px",
                          objectFit: "contain",
                          padding: "10px"
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{ height: "280px" }}
                      >
                        <span className="text-muted">
                          Sin portada
                        </span>
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">

                      <h5 className="card-title">
                        {libro.title}
                      </h5>

                      <p className="card-text mb-1">
                        <strong>Autor:</strong>{" "}
                        {libro.author_name
                          ? libro.author_name.slice(0, 2).join(", ")
                          : "Desconocido"}
                      </p>

                      <p className="card-text text-muted">
                        <strong>Año:</strong>{" "}
                        {libro.first_publish_year || "Desconocido"}
                      </p>

                      <a
                        href={`https://openlibrary.org${libro.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary mt-auto"
                      >
                        Ver en Open Library
                      </a>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default LibrosPage;