import { Platform } from "react-native";

// Valor por defecto solo para desarrollo local.
// Emulador Android: 10.0.2.2 apunta al PC anfitrión. iOS simulator: localhost.
// En celular físico DEBES definir EXPO_PUBLIC_API_URL en mobile/.env.
const POR_DEFECTO =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || POR_DEFECTO).replace(
  /\/+$/,
  ""
);

export const TIMEOUT_MS = 10000;