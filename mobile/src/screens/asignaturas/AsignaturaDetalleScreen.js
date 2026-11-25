import React from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import { ETIQUETA_TIPO } from "../../constants/tareas";
import { useAsync } from "../../hooks/useAsync";
import { obtenerAsignatura } from "../../services/asignaturasService";
import { obtenerTareas } from "../../services/tareasService";
import { estaVencida, textoVencimiento } from "../../utils/fechas";
import LoadingView from "../../components/common/LoadingView";
import ErrorView from "../../components/common/ErrorView";
import EmptyState from "../../components/common/EmptyState";
import EstadoBadge from "../../components/common/EstadoBadge";

function FilaActividad({ tarea, onPress }) {
  const vencida = estaVencida(tarea);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fila, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.filaTextos}>
        <Text style={styles.filaTitulo}>{tarea.titulo}</Text>
        <Text style={styles.filaTipo}>{ETIQUETA_TIPO[tarea.tipo] ?? tarea.tipo}</Text>
        <Text style={[styles.filaFecha, vencida && { color: COLORES.peligro }]}>
          {textoVencimiento(tarea)}
        </Text>
      </View>
      <EstadoBadge estado={tarea.estado} />
    </Pressable>
  );
}

export default function AsignaturaDetalleScreen({ route, navigation }) {
  const { id } = route.params;
  const { data, loading, error, refrescando, recargar, refrescar } = useAsync(
    () => Promise.all([obtenerAsignatura(id), obtenerTareas()]),
    [id]
  );

  if (loading) return <LoadingView />;
  if (error) return <ErrorView mensaje={error} onReintentar={recargar} />;

  const asignatura = data[0];
  const actividades = data[1].filter((t) => t.asignaturaId === id);

  const cabecera = (
    <View style={styles.cabecera}>
      <View style={[styles.franja, { backgroundColor: asignatura.color }]} />
      <View style={styles.cabeceraTextos}>
        <Text style={styles.nombre}>{asignatura.nombre}</Text>
        <Text style={styles.detalle}>Profesor: {asignatura.profesor}</Text>
        <Text style={styles.detalle}>Periodo: {asignatura.periodo}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.pantalla}
      contentContainerStyle={styles.lista}
      data={actividades}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          {cabecera}
          <Text style={styles.seccion}>Tareas y evaluaciones ({actividades.length})</Text>
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          titulo="Sin actividades"
          descripcion="Esta asignatura aún no tiene tareas ni evaluaciones."
        />
      }
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} />}
      renderItem={({ item }) => (
        <FilaActividad
          tarea={item}
          onPress={() => navigation.navigate("TareaDetalle", { id: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  lista: { padding: ESPACIO.lg, flexGrow: 1 },
  cabecera: {
    flexDirection: "row",
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    overflow: "hidden",
    marginBottom: ESPACIO.lg,
  },
  franja: { width: 10 },
  cabeceraTextos: { flex: 1, padding: ESPACIO.lg },
  nombre: { fontSize: 20, fontWeight: "800", color: COLORES.texto },
  detalle: { marginTop: 4, color: COLORES.textoSuave },
  seccion: { fontSize: 16, fontWeight: "700", color: COLORES.texto, marginBottom: ESPACIO.md },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    padding: ESPACIO.lg,
    marginBottom: ESPACIO.md,
  },
  filaTextos: { flex: 1, marginRight: ESPACIO.md },
  filaTitulo: { fontSize: 15, fontWeight: "600", color: COLORES.texto },
  filaTipo: { marginTop: 2, fontSize: 12, color: COLORES.textoSuave },
  filaFecha: { marginTop: 2, fontSize: 12, color: COLORES.textoSuave },
});