
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import { ETIQUETA_TIPO } from "../../constants/tareas";
import { estaVencida, textoVencimiento } from "../../utils/fechas";
import { calcularProgreso } from "../../utils/progreso";
import EstadoBadge from "../common/EstadoBadge";
import PrioridadBadge from "../common/PrioridadBadge";
import ProgresoBar from "./ProgresoBar";

export default function TareaCard({
  tarea,
  onPress,
  onAlternar,
  guardando = false,
}) {
  const progreso = calcularProgreso(tarea);
  const vencida = estaVencida(tarea);
  const completada = tarea.estado === "completada";
  const colorAsignatura = tarea.asignatura?.color ?? COLORES.borde;

  return (
    <View style={styles.tarjeta}>
      <View style={[styles.franja, { backgroundColor: colorAsignatura }]} />

      <View style={styles.cuerpo}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => pressed && { opacity: 0.85 }}
        >
          <Text style={styles.tipo}>
            {ETIQUETA_TIPO[tarea.tipo] ?? tarea.tipo}
            {tarea.asignatura?.nombre ? ` · ${tarea.asignatura.nombre}` : ""}
          </Text>

          <Text
            style={[
              styles.titulo,
              completada && styles.tituloCompletado,
            ]}
            numberOfLines={2}
          >
            {tarea.titulo}
          </Text>

          <Text
            style={[
              styles.fecha,
              vencida && { color: COLORES.peligro, fontWeight: "700" },
            ]}
          >
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
        </Pressable>

        <Pressable
          style={[
            styles.botonCompletar,
            completada && styles.botonCompletado,
            guardando && { opacity: 0.5 },
          ]}
          onPress={onAlternar}
          disabled={guardando}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: completada, disabled: guardando }}
        >
          <View
            style={[
              styles.casilla,
              completada && styles.casillaActiva,
            ]}
          >
            {completada && <Text style={styles.check}>✓</Text>}
          </View>

          <Text style={styles.textoCompletar}>
            {guardando
              ? "Guardando..."
              : completada
                ? "Marcar como pendiente"
                : "Marcar como completada"}
          </Text>
        </Pressable>
      </View>
    </View>
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
  titulo: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    color: COLORES.texto,
  },
  tituloCompletado: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  fecha: { marginTop: 4, fontSize: 13, color: COLORES.textoSuave },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: ESPACIO.sm,
  },
  separador: { width: ESPACIO.sm },
  botonCompletar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: ESPACIO.md,
    paddingVertical: ESPACIO.sm,
  },
  botonCompletado: {
    opacity: 0.8,
  },
  casilla: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORES.borde,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: ESPACIO.sm,
  },
  casillaActiva: {
    backgroundColor: COLORES.exito,
    borderColor: COLORES.exito,
  },
  check: {
    color: "#ffffff",
    fontWeight: "800",
  },
  textoCompletar: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORES.texto,
  },
});
