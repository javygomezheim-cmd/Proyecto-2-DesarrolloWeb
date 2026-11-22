import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLOR_ESTADO, ETIQUETA_ESTADO } from "../../constants/tareas";

export default function EstadoBadge({ estado }) {
  const color = COLOR_ESTADO[estado] ?? "#6b7280";
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.texto, { color }]}>{ETIQUETA_ESTADO[estado] ?? estado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  texto: { fontSize: 12, fontWeight: "700" },
});