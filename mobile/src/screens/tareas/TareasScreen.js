import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAsync } from "../../hooks/useAsync";
import { obtenerTareas } from "../../services/tareasService";
import LoadingView from "../../components/common/LoadingView";
import ErrorView from "../../components/common/ErrorView";
import EmptyState from "../../components/common/EmptyState";

export default function TareasScreen({ navigation }) {
  const { data, loading, error, recargar } = useAsync(() => obtenerTareas());

  if (loading) return <LoadingView />;
  if (error) return <ErrorView mensaje={error} onReintentar={recargar} />;
  if (!data || data.length === 0) {
    return <EmptyState titulo="No tienes tareas" descripcion="Crea una desde la web." />;
  }

  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>Tareas (pendiente: integrante 3)</Text>
      <Text>La API devolvió {data.length} tareas/evaluaciones.</Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate("TareaDetalle", { id: data[0].id })}
      >
        Abrir detalle de la primera
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  texto: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  link: { marginTop: 12, color: "#2563eb", fontWeight: "600" },
});