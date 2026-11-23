import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import { ETIQUETA_TIPO } from "../../constants/tareas";
import { estaVencida, formatearHora, textoVencimiento } from "../../utils/fechas";
import { calcularProgreso } from "../../utils/progreso";
import EstadoBadge from "../common/EstadoBadge";

export default function AgendaItem({ tarea, onPress }) {
  const progreso = calcularProgreso(tarea);
  const vencida = estaVencida(tarea);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fila, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.columnaHora}>
        <Text style={styles.hora}>{formatearHora(tarea.fechaLimite)}</Text>
      </View>
      <View style={[styles.franja, { backgroundColor: tarea.asignatura?.color ?? COLORES.borde }]} />
      <View style={styles.cuerpo}>
        <Text style={styles.titulo} numberOfLines={2}>
          {tarea.titulo}
        </Text>
        <Text style={styles.detalle}>
          {ETIQUETA_TIPO[tarea.tipo] ?? tarea.tipo}
          {tarea.asignatura?.nombre ? ` · ${tarea.asignatura.nombre}` : ""}
        </Text>
        {vencida ? (
          <Text style={styles.vencida}>{textoVencimiento(tarea)}</Text>
        ) : progreso.tieneSubtareas ? (
          <Text style={styles.detalle}>
            {progreso.hechas}/{progreso.total} subtareas
          </Text>
        ) : null}
        <View style={styles.badge}>
          <EstadoBadge estado={tarea.estado} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    marginBottom: ESPACIO.sm,
    overflow: "hidden",
  },
  columnaHora: { width: 56, alignItems: "center", justifyContent: "center" },
  hora: { fontSize: 13, fontWeight: "700", color: COLORES.textoSuave },
  franja: { width: 5 },
  cuerpo: { flex: 1, padding: ESPACIO.md },
  titulo: { fontSize: 15, fontWeight: "700", color: COLORES.texto },
  detalle: { marginTop: 2, fontSize: 12, color: COLORES.textoSuave },
  vencida: { marginTop: 2, fontSize: 12, fontWeight: "700", color: COLORES.peligro },
  badge: { marginTop: ESPACIO.sm },
});