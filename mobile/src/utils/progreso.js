const PORCENTAJE_POR_ESTADO = { pendiente: 0, en_progreso: 50, completada: 100 };

/**
 * Avance de una tarea.
 * - Con subtareas: hechas / total (igual que la web).
 * - Sin subtareas: se deduce del estado (0 / 50 / 100).
 * - Si el estado es "completada", siempre 100.
 */
export function calcularProgreso(tarea) {
  const subtareas = Array.isArray(tarea?.subtareas) ? tarea.subtareas : [];
  const total = subtareas.length;
  const hechas = subtareas.filter((s) => s?.hecha === true).length;

  if (tarea?.estado === "completada") {
    return { hechas, total, porcentaje: 100, tieneSubtareas: total > 0 };
  }
  if (total > 0) {
    return {
      hechas,
      total,
      porcentaje: Math.round((hechas / total) * 100),
      tieneSubtareas: true,
    };
  }
  return {
    hechas: 0,
    total: 0,
    porcentaje: PORCENTAJE_POR_ESTADO[tarea?.estado] ?? 0,
    tieneSubtareas: false,
  };
}

// { pendiente: n, en_progreso: n, completada: n }
export function contarPorEstado(tareas) {
  const conteo = { pendiente: 0, en_progreso: 0, completada: 0 };
  tareas.forEach((t) => {
    if (conteo[t.estado] !== undefined) conteo[t.estado] += 1;
  });
  return conteo;
}