import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Ejecuta una función async (normalmente un servicio) y maneja carga/error.
 *
 * const { data, loading, error, refrescando, recargar, refrescar, setData } =
 *   useAsync(() => obtenerTareas());
 *
 * - loading: primera carga o recarga completa (mostrar <LoadingView />)
 * - refrescando: pull-to-refresh (usar en <RefreshControl refreshing=... />)
 * - alEnfocar (por defecto true): al volver a la pantalla recarga en silencio,
 *   así las listas muestran los cambios hechos en una pantalla de detalle.
 */
export function useAsync(funcion, deps = [], { alEnfocar = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  const funcionRef = useRef(funcion);
  funcionRef.current = funcion;
  const montado = useRef(true);
  const primerEnfoque = useRef(true);

  const ejecutar = useCallback(async (modo = "carga") => {
    if (modo === "carga") setLoading(true);
    if (modo === "refresco") setRefrescando(true);
    if (modo !== "silencioso") setError(null);

    try {
      const resultado = await funcionRef.current();
      if (montado.current) {
        setData(resultado);
        setError(null);
      }
    } catch (e) {
      if (montado.current && modo !== "silencioso") {
        setError(e?.message || "Ocurrió un error inesperado.");
      }
    } finally {
      if (montado.current) {
        setLoading(false);
        setRefrescando(false);
      }
    }
  }, []);

  useEffect(() => {
    montado.current = true;
    ejecutar("carga");
    return () => {
      montado.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ejecutar, ...deps]);

  useFocusEffect(
    useCallback(() => {
      if (primerEnfoque.current) {
        primerEnfoque.current = false;
        return;
      }
      if (alEnfocar) ejecutar("silencioso");
    }, [alEnfocar, ejecutar])
  );

  return {
    data,
    loading,
    error,
    refrescando,
    recargar: () => ejecutar("carga"),
    refrescar: () => ejecutar("refresco"),
    setData,
  };
}