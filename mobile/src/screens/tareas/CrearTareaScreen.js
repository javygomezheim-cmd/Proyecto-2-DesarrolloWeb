
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import TextField from "../../components/common/TextField";
import PrimaryButton from "../../components/common/PrimaryButton";
import { obtenerAsignaturas } from "../../services/asignaturasService";
import { crearTarea } from "../../services/tareasService";

export default function CrearTareaScreen({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [fechaHora, setFechaHora] = useState(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const [asignaturaId, setAsignaturaId] = useState("");
  const [tipo, setTipo] = useState("tarea");
  const [prioridad, setPrioridad] = useState("media");

  const [asignaturas, setAsignaturas] = useState([]);
  const [cargandoAsignaturas, setCargandoAsignaturas] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarAsignaturas = async () => {
      try {
        const lista = await obtenerAsignaturas();
        setAsignaturas(lista);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar las asignaturas.");
      } finally {
        setCargandoAsignaturas(false);
      }
    };

    cargarAsignaturas();
  }, []);

  const cambiarFecha = (event, nuevaFecha) => {
    setMostrarFecha(false);

    if (event.type === "set" && nuevaFecha) {
      setFechaHora((anterior) => {
        const actualizada = new Date(anterior);
        actualizada.setFullYear(
          nuevaFecha.getFullYear(),
          nuevaFecha.getMonth(),
          nuevaFecha.getDate()
        );
        return actualizada;
      });
    }
  };

  const cambiarHora = (event, nuevaHora) => {
    setMostrarHora(false);

    if (event.type === "set" && nuevaHora) {
      setFechaHora((anterior) => {
        const actualizada = new Date(anterior);
        actualizada.setHours(
          nuevaHora.getHours(),
          nuevaHora.getMinutes(),
          0,
          0
        );
        return actualizada;
      });
    }
  };

  const guardar = async () => {
    if (!titulo.trim() || !asignaturaId) {
      Alert.alert(
        "Campos obligatorios",
        "Completa el título y selecciona una asignatura."
      );
      return;
    }

    try {
      setGuardando(true);

      await crearTarea({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        fechaLimite: fechaHora.toISOString(),
        asignaturaId,
        tipo,
        prioridad,
      });

      Alert.alert("Éxito", "La actividad se creó correctamente.", [
        { text: "Aceptar", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo crear la actividad.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>Nueva actividad</Text>

        <TextField
          etiqueta="Título *"
          placeholder="Ej: Prueba de matemática"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={150}
        />

        <TextField
          etiqueta="Descripción"
          placeholder="Detalles de la actividad (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.etiqueta}>Fecha límite *</Text>

        <Pressable
          style={styles.selector}
          onPress={() => {
            setMostrarHora(false);
            setMostrarFecha(true);
          }}
        >
          <Text style={styles.textoSelector}>
            {fechaHora.toLocaleDateString("es-CL")}
          </Text>
          <Text style={styles.icono}>📅</Text>
        </Pressable>

        {mostrarFecha && (
          <DateTimePicker
            value={fechaHora}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={cambiarFecha}
          />
        )}

        <Text style={styles.etiqueta}>Hora límite</Text>

        <Pressable
          style={styles.selector}
          onPress={() => {
            setMostrarFecha(false);
            setMostrarHora(true);
          }}
        >
          <Text style={styles.textoSelector}>
            {fechaHora.toLocaleTimeString("es-CL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.icono}>🕒</Text>
        </Pressable>

        {mostrarHora && (
          <DateTimePicker
            value={fechaHora}
            mode="time"
            display="default"
            is24Hour
            onChange={cambiarHora}
          />
        )}

        <Text style={styles.etiqueta}>Asignatura *</Text>

        {cargandoAsignaturas ? (
          <Text style={styles.info}>Cargando asignaturas...</Text>
        ) : asignaturas.length === 0 ? (
          <Text style={styles.info}>
            No tienes asignaturas. Primero debes crear una.
          </Text>
        ) : (
          <View style={styles.opciones}>
            {asignaturas.map((asignatura) => (
              <Text
                key={asignatura.id}
                onPress={() => setAsignaturaId(asignatura.id)}
                style={[
                  styles.opcion,
                  asignaturaId === asignatura.id &&
                    styles.opcionSeleccionada,
                ]}
              >
                {asignatura.nombre}
                {asignaturaId === asignatura.id ? " ✓" : ""}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.etiqueta}>Tipo de actividad</Text>

        <View style={styles.fila}>
          <Text
            onPress={() => setTipo("tarea")}
            style={[
              styles.opcion,
              tipo === "tarea" && styles.opcionSeleccionada,
            ]}
          >
            Tarea
          </Text>

          <Text
            onPress={() => setTipo("evaluacion")}
            style={[
              styles.opcion,
              tipo === "evaluacion" && styles.opcionSeleccionada,
            ]}
          >
            Evaluación
          </Text>
        </View>

        <Text style={styles.etiqueta}>Prioridad</Text>

        <View style={styles.fila}>
          {["baja", "media", "alta"].map((valor) => (
            <Text
              key={valor}
              onPress={() => setPrioridad(valor)}
              style={[
                styles.opcion,
                prioridad === valor && styles.opcionSeleccionada,
              ]}
            >
              {valor.charAt(0).toUpperCase() + valor.slice(1)}
            </Text>
          ))}
        </View>

        <PrimaryButton
          titulo="Crear actividad"
          onPress={guardar}
          cargando={guardando}
          deshabilitado={
            cargandoAsignaturas || asignaturas.length === 0 || guardando
          }
          style={styles.boton}
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
    gap: ESPACIO.md,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORES.texto,
    marginBottom: ESPACIO.sm,
  },
  etiqueta: {
    fontWeight: "600",
    color: COLORES.texto,
    marginBottom: ESPACIO.xs,
  },
  info: {
    color: COLORES.textoSuave,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ESPACIO.lg,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: RADIO,
    backgroundColor: COLORES.superficie,
  },
  textoSelector: {
    color: COLORES.texto,
    fontSize: 16,
  },
  icono: {
    fontSize: 20,
  },
  opciones: {
    gap: ESPACIO.sm,
  },
  fila: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ESPACIO.sm,
  },
  opcion: {
    padding: ESPACIO.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: RADIO,
    backgroundColor: COLORES.superficie,
    color: COLORES.texto,
    overflow: "hidden",
  },
  opcionSeleccionada: {
    borderColor: COLORES.primario,
    backgroundColor: "#dbeafe",
    color: COLORES.primarioOscuro,
    fontWeight: "bold",
  },
  boton: {
    marginTop: ESPACIO.md,
  },
});
