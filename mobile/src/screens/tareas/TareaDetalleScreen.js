import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import { ESTADOS, ETIQUETA_ESTADO, ETIQUETA_TIPO } from "../../constants/tareas";
import { useAsync } from "../../hooks/useAsync";
import {
  cambiarEstado,
  guardarSubtareas,
  obtenerTarea,
} from "../../services/tareasService";
import { estaVencida, formatearFechaHora, textoVencimiento } from "../../utils/fechas";
import { calcularProgreso } from "../../utils/progreso";
import LoadingView from "../../components/common/LoadingView";
import ErrorView from "../../components/common/ErrorView";
import Toast, { useToast } from "../../components/common/Toast";
import EstadoBadge from "../../components/common/EstadoBadge";
import PrioridadBadge from "../../components/common/PrioridadBadge";
import ProgresoBar from "../../components/tareas/ProgresoBar";
import EstadoSelector from "../../components/tareas/EstadoSelector";
import SubtareaItem from "../../components/tareas/SubtareaItem";

export default function TareaDetalleScreen({ route, navigation }) {
  const { id } = route.params;
  const {
    data: tarea,
    loading,
    error,
    recargar,
    setData,
  } = useAsync(() => obtenerTarea(id), [id], { alEnfocar: false });
  const [guardando, setGuardando] = useState(false);
  const { toast, mostrar } = useToast();

  useEffect(() => {
    if (tarea) {
      navigation.setOptions({ title: ETIQUETA_TIPO[tarea.tipo] ?? "Detalle" });
    }
  }, [tarea?.tipo, navigation]);

  if (loading) return <LoadingView />;
  if (error) return <ErrorView mensaje={error} onReintentar={recargar} />;
  if (!tarea) return <ErrorView mensaje="No se encontró la actividad." onReintentar={recargar} />;

  // Mezcla la respuesta del PUT con lo que ya teníamos (conserva la asignatura)
  const fusionar = (actualizada) =>
    setData((previa) => ({
      ...(previa ?? {}),
      ...actualizada,
      asignatura: actualizada.asignatura ?? previa?.asignatura,
    }));

  const guardarEstado = async (nuevoEstado) => {
    setGuardando(true);
    try {
      // Solo se envía { estado }: el backend rechaza campos de más (forbidNonWhitelisted)
      const actualizada = await cambiarEstado(id, nuevoEstado);
      fusionar(actualizada);
      mostrar(`Estado actualizado: ${ETIQUETA_ESTADO[nuevoEstado]}`);
    } catch (e) {
      mostrar(e.message, "error");
    } finally {
      setGuardando(false);
    }
  };

  const alCambiarEstado = (nuevoEstado) => {
    if (guardando || nuevoEstado === tarea.estado) return;
    if (!ESTADOS.includes(nuevoEstado)) {
      mostrar("El estado elegido no es válido.", "error");
      return;
    }
    if (nuevoEstado === "completada") {
      Alert.alert(
        "Marcar como completada",
        `¿Confirmas que "${tarea.titulo}" está completada?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Confirmar", onPress: () => guardarEstado(nuevoEstado) },
        ]
      );
      return;
    }
    guardarEstado(nuevoEstado);
  };

  const alAlternarSubtarea = async (subtarea) => {
    if (guardando) return;
    const nuevas = tarea.subtareas.map((s) =>
      s.id === subtarea.id ? { ...s, hecha: !s.hecha } : s
    );
    setGuardando(true);
    try {
      // Solo se envía { subtareas }
      const actualizada = await guardarSubtareas(id, nuevas);
      fusionar(actualizada);
      mostrar("Avance actualizado");

      const todasHechas =
        actualizada.subtareas.length > 0 && actualizada.subtareas.every((s) => s.hecha);
      if (todasHechas && actualizada.estado !== "completada") {
        Alert.alert(
          "¡Subtareas completas!",
          "¿Quieres marcar toda la actividad como completada?",
          [
            { text: "Ahora no", style: "cancel" },
            { text: "Marcar completada", onPress: () => guardarEstado("completada") },
          ]
        );
      }
    } catch (e) {
      mostrar(e.message, "error");
    } finally {
      setGuardando(false);
    }
  };

  const progreso = calcularProgreso(tarea);
  const vencida = estaVencida(tarea);

  return (
    <View style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.tarjeta}>
          <Text style={styles.asignatura}>
            <Text style={{ color: tarea.asignatura?.color ?? COLORES.textoSuave }}>● </Text>
            {tarea.asignatura?.nombre ?? "Sin asignatura"}
          </Text>
          <Text style={styles.titulo}>{tarea.titulo}</Text>

          <View style={styles.badges}>
            <EstadoBadge estado={tarea.estado} />
            <View style={styles.separador} />
            <PrioridadBadge prioridad={tarea.prioridad} />
          </View>

          <Text style={styles.etiqueta}>Fecha límite</Text>
          <Text style={styles.valor}>{formatearFechaHora(tarea.fechaLimite)}</Text>
          <Text style={[styles.estadoFecha, vencida && { color: COLORES.peligro }]}>
            {textoVencimiento(tarea)}
          </Text>

          <Text style={styles.etiqueta}>Descripción</Text>
          <Text style={styles.valor}>{tarea.descripcion || "Sin descripción."}</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.seccion}>Avance</Text>
          <ProgresoBar
            porcentaje={progreso.porcentaje}
            etiqueta={
              progreso.tieneSubtareas
                ? `${progreso.hechas} de ${progreso.total} subtareas · ${progreso.porcentaje}%`
                : `${progreso.porcentaje}%`
            }
          />

          <Text style={[styles.seccion, { marginTop: ESPACIO.lg }]}>Estado</Text>
          <EstadoSelector
            valor={tarea.estado}
            onCambiar={alCambiarEstado}
            deshabilitado={guardando}
          />
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.seccion}>Subtareas</Text>
          {tarea.subtareas.length === 0 ? (
            <Text style={styles.suave}>
              Esta actividad no tiene subtareas. Su avance depende del estado.
            </Text>
          ) : (
            tarea.subtareas.map((s) => (
              <SubtareaItem
                key={String(s.id)}
                subtarea={s}
                deshabilitado={guardando}
                onAlternar={() => alAlternarSubtarea(s)}
              />
            ))
          )}
        </View>
      </ScrollView>
      <Toast {...toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  contenido: { padding: ESPACIO.lg, paddingBottom: 90 },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    padding: ESPACIO.lg,
    marginBottom: ESPACIO.lg,
  },
  asignatura: { fontSize: 13, color: COLORES.textoSuave },
  titulo: { marginTop: 4, fontSize: 22, fontWeight: "800", color: COLORES.texto },
  badges: { flexDirection: "row", alignItems: "center", marginVertical: ESPACIO.md },
  separador: { width: ESPACIO.sm },
  etiqueta: { marginTop: ESPACIO.md, fontSize: 12, fontWeight: "700", color: COLORES.textoSuave },
  valor: { marginTop: 2, fontSize: 15, color: COLORES.texto },
  estadoFecha: { marginTop: 2, fontSize: 13, color: COLORES.textoSuave },
  seccion: { fontSize: 16, fontWeight: "700", color: COLORES.texto, marginBottom: ESPACIO.md },
  suave: { color: COLORES.textoSuave, fontSize: 14 },
});