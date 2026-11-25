import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO } from "../../constants/tema";

export default function DiaSeccion({ titulo, cantidad, esHoy = false, esPasado = false }) {
  return (
    <View style={styles.contenedor}>
      <Text style={[styles.titulo, esHoy && styles.hoy, esPasado && styles.pasado]}>
        {titulo}
      </Text>
      <View style={styles.derecha}>
        {esHoy ? <Text style={styles.etiquetaHoy}>HOY</Text> : null}
        <Text style={styles.cantidad}>{cantidad}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ESPACIO.sm,
    paddingHorizontal: ESPACIO.xs,
    backgroundColor: COLORES.fondo,
  },
  titulo: { fontSize: 15, fontWeight: "800", color: COLORES.texto },
  hoy: { color: COLORES.primario },
  pasado: { color: COLORES.textoSuave },
  derecha: { flexDirection: "row", alignItems: "center" },
  etiquetaHoy: {
    backgroundColor: COLORES.primario,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginRight: ESPACIO.sm,
    overflow: "hidden",
  },
  cantidad: { fontSize: 13, color: COLORES.textoSuave },
});