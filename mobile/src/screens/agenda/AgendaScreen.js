import React, { useMemo, useState } from "react";
import { Pressable, RefreshControl, SectionList, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO } from "../../constants/tema";
import { useAsync } from "../../hooks/useAsync";
import { obtenerTareas } from "../../services/tareasService";
import { agruparPorDia, claveDia } from "../../utils/fechas";
import LoadingView from "../../components/common/LoadingView";
import ErrorView from "../../components/common/ErrorView";
import EmptyState from "../../components/common/EmptyState";
import AgendaItem from "../../components/agenda/AgendaItem";
import DiaSeccion from "../../components/agenda/DiaSeccion";

const FILTROS = [
  { clave: "porHacer", etiqueta: "Por hacer" },
  { clave: "todas", etiqueta: "Todas" },
];

export default function AgendaScreen({ navigation }) {
  const [filtro, setFiltro] = useState("porHacer");
  const { data, loading, error, refrescando, recargar, refrescar } = useAsync(() =>
    obtenerTareas()
  );

  const secciones = useMemo(() => {
    const base = data ?? [];
    const visibles = filtro === "porHacer" ? base.filter((t) => t.estado !== "completada") : base;
    return agruparPorDia(visibles);
  }, [data, filtro]);

  if (loading) return <LoadingView mensaje="Cargando agenda..." />;
  if (error) return <ErrorView mensaje={error} onReintentar={recargar} />;

  const hoy = claveDia(new Date());

  return (
    <View style={styles.pantalla}>
      <View style={styles.filtros}>
        {FILTROS.map((f) => {
          const activo = f.clave === filtro;
          return (
            <Pressable
              key={f.clave}
              onPress={() => setFiltro(f.clave)}
              style={[styles.chip, activo && styles.chipActivo]}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                {f.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionList
        sections={secciones}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} />}
        ListEmptyComponent={
          <EmptyState
            titulo={filtro === "porHacer" ? "¡Todo al día!" : "Tu agenda está vacía"}
            descripcion={
              filtro === "porHacer"
                ? "No tienes actividades pendientes."
                : "Crea tareas o evaluaciones desde la aplicación web y aparecerán aquí."
            }
          />
        }
        renderSectionHeader={({ section }) => (
          <DiaSeccion
            titulo={section.titulo}
            cantidad={section.data.length}
            esHoy={section.clave === hoy}
            esPasado={section.clave < hoy}
          />
        )}
        renderItem={({ item }) => (
          <AgendaItem
            tarea={item}
            onPress={() => navigation.navigate("TareaDetalle", { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  filtros: {
    flexDirection: "row",
    padding: ESPACIO.md,
    backgroundColor: COLORES.superficie,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: ESPACIO.sm,
    backgroundColor: COLORES.superficie,
  },
  chipActivo: { backgroundColor: COLORES.primario, borderColor: COLORES.primario },
  chipTexto: { color: COLORES.texto, fontSize: 14 },
  chipTextoActivo: { color: "#ffffff", fontWeight: "600" },
  lista: { paddingHorizontal: ESPACIO.lg, paddingBottom: ESPACIO.xl, flexGrow: 1 },
});