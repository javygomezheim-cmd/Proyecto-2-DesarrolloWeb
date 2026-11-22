import { COLORES } from "./tema";

export const ESTADOS = ["pendiente", "en_progreso", "completada"];

export const ETIQUETA_ESTADO = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completada: "Completada",
};

export const COLOR_ESTADO = {
  pendiente: COLORES.textoSuave,
  en_progreso: COLORES.info,
  completada: COLORES.exito,
};

export const PRIORIDADES = ["baja", "media", "alta"];

export const ETIQUETA_PRIORIDAD = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const COLOR_PRIORIDAD = {
  baja: COLORES.exito,
  media: COLORES.aviso,
  alta: COLORES.peligro,
};

export const TIPOS = ["tarea", "evaluacion"];

export const ETIQUETA_TIPO = {
  tarea: "Tarea",
  evaluacion: "Evaluación",
};