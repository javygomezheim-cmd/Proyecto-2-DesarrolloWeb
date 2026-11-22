import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORES, ESPACIO } from "../../constants/tema";
import PrimaryButton from "../../components/common/PrimaryButton";
import TextField from "../../components/common/TextField";

export default function LoginScreen() {
  const { login, avisoSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const entrar = async () => {
    if (!correo.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      await login(correo, password);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>Agenda Académica</Text>
        {avisoSesion ? <Text style={styles.aviso}>{avisoSesion}</Text> : null}
        <TextField
          etiqueta="Correo"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="demo@agenda.cl"
        />
        <TextField
          etiqueta="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton titulo="Ingresar" onPress={entrar} cargando={cargando} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    padding: ESPACIO.xl,
    backgroundColor: COLORES.fondo,
  },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIO.xl,
    borderRadius: 14,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORES.texto,
    marginBottom: ESPACIO.lg,
    textAlign: "center",
  },
  aviso: { color: COLORES.aviso, marginBottom: ESPACIO.md, textAlign: "center" },
  error: { color: COLORES.peligro, marginBottom: ESPACIO.md },
});