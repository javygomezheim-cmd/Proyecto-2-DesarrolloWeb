import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TareaDetalleScreen({ route }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>Detalle de tarea (pendiente: integrante 3)</Text>
      <Text>id: {route.params?.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  texto: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
});