import { useState } from "react";
import { iniciarSesion, registrarUsuario } from "../services/api";

export default function LoginPage({ onLogin }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      if (modoRegistro) {
        await registrarUsuario(nombre, correo, password);
      }
      const usuario = await iniciarSesion(correo, password);
      onLogin(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h2 className="fw-bold mb-4 text-center">
        {modoRegistro ? "Crear cuenta" : "Iniciar sesión"}
      </h2>

      <form onSubmit={enviar} className="d-grid gap-3">
        {modoRegistro && (
          <input
            className="form-control"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        )}
        <input
          className="form-control"
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          className="form-control"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="alert alert-danger mb-0">{error}</div>}

        <button className="btn btn-primary" disabled={enviando}>
          {enviando ? "Enviando..." : modoRegistro ? "Registrarme" : "Entrar"}
        </button>
      </form>

      <button
        type="button"
        className="btn btn-link w-100 mt-3"
        onClick={() => {
          setModoRegistro(!modoRegistro);
          setError(null);
        }}
      >
        {modoRegistro ? "Ya tengo cuenta" : "No tengo cuenta, registrarme"}
      </button>
    </div>
  );
}