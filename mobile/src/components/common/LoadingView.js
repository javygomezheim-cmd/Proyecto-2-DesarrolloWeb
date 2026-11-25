import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO } from "../../constants/tema";

export default function LoadingView({ mensaje = "Cargando..." }) {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="large" color={COLORES.primario} />
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: ESPACIO.xl,
    backgroundColor: COLORES.fondo,
  },
  texto: { marginTop: ESPACIO.md, color: COLORES.textoSuave, fontSize: 15 },
});