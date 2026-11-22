import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO } from "../../constants/tema";

export default function EmptyState({ titulo = "Sin resultados", descripcion }) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      {descripcion ? <Text style={styles.descripcion}>{descripcion}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: ESPACIO.xl,
  },
  titulo: { fontSize: 17, fontWeight: "600", color: COLORES.texto },
  descripcion: {
    marginTop: ESPACIO.sm,
    textAlign: "center",
    color: COLORES.textoSuave,
    fontSize: 14,
  },
});