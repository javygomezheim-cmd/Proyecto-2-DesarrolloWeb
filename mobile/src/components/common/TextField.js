import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";

// Acepta todas las props de TextInput (value, onChangeText, secureTextEntry, etc.)
export default function TextField({ etiqueta, error, style, ...props }) {
  return (
    <View style={styles.contenedor}>
      {etiqueta ? <Text style={styles.etiqueta}>{etiqueta}</Text> : null}
      <TextInput
        placeholderTextColor={COLORES.textoSuave}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: ESPACIO.md },
  etiqueta: {
    marginBottom: ESPACIO.xs,
    color: COLORES.texto,
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: RADIO,
    paddingHorizontal: ESPACIO.md,
    backgroundColor: COLORES.superficie,
    color: COLORES.texto,
    fontSize: 16,
  },
  inputError: { borderColor: COLORES.peligro },
  error: { marginTop: ESPACIO.xs, color: COLORES.peligro, fontSize: 13 },
});