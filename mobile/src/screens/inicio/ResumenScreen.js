import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ResumenScreen() {
  const { usuario } = useAuth();
  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>Inicio (pendiente: integrante 4)</Text>
      <Text>Sesión: {usuario?.nombre}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  texto: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
});