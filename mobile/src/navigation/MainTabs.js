import React from "react";
import { Alert, Pressable, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORES } from "../constants/tema";
import { useAuth } from "../context/AuthContext";
import ResumenScreen from "../screens/inicio/ResumenScreen";
import AgendaScreen from "../screens/agenda/AgendaScreen";
import TareasScreen from "../screens/tareas/TareasScreen";
import AsignaturasScreen from "../screens/asignaturas/AsignaturasScreen";

const Tab = createBottomTabNavigator();

const ICONOS = {
  Inicio: "home-outline",
  Agenda: "calendar-outline",
  Tareas: "checkbox-outline",
  Asignaturas: "book-outline",
};

function BotonSalir() {
  const { logout } = useAuth();

  const confirmar = () => {
    Alert.alert("Cerrar sesión", "¿Quieres cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <Pressable onPress={confirmar} hitSlop={10} style={{ paddingHorizontal: 16 }}>
      <Text style={{ color: COLORES.primario, fontWeight: "600", fontSize: 15 }}>
        Salir
      </Text>
    </Pressable>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORES.primario,
        tabBarInactiveTintColor: COLORES.textoSuave,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONOS[route.name]} size={size} color={color} />
        ),
        headerRight: () => <BotonSalir />,
        headerTitleStyle: { fontWeight: "700" },
      })}
    >
      <Tab.Screen name="Inicio" component={ResumenScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Tareas" component={TareasScreen} />
      <Tab.Screen name="Asignaturas" component={AsignaturasScreen} />
    </Tab.Navigator>
  );
}