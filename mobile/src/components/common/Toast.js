import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";

/**
 * Uso:
 *   const { toast, mostrar } = useToast();
 *   mostrar("Estado actualizado");            // éxito
 *   mostrar("No se pudo guardar", "error");   // error
 *   ...
 *   <Toast {...toast} />
 */
export function useToast(duracion = 2500) {
  const [toast, setToast] = useState({ visible: false, mensaje: "", tipo: "exito" });
  const temporizador = useRef(null);

  const mostrar = useCallback(
    (mensaje, tipo = "exito") => {
      if (temporizador.current) clearTimeout(temporizador.current);
      setToast({ visible: true, mensaje, tipo });
      temporizador.current = setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, duracion);
    },
    [duracion]
  );

  const ocultar = useCallback(() => {
    if (temporizador.current) clearTimeout(temporizador.current);
    setToast((t) => ({ ...t, visible: false }));
  }, []);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    []
  );

  return { toast, mostrar, ocultar };
}

export default function Toast({ visible, mensaje, tipo = "exito" }) {
  if (!visible) return null;
  return (
    <View pointerEvents="none" style={styles.zona}>
      <View
        style={[
          styles.caja,
          { backgroundColor: tipo === "error" ? COLORES.peligro : COLORES.exito },
        ]}
      >
        <Text style={styles.texto}>{mensaje}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zona: {
    position: "absolute",
    left: ESPACIO.lg,
    right: ESPACIO.lg,
    bottom: ESPACIO.xl,
    alignItems: "center",
  },
  caja: {
    paddingVertical: ESPACIO.md,
    paddingHorizontal: ESPACIO.lg,
    borderRadius: RADIO,
  },
  texto: { color: "#ffffff", fontWeight: "600", fontSize: 14, textAlign: "center" },
});