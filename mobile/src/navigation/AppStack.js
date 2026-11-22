import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import TareaDetalleScreen from "../screens/tareas/TareaDetalleScreen";
import AsignaturaDetalleScreen from "../screens/asignaturas/AsignaturaDetalleScreen";

const Stack = createNativeStackNavigator();

/**
 * Rutas disponibles para TODAS las pantallas:
 *   navigation.navigate("TareaDetalle", { id })
 *   navigation.navigate("AsignaturaDetalle", { id })
 * Tabs: "Inicio" | "Agenda" | "Tareas" | "Asignaturas"
 */
export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="TareaDetalle"
        component={TareaDetalleScreen}
        options={{ title: "Detalle" }}
      />
      <Stack.Screen
        name="AsignaturaDetalle"
        component={AsignaturaDetalleScreen}
        options={{ title: "Asignatura" }}
      />
    </Stack.Navigator>
  );
}