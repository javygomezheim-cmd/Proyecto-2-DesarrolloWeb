import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AgendaScreen() {
  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>Agenda (pendiente: integrante 4)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  texto: { fontSize: 16, fontWeight: "600" },
});