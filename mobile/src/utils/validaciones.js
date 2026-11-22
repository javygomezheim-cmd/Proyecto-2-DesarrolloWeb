const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cada validador devuelve un mensaje de error (string) o null si es válido.
export function validarCorreo(valor) {
  const correo = (valor || "").trim();
  if (!correo) return "Ingresa tu correo.";
  if (!REGEX_CORREO.test(correo)) return "El correo no tiene un formato válido.";
  return null;
}

export function validarPassword(valor) {
  if (!valor) return "Ingresa tu contraseña.";
  return null;
}