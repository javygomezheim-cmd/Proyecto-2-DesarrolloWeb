import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORES, ESPACIO, RADIO } from "../../constants/tema";
import PrimaryButton from "../../components/common/PrimaryButton";
import TextField from "../../components/common/TextField";
import { validarCorreo, validarPassword } from "../../utils/validaciones";

export default function LoginScreen() {
  const { login, avisoSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [cargando, setCargando] = useState(false);

  const entrar = async () => {
    const nuevosErrores = {
      correo: validarCorreo(correo),
      password: validarPassword(password),
    };
    setErrores(nuevosErrores);
    setErrorServidor(null);
    if (nuevosErrores.correo || nuevosErrores.password) return;

    setCargando(true);
    try {
      await login(correo, password);
      // Al iniciar sesión, la navegación cambia sola a la app.
    } catch (e) {
      setErrorServidor(e.message);
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Agenda Académica</Text>
          <Text style={styles.subtitulo}>Inicia sesión para ver tu agenda</Text>

          {avisoSesion ? <Text style={styles.aviso}>{avisoSesion}</Text> : null}

          <TextField
            etiqueta="Correo"
            value={correo}
            onChangeText={setCorreo}
            error={errores.correo}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="tu@correo.cl"
            returnKeyType="next"
          />
          <TextField
            etiqueta="Contraseña"
            value={password}
            onChangeText={setPassword}
            error={errores.password}
            secureTextEntry
            placeholder="Tu contraseña"
            returnKeyType="done"
            onSubmitEditing={entrar}
          />

          {errorServidor ? <Text style={styles.errorServidor}>{errorServidor}</Text> : null}

          <PrimaryButton titulo="Ingresar" onPress={entrar} cargando={cargando} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: COLORES.fondo },
  scroll: { flexGrow: 1, justifyContent: "center", padding: ESPACIO.xl },
  tarjeta: {
    backgroundColor: COLORES.superficie,
    padding: ESPACIO.xl,
    borderRadius: RADIO + 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORES.texto,
    textAlign: "center",
  },
  subtitulo: {
    marginTop: ESPACIO.xs,
    marginBottom: ESPACIO.xl,
    color: COLORES.textoSuave,
    textAlign: "center",
  },
  aviso: {
    backgroundColor: "#fef3c7",
    color: COLORES.aviso,
    padding: ESPACIO.md,
    borderRadius: RADIO,
    marginBottom: ESPACIO.md,
    textAlign: "center",
  },
  errorServidor: {
    color: COLORES.peligro,
    marginBottom: ESPACIO.md,
    textAlign: "center",
  },
});