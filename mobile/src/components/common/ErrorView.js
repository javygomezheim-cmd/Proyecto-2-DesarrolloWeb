import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO } from "../../constants/tema";
import PrimaryButton from "./PrimaryButton";

export default function ErrorView({ mensaje, onReintentar }) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{mensaje || "Ocurrió un error inesperado."}</Text>
      {onReintentar ? (
        <PrimaryButton titulo="Reintentar" onPress={onReintentar} />
      ) : null}
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
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORES.peligro,
    marginBottom: ESPACIO.sm,
  },
  mensaje: {
    textAlign: "center",
    color: COLORES.textoSuave,
    marginBottom: ESPACIO.lg,
    fontSize: 15,
  },
});