import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORES, RADIO } from "../../constants/tema";
import { COLOR_ESTADO, ESTADOS, ETIQUETA_ESTADO } from "../../constants/tareas";

export default function EstadoSelector({ valor, onCambiar, deshabilitado = false }) {
  return (
    <View style={styles.contenedor}>
      {ESTADOS.map((estado) => {
        const activo = estado === valor;
        const color = COLOR_ESTADO[estado];
        return (
          <Pressable
            key={estado}
            onPress={() => onCambiar(estado)}
            disabled={deshabilitado}
            accessibilityRole="button"
            accessibilityState={{ selected: activo, disabled: deshabilitado }}
            style={[
              styles.opcion,
              { borderColor: color },
              activo && { backgroundColor: color },
              deshabilitado && { opacity: 0.5 },
            ]}
          >
            <Text style={[styles.texto, { color: activo ? "#ffffff" : color }]}>
              {ETIQUETA_ESTADO[estado]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexDirection: "row" },
  opcion: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: RADIO,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    backgroundColor: COLORES.superficie,
  },
  texto: { fontSize: 13, fontWeight: "700" },
});