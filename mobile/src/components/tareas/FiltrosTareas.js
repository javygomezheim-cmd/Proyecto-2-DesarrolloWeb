import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO } from "../../constants/tema";
import { ESTADOS, ETIQUETA_ESTADO } from "../../constants/tareas";

const FILTROS_TIPO = [
  { clave: "todos", etiqueta: "Todo" },
  { clave: "tarea", etiqueta: "Tareas" },
  { clave: "evaluacion", etiqueta: "Evaluaciones" },
];

const FILTROS_ESTADO = [
  { clave: "todos", etiqueta: "Cualquier estado" },
  ...ESTADOS.map((e) => ({ clave: e, etiqueta: ETIQUETA_ESTADO[e] })),
];

function FilaChips({ opciones, seleccion, onElegir }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fila}>
      {opciones.map((o) => {
        const activo = o.clave === seleccion;
        return (
          <Pressable
            key={o.clave}
            onPress={() => onElegir(o.clave)}
            style={[styles.chip, activo && styles.chipActivo]}
          >
            <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
              {o.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default function FiltrosTareas({ tipo, onTipo, estado, onEstado }) {
  return (
    <View style={styles.contenedor}>
      <FilaChips opciones={FILTROS_TIPO} seleccion={tipo} onElegir={onTipo} />
      <FilaChips opciones={FILTROS_ESTADO} seleccion={estado} onElegir={onEstado} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingVertical: ESPACIO.sm,
    paddingHorizontal: ESPACIO.md,
    backgroundColor: COLORES.superficie,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  fila: { marginVertical: 4 },
  chip: {
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: ESPACIO.sm,
    backgroundColor: COLORES.superficie,
  },
  chipActivo: { backgroundColor: COLORES.primario, borderColor: COLORES.primario },
  chipTexto: { color: COLORES.texto, fontSize: 14 },
  chipTextoActivo: { color: "#ffffff", fontWeight: "600" },
});