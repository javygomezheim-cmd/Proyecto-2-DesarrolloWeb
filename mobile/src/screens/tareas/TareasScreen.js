
import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { COLORES, ESPACIO } from "../../constants/tema";
import { useAsync } from "../../hooks/useAsync";
import {
  obtenerTareas,
  cambiarEstado,
} from "../../services/tareasService";
import LoadingView from "../../components/common/LoadingView";
import ErrorView from "../../components/common/ErrorView";
import EmptyState from "../../components/common/EmptyState";
import TareaCard from "../../components/tareas/TareaCard";
import FiltrosTareas from "../../components/tareas/FiltrosTareas";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function TareasScreen({ navigation }) {
  const [tipo, setTipo] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [guardandoId, setGuardandoId] = useState(null);

  const { data, loading, error, refrescando, recargar, refrescar } = useAsync(
    () => obtenerTareas()
  );

  const filtradas = useMemo(
    () =>
      (data ?? []).filter(
        (t) =>
          (tipo === "todos" || t.tipo === tipo) &&
          (estado === "todos" || t.estado === estado)
      ),
    [data, tipo, estado]
  );

  const alternarCompletada = async (tarea) => {
    if (guardandoId) return;

    const nuevoEstado =
      tarea.estado === "completada" ? "pendiente" : "completada";

    if (nuevoEstado === "completada") {
      Alert.alert(
        "Marcar como completada",
        `¿Confirmas que "${tarea.titulo}" está completada?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: async () => {
              await actualizarEstado(tarea.id, nuevoEstado);
            },
          },
        ]
      );
    } else {
      await actualizarEstado(tarea.id, nuevoEstado);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    setGuardandoId(id);
    try {
      await cambiarEstado(id, nuevoEstado);
      await recargar();
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo actualizar la actividad.");
    } finally {
      setGuardandoId(null);
    }
  };

  if (loading) return <LoadingView mensaje="Cargando tareas..." />;
  if (error) return <ErrorView mensaje={error} onReintentar={recargar} />;

  const hayDatos = (data ?? []).length > 0;

  return (
    <View style={styles.pantalla}>
      <View style={styles.encabezado}>
        <PrimaryButton
          titulo="+ Crear actividad"
          onPress={() => navigation.navigate("CrearTarea")}
        />
      </View>

      <FiltrosTareas
        tipo={tipo}
        onTipo={setTipo}
        estado={estado}
        onEstado={setEstado}
      />

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={refrescar} />
        }
        ListEmptyComponent={
          hayDatos ? (
            <EmptyState
              titulo="Sin resultados"
              descripcion="Ninguna actividad coincide con los filtros elegidos."
            />
          ) : (
            <EmptyState
              titulo="No tienes tareas ni evaluaciones"
              descripcion="Puedes crearlas desde el botón superior."
            />
          )
        }
        renderItem={({ item }) => (
          <TareaCard
            tarea={item}
            guardando={guardandoId === item.id}
            onAlternar={() => alternarCompletada(item)}
            onPress={() => navigation.navigate("TareaDetalle", { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  encabezado: {
    paddingHorizontal: ESPACIO.lg,
    paddingTop: ESPACIO.md,
  },
  lista: {
    padding: ESPACIO.lg,
    flexGrow: 1,
  },
});