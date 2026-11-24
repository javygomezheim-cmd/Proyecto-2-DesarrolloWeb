
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import TextField from "../../components/common/TextField";
import PrimaryButton from "../../components/common/PrimaryButton";
import { crearAsignatura } from "../../services/asignaturasService";

const COLORES_DISPONIBLES = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
];

export default function CrearAsignaturaScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [profesor, setProfesor] = useState("");
  const [periodo, setPeriodo] = useState("2026-2");
  const [color, setColor] = useState("#2563eb");
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  const validar = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "Ingresa el nombre de la asignatura";
    } else if (nombre.trim().length > 100) {
      nuevosErrores.nombre = "Máximo 100 caracteres";
    }

    if (!profesor.trim()) {
      nuevosErrores.profesor = "Ingresa el nombre del profesor";
    } else if (profesor.trim().length > 100) {
      nuevosErrores.profesor = "Máximo 100 caracteres";
    }

    if (periodo.trim() && !/^\d{4}-[12]$/.test(periodo.trim())) {
      nuevosErrores.periodo = "Usa el formato AAAA-S, por ejemplo 2026-2";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;

    try {
      setCargando(true);

      await crearAsignatura({
        nombre: nombre.trim(),
        profesor: profesor.trim(),
        color,
        ...(periodo.trim() ? { periodo: periodo.trim() } : {}),
      });

      Alert.alert("Éxito", "La asignatura se creó correctamente.", [
        {
          text: "Aceptar",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "No se pudo crear la asignatura."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Nueva asignatura</Text>
        <Text style={styles.descripcion}>
          Completa los datos para agregar una asignatura a tu agenda.
        </Text>

        <TextField
          etiqueta="Nombre de la asignatura *"
          placeholder="Ej. Desarrollo Web"
          value={nombre}
          onChangeText={setNombre}
          error={errores.nombre}
          maxLength={100}
        />

        <TextField
          etiqueta="Profesor *"
          placeholder="Ej. Juan Pérez"
          value={profesor}
          onChangeText={setProfesor}
          error={errores.profesor}
          maxLength={100}
        />

        <TextField
          etiqueta="Período académico"
          placeholder="2026-2"
          value={periodo}
          onChangeText={setPeriodo}
          error={errores.periodo}
          maxLength={6}
          autoCapitalize="none"
        />

        <Text style={styles.etiqueta}>Color de la asignatura</Text>
        <View style={styles.colores}>
          {COLORES_DISPONIBLES.map((opcion) => (
            <Text
              key={opcion}
              onPress={() => setColor(opcion)}
              style={[
                styles.color,
                { backgroundColor: opcion },
                color === opcion && styles.colorSeleccionado,
              ]}
            />
          ))}
        </View>

        <PrimaryButton
          titulo="Crear asignatura"
          onPress={guardar}
          cargando={cargando}
          style={styles.boton}
        />

        <PrimaryButton
          titulo="Cancelar"
          variante="secundario"
          onPress={() => navigation.goBack()}
          deshabilitado={cargando}
          style={styles.botonCancelar}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    padding: ESPACIO.lg,
    flexGrow: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORES.texto,
    marginBottom: ESPACIO.xs,
  },
  descripcion: {
    fontSize: 14,
    color: COLORES.textoSuave,
    marginBottom: ESPACIO.xl,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORES.texto,
    marginBottom: ESPACIO.sm,
  },
  colores: {
    flexDirection: "row",
    gap: ESPACIO.md,
    marginBottom: ESPACIO.xl,
  },
  color: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  colorSeleccionado: {
    borderWidth: 3,
    borderColor: COLORES.texto,
  },
  boton: {
    marginTop: ESPACIO.md,
  },
  botonCancelar: {
    marginTop: ESPACIO.sm,
  },
});
