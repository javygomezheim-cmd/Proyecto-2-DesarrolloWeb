import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";

export default function AsignaturaCard({ asignatura, pendientes, total, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tarjeta, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.franja, { backgroundColor: asignatura.color }]} />
      <View style={styles.cuerpo}>
        <Text style={styles.nombre}>{asignatura.nombre}</Text>
        <Text style={styles.detalle}>
          Prof. {asignatura.profesor} · {asignatura.periodo}
        </Text>
        <Text style={styles.conteo}>
          {total === 0 ? "Sin actividades" : `${pendientes} por hacer de ${total}`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    marginBottom: ESPACIO.md,
    overflow: "hidden",
  },
  franja: { width: 8 },
  cuerpo: { flex: 1, padding: ESPACIO.lg },
  nombre: { fontSize: 17, fontWeight: "700", color: COLORES.texto },
  detalle: { marginTop: 2, fontSize: 13, color: COLORES.textoSuave },
  conteo: { marginTop: ESPACIO.sm, fontSize: 13, fontWeight: "600", color: COLORES.primario },
});