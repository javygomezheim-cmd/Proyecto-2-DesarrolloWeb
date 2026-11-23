import React from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "../../hooks/useAsync";
import { obtenerTareas } from "../../services/tareasService";
import { esProxima, estaVencida, formatearFechaCorta, textoVencimiento } from "../../utils/fechas";
import { contarPorEstado } from "../../utils/progreso";
import LoadingView from "../../components/common/LoadingView";
import ErrorView from "../../components/common/ErrorView";
import EmptyState from "../../components/common/EmptyState";
import ResumenCard from "../../components/inicio/ResumenCard";

function FilaProxima({ tarea, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fila, pressed && { opacity: 0.85 }]}
    >
      <View
        style={[styles.punto, { backgroundColor: tarea.asignatura?.color ?? COLORES.borde }]}
      />
      <View style={styles.filaTextos}>
        <Text style={styles.filaTitulo} numberOfLines={1}>
          {tarea.titulo}
        </Text>
        <Text style={styles.filaDetalle}>
          {tarea.asignatura?.nombre ?? "Sin asignatura"} · {textoVencimiento(tarea)}
        </Text>
      </View>
      <Text style={styles.filaFecha}>{formatearFechaCorta(tarea.fechaLimite)}</Text>
    </Pressable>
  );
}

function Bloque({ titulo, vacio, children, hayItems }) {
  return (
    <View style={styles.bloque}>
      <Text style={styles.bloqueTitulo}>{titulo}</Text>
      {hayItems ? children : <Text style={styles.suave}>{vacio}</Text>}
    </View>
  );
}

export default function ResumenScreen({ navigation }) {
  const { usuario } = useAuth();
  const { data, loading, error, refrescando, recargar, refrescar } = useAsync(() =>
    obtenerTareas()
  );

  if (loading) return <LoadingView mensaje="Cargando tu resumen..." />;
  if (error) return <ErrorView mensaje={error} onReintentar={recargar} />;

  const tareas = data ?? [];
  if (tareas.length === 0) {
    return (
      <EmptyState
        titulo="Aún no tienes actividades"
        descripcion="Crea tareas y evaluaciones desde la aplicación web y verás tu resumen aquí."
      />
    );
  }

  const conteo = contarPorEstado(tareas);
  const vencidas = tareas.filter((t) => estaVencida(t));
  const evaluaciones = tareas
    .filter((t) => t.tipo === "evaluacion" && esProxima(t, 30))
    .slice(0, 3);
  const proximasTareas = tareas.filter((t) => t.tipo === "tarea" && esProxima(t, 7)).slice(0, 5);
  const abrir = (t) => navigation.navigate("TareaDetalle", { id: t.id });
  const nombre = usuario?.nombre?.split(" ")[0] ?? "";

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} />}
    >
      <Text style={styles.saludo}>Hola, {nombre} 👋</Text>

      <View style={styles.contadores}>
        <ResumenCard titulo="Pendientes" valor={conteo.pendiente} color={COLORES.textoSuave} />
        <ResumenCard titulo="En progreso" valor={conteo.en_progreso} color={COLORES.info} />
        <ResumenCard titulo="Completadas" valor={conteo.completada} color={COLORES.exito} />
      </View>

      {vencidas.length > 0 ? (
        <View style={styles.alerta}>
          <Text style={styles.alertaTexto}>
            Tienes {vencidas.length} {vencidas.length === 1 ? "actividad vencida" : "actividades vencidas"}
          </Text>
        </View>
      ) : null}

      <Bloque
        titulo="Próximas evaluaciones (30 días)"
        vacio="No tienes evaluaciones próximas."
        hayItems={evaluaciones.length > 0}
      >
        {evaluaciones.map((t) => (
          <FilaProxima key={t.id} tarea={t} onPress={() => abrir(t)} />
        ))}
      </Bloque>

      <Bloque
        titulo="Tareas de la semana"
        vacio="No tienes tareas para los próximos 7 días."
        hayItems={proximasTareas.length > 0}
      >
        {proximasTareas.map((t) => (
          <FilaProxima key={t.id} tarea={t} onPress={() => abrir(t)} />
        ))}
      </Bloque>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo },
  contenido: { padding: ESPACIO.lg },
  saludo: { fontSize: 22, fontWeight: "800", color: COLORES.texto, marginBottom: ESPACIO.lg },
  contadores: { flexDirection: "row", marginHorizontal: -4, marginBottom: ESPACIO.lg },
  alerta: {
    backgroundColor: "#fee2e2",
    borderRadius: RADIO,
    padding: ESPACIO.md,
    marginBottom: ESPACIO.lg,
  },
  alertaTexto: { color: COLORES.peligro, fontWeight: "700", textAlign: "center" },
  bloque: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO,
    padding: ESPACIO.lg,
    marginBottom: ESPACIO.lg,
  },
  bloqueTitulo: { fontSize: 16, fontWeight: "700", color: COLORES.texto, marginBottom: ESPACIO.md },
  suave: { color: COLORES.textoSuave, fontSize: 14 },
  fila: { flexDirection: "row", alignItems: "center", paddingVertical: ESPACIO.sm },
  punto: { width: 10, height: 10, borderRadius: 5, marginRight: ESPACIO.md },
  filaTextos: { flex: 1 },
  filaTitulo: { fontSize: 15, fontWeight: "600", color: COLORES.texto },
  filaDetalle: { marginTop: 2, fontSize: 12, color: COLORES.textoSuave },
  filaFecha: { marginLeft: ESPACIO.md, fontSize: 13, fontWeight: "700", color: COLORES.primario },
});