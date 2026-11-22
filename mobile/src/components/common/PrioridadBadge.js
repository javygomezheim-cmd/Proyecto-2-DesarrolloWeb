import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLOR_PRIORIDAD, ETIQUETA_PRIORIDAD } from "../../constants/tareas";

export default function PrioridadBadge({ prioridad }) {
  const color = COLOR_PRIORIDAD[prioridad] ?? "#6b7280";
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.texto}>
        {ETIQUETA_PRIORIDAD[prioridad] ?? prioridad}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  texto: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
});