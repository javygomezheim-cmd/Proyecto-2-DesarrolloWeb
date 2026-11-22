import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";

export default function SubtareaItem({ subtarea, onAlternar, deshabilitado = false }) {
  return (
    <Pressable
      onPress={onAlternar}
      disabled={deshabilitado}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!subtarea.hecha, disabled: deshabilitado }}
      style={({ pressed }) => [
        styles.fila,
        pressed && { opacity: 0.85 },
        deshabilitado && { opacity: 0.6 },
      ]}
    >
      <Ionicons
        name={subtarea.hecha ? "checkbox" : "square-outline"}
        size={26}
        color={subtarea.hecha ? COLORES.exito : COLORES.textoSuave}
      />
      <Text style={[styles.texto, subtarea.hecha && styles.textoHecho]}>{subtarea.texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    paddingHorizontal: ESPACIO.md,
    marginBottom: ESPACIO.sm,
  },
  texto: { flex: 1, marginLeft: ESPACIO.md, fontSize: 15, color: COLORES.texto },
  textoHecho: { textDecorationLine: "line-through", color: COLORES.textoSuave },
});