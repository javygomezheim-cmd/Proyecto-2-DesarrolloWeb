// Formato manual en español (no depende de Intl). Usa la zona horaria del dispositivo.
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

const dos = (n) => String(n).padStart(2, "0");
const aFecha = (valor) => (valor instanceof Date ? valor : new Date(valor));

function inicioDelDia(valor) {
  const d = new Date(aFecha(valor));
  d.setHours(0, 0, 0, 0);
  return d;
}

// "2026-11-22" (para agrupar por día)
export function claveDia(valor) {
  const d = aFecha(valor);
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

// "23:59"
export function formatearHora(valor) {
  const d = aFecha(valor);
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

// "22 nov"
export function formatearFechaCorta(valor) {
  const d = aFecha(valor);
  return `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`;
}

// "22/11/2026 23:59"
export function formatearFechaHora(valor) {
  const d = aFecha(valor);
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} ${formatearHora(d)}`;
}

// "Domingo 22 de noviembre"
export function formatearDiaLargo(valor) {
  const d = aFecha(valor);
  const texto = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Días de calendario desde hoy hasta la fecha (negativo = ya pasó)
export function diasHasta(valor, ahora = new Date()) {
  return Math.round((inicioDelDia(valor) - inicioDelDia(ahora)) / 86400000);
}

export function estaVencida(tarea, ahora = new Date()) {
  return tarea.estado !== "completada" && new Date(tarea.fechaLimite) < ahora;
}

// Pendiente o en progreso, aún no vencida y dentro de los próximos "dias" días
export function esProxima(tarea, dias = 7, ahora = new Date()) {
  if (tarea.estado === "completada" || estaVencida(tarea, ahora)) return false;
  return diasHasta(tarea.fechaLimite, ahora) <= dias;
}

// "Vence mañana 23:59", "Venció hace 2 días", "Completada"
export function textoVencimiento(tarea, ahora = new Date()) {
  if (tarea.estado === "completada") return "Completada";
  const d = diasHasta(tarea.fechaLimite, ahora);
  const hora = formatearHora(tarea.fechaLimite);
  if (d < 0) return `Venció hace ${-d} ${-d === 1 ? "día" : "días"}`;
  if (d === 0) {
    return estaVencida(tarea, ahora) ? "Venció hoy" : `Vence hoy ${hora}`;
  }
  if (d === 1) return `Vence mañana ${hora}`;
  return `Vence en ${d} días`;
}

// Para <SectionList>: [{ clave, titulo, data: [tarea, ...] }] ordenado por fecha
export function agruparPorDia(tareas) {
  const ordenadas = [...tareas].sort(
    (a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite)
  );
  const grupos = new Map();
  ordenadas.forEach((tarea) => {
    const clave = claveDia(tarea.fechaLimite);
    if (!grupos.has(clave)) {
      grupos.set(clave, {
        clave,
        titulo: formatearDiaLargo(tarea.fechaLimite),
        data: [],
      });
    }
    grupos.get(clave).data.push(tarea);
  });
  return Array.from(grupos.values());
}