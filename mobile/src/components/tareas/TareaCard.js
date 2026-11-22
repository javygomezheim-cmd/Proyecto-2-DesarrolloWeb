import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import { ETIQUETA_TIPO } from "../../constants/tareas";
import { estaVencida, textoVencimiento } from "../../utils/fechas";
import { calcularProgreso } from "../../utils/progreso";
import EstadoBadge from "../common/EstadoBadge";
import PrioridadBadge from "../common/PrioridadBadge";
import ProgresoBar from "./ProgresoBar";

export default function TareaCard({ tarea, onPress }) {
  const progreso = calcularProgreso(tarea);
  const vencida = estaVencida(tarea);
  const colorAsignatura = tarea.asignatura?.color ?? COLORES.borde;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tarjeta, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.franja, { backgroundColor: colorAsignatura }]} />
      <View style={styles.cuerpo}>
        <Text style={styles.tipo}>
          {ETIQUETA_TIPO[tarea.tipo] ?? tarea.tipo}
          {tarea.asignatura?.nombre ? ` · ${tarea.asignatura.nombre}` : ""}
        </Text>
        <Text style={styles.titulo} numberOfLines={2}>
          {tarea.titulo}
        </Text>
        <Text style={[styles.fecha, vencida && { color: COLORES.peligro, fontWeight: "700" }]}>
          {textoVencimiento(tarea)}
        </Text>

        <View style={styles.badges}>
          <EstadoBadge estado={tarea.estado} />
          <View style={styles.separador} />
          <PrioridadBadge prioridad={tarea.prioridad} />
        </View>

        <ProgresoBar
          porcentaje={progreso.porcentaje}
          etiqueta={
            progreso.tieneSubtareas
              ? `${progreso.hechas}/${progreso.total} subtareas · ${progreso.porcentaje}%`
              : `Avance ${progreso.porcentaje}%`
          }
        />
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
  tipo: { fontSize: 12, color: COLORES.textoSuave },
  titulo: { marginTop: 2, fontSize: 16, fontWeight: "700", color: COLORES.texto },
  fecha: { marginTop: 4, fontSize: 13, color: COLORES.textoSuave },
  badges: { flexDirection: "row", alignItems: "center", marginVertical: ESPACIO.sm },
  separador: { width: ESPACIO.sm },
});