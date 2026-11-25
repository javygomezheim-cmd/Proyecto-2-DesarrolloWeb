import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";

// variante: "primario" | "secundario" | "peligro"
export default function PrimaryButton({
  titulo,
  onPress,
  cargando = false,
  deshabilitado = false,
  variante = "primario",
  style,
}) {
  const inactivo = cargando || deshabilitado;
  const esSecundario = variante === "secundario";
  const fondo =
    variante === "peligro"
      ? COLORES.peligro
      : esSecundario
      ? COLORES.superficie
      : COLORES.primario;
  const colorTexto = esSecundario ? COLORES.primario : "#ffffff";

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [
        styles.boton,
        { backgroundColor: fondo },
        esSecundario && styles.secundario,
        pressed && !inactivo && { opacity: 0.85 },
        inactivo && { opacity: 0.55 },
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <Text style={[styles.texto, { color: colorTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: 48,
    paddingHorizontal: ESPACIO.xl,
    borderRadius: RADIO,
    alignItems: "center",
    justifyContent: "center",
  },
  secundario: { borderWidth: 1, borderColor: COLORES.primario },
  texto: { fontSize: 16, fontWeight: "600" },
});