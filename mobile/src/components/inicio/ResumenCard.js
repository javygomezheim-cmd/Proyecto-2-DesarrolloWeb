import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";

export default function ResumenCard({ titulo, valor, color = COLORES.primario }) {
  return (
    <View style={styles.tarjeta}>
      <Text style={[styles.valor, { color }]}>{valor}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    paddingVertical: ESPACIO.lg,
    marginHorizontal: 4,
    alignItems: "center",
  },
  valor: { fontSize: 28, fontWeight: "800" },
  titulo: { marginTop: 2, fontSize: 12, color: COLORES.textoSuave, textAlign: "center" },
});