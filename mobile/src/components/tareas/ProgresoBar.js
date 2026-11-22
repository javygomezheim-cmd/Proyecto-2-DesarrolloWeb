import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORES } from "../../constants/tema";

export default function ProgresoBar({ porcentaje = 0, etiqueta }) {
  const valor = Math.max(0, Math.min(100, porcentaje));
  return (
    <View>
      {etiqueta ? <Text style={styles.etiqueta}>{etiqueta}</Text> : null}
      <View style={styles.pista}>
        <View
          style={[
            styles.relleno,
            {
              width: `${valor}%`,
              backgroundColor: valor === 100 ? COLORES.exito : COLORES.primario,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  etiqueta: { marginBottom: 4, fontSize: 12, color: COLORES.textoSuave },
  pista: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORES.borde,
    overflow: "hidden",
  },
  relleno: { height: 8, borderRadius: 4 },
});