import React, { useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

import { COLORES, ESPACIO } from "../../constants/tema";
import { useAsync } from "../../hooks/useAsync";
import { obtenerAsignaturas } from "../../services/asignaturasService";
import { obtenerTareas } from "../../services/tareasService";

import LoadingView from "../../components/common/LoadingView";
import ErrorView from "../../components/common/ErrorView";
import EmptyState from "../../components/common/EmptyState";
import AsignaturaCard from "../../components/asignaturas/AsignaturaCard";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function AsignaturasScreen({ navigation }) {
  const { data, loading, error, refrescando, recargar, refrescar } = useAsync(() =>
    Promise.all([obtenerAsignaturas(), obtenerTareas()])
  );

  const asignaturas = data ? data[0] : [];
  const tareas = data ? data[1] : [];
  const conteos = useMemo(() => {
    
    const mapa = {};

    tareas.forEach((t) => {
      const id = t.asignaturaId;
      if (!mapa[id]) mapa[id] = { total: 0, pendientes: 0 };
      mapa[id].total += 1;
      if (t.estado !== "completada") mapa[id].pendientes += 1;
    });

    return mapa;
  }, [tareas]);

  if (loading) return <LoadingView mensaje="Cargando asignaturas..." />;
  if (error) return <ErrorView mensaje={error} onReintentar={recargar} />;

  return (
    <FlatList
      style={styles.pantalla}
      contentContainerStyle={styles.lista}
      data={asignaturas}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refrescando} onRefresh={refrescar} />
      }
      ListHeaderComponent={
        <PrimaryButton
          titulo="+ Crear asignatura"
          onPress={() => navigation.navigate("CrearAsignatura")}
          style={styles.boton}
        />
      }
      ListEmptyComponent={
        <EmptyState
          titulo="No tienes asignaturas"
          descripcion="Crea tu primera asignatura usando el botón superior."
        />
      }
      renderItem={({ item }) => (
        <AsignaturaCard
          asignatura={item}
          total={conteos[item.id]?.total ?? 0}
          pendientes={conteos[item.id]?.pendientes ?? 0}
          onPress={() =>
            navigation.navigate("AsignaturaDetalle", { id: item.id })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  lista: {
    padding: ESPACIO.lg,
    flexGrow: 1,
  },
  boton: {
    marginBottom: ESPACIO.lg,
  },
});
