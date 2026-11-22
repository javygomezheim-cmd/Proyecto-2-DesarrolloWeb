import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { setToken, setUnauthorizedHandler } from "../services/httpClient";
import { iniciarSesion } from "../services/authService";

const CLAVE_TOKEN = "agenda_token";
const CLAVE_USUARIO = "agenda_usuario";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [avisoSesion, setAvisoSesion] = useState(null);

  const limpiarSesion = useCallback(async () => {
    setToken(null);
    setUsuario(null);
    try {
      await SecureStore.deleteItemAsync(CLAVE_TOKEN);
      await SecureStore.deleteItemAsync(CLAVE_USUARIO);
    } catch {
      // Si falla el borrado, igualmente la sesión en memoria ya se cerró.
    }
  }, []);

  // Restaurar sesión guardada al abrir la app
  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const tokenGuardado = await SecureStore.getItemAsync(CLAVE_TOKEN);
        const usuarioGuardado = await SecureStore.getItemAsync(CLAVE_USUARIO);
        if (tokenGuardado && usuarioGuardado && activo) {
          setToken(tokenGuardado);
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch {
        // Sin sesión recuperable: se queda en Login.
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  // Si la API responde 401 con token, se cierra la sesión
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAvisoSesion("Tu sesión expiró. Inicia sesión nuevamente.");
      limpiarSesion();
    });
    return () => setUnauthorizedHandler(null);
  }, [limpiarSesion]);

  const login = useCallback(async (correo, password) => {
    const datos = await iniciarSesion(correo, password);
    setToken(datos.accessToken);
    try {
      await SecureStore.setItemAsync(CLAVE_TOKEN, datos.accessToken);
      await SecureStore.setItemAsync(CLAVE_USUARIO, JSON.stringify(datos.usuario));
    } catch {
      // Si no se puede persistir, la sesión funciona igual hasta cerrar la app.
    }
    setAvisoSesion(null);
    setUsuario(datos.usuario);
    return datos.usuario;
  }, []);

  const logout = useCallback(async () => {
    setAvisoSesion(null);
    await limpiarSesion();
  }, [limpiarSesion]);

  const valor = useMemo(
    () => ({ usuario, cargando, avisoSesion, login, logout }),
    [usuario, cargando, avisoSesion, login, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return contexto;
}