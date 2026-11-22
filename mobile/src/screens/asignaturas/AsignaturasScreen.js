import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AsignaturasScreen() {
  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>Asignaturas (pendiente: integrante 2)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  texto: { fontSize: 16, fontWeight: "600" },
});
