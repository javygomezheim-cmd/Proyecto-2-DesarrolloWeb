import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea, type EstadoTarea } from './entities/tarea.entity.js';
import { Asignatura } from '../asignaturas/entities/asignatura.entity.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';
import { HistorialService } from '../historial/historial.service.js';

function progreso(subtareas: unknown): { hechas: number; total: number } {
  const lista: Array<{ hecha?: boolean }> = Array.isArray(subtareas) ? subtareas : [];
  return { hechas: lista.filter((s) => s?.hecha === true).length, total: lista.length };
}

function formatearFecha(valor: Date | string): string {
  return new Date(valor).toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function entidadDe(tarea: Pick<Tarea, 'tipo'>): 'tarea' | 'evaluacion' {
  return tarea.tipo === 'evaluacion' ? 'evaluacion' : 'tarea';
}

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareasRepository: Repository<Tarea>,
    @InjectRepository(Asignatura)
    private readonly asignaturasRepository: Repository<Asignatura>,
    private readonly historialService: HistorialService,
  ) {}

  async crear(datos: CrearTareaDto, usuarioId: string): Promise<Tarea> {
    const asignatura = await this.asignaturasRepository.findOne({
      where: { id: datos.asignaturaId, usuario: { id: usuarioId } },
    });

    if (!asignatura) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    // "estado" manda; si no viene, se deriva de "completada"
    const estado: EstadoTarea =
      datos.estado ?? (datos.completada ? 'completada' : 'pendiente');

    const nuevaTarea = this.tareasRepository.create({
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      fechaLimite: new Date(datos.fechaLimite),
      completada: estado === 'completada',
      tipo: datos.tipo ?? 'tarea',
      prioridad: datos.prioridad ?? 'media',
      estado,
      subtareas: datos.subtareas ?? [],
      asignatura: { id: datos.asignaturaId },
      usuario: { id: usuarioId },
    });

    const tareaGuardada = await this.tareasRepository.save(nuevaTarea);

    await this.historialService.registrarEvento({
      usuarioId,
      accion: 'creada',
      entidad: entidadDe(tareaGuardada),
      entidadId: tareaGuardada.id,
      titulo: tareaGuardada.titulo,
    });

    return tareaGuardada;
  }

  async buscarTodas(usuarioId: string): Promise<Tarea[]> {
    return this.tareasRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: { asignatura: true },
    });
  }

  async buscarUna(id: string, usuarioId: string): Promise<Tarea> {
    const tarea = await this.tareasRepository.findOne({
      where: { id, usuario: { id: usuarioId } },
      relations: { asignatura: true },
    });

    if (!tarea) {
      throw new NotFoundException('Tarea o evaluación no encontrada');
    }

    return tarea;
  }

  async actualizar(id: string, datos: Partial<CrearTareaDto>, usuarioId: string): Promise<Tarea> {
    const tarea = await this.buscarUna(id, usuarioId);

    const antes = {
      titulo: tarea.titulo,
      fechaLimite: tarea.fechaLimite,
      estado: tarea.estado,
      prioridad: tarea.prioridad,
      completada: tarea.completada,
      progreso: progreso(tarea.subtareas),
    };

    const { asignaturaId, fechaLimite, ...resto } = datos;

    if (asignaturaId) {
      const asignatura = await this.asignaturasRepository.findOne({
        where: { id: asignaturaId, usuario: { id: usuarioId } },
      });
      if (!asignatura) throw new NotFoundException('Asignatura no encontrada');
      tarea.asignatura = asignatura;
    }

    Object.assign(tarea, resto);
    if (fechaLimite) {
      tarea.fechaLimite = new Date(fechaLimite);
    }

    // Sincronización estado <-> completada
    if (datos.estado !== undefined) {
      tarea.completada = datos.estado === 'completada';
    } else if (datos.completada !== undefined) {
      tarea.estado = datos.completada
        ? 'completada'
        : antes.estado === 'completada'
          ? 'pendiente'
          : antes.estado;
    } else if (
      datos.subtareas !== undefined &&
      tarea.estado === 'pendiente' &&
      progreso(tarea.subtareas).hechas > 0
    ) {
      tarea.estado = 'en_progreso';
    }

    // Detalle del cambio para el historial (MongoDB)
    const detalles: string[] = [];
    if (resto.titulo && resto.titulo !== antes.titulo) {
      detalles.push(`Título: ${antes.titulo} → ${resto.titulo}`);
    }
    if (
      fechaLimite &&
      antes.fechaLimite &&
      new Date(fechaLimite).getTime() !== new Date(antes.fechaLimite).getTime()
    ) {
      detalles.push(
        `Fecha límite: ${formatearFecha(antes.fechaLimite)} → ${formatearFecha(tarea.fechaLimite)}`,
      );
    }
    if (tarea.estado !== antes.estado) {
      detalles.push(`Estado: ${antes.estado} → ${tarea.estado}`);
    }
    if (tarea.prioridad !== antes.prioridad) {
      detalles.push(`Prioridad: ${antes.prioridad} → ${tarea.prioridad}`);
    }
    const despues = progreso(tarea.subtareas);
    if (
      datos.subtareas !== undefined &&
      (despues.hechas !== antes.progreso.hechas || despues.total !== antes.progreso.total)
    ) {
      detalles.push(
        `Subtareas: ${antes.progreso.hechas}/${antes.progreso.total} → ${despues.hechas}/${despues.total}`,
      );
    }

    const tareaActualizada = await this.tareasRepository.save(tarea);

    const accion = tareaActualizada.completada && !antes.completada ? 'completada' : 'editada';

    await this.historialService.registrarEvento({
      usuarioId,
      accion,
      entidad: entidadDe(tareaActualizada),
      entidadId: tareaActualizada.id,
      titulo: tareaActualizada.titulo,
      detalle: detalles.length ? detalles.join('; ') : undefined,
    });

    return tareaActualizada;
  }

  async eliminar(id: string, usuarioId: string): Promise<void> {
    const tarea = await this.buscarUna(id, usuarioId);

    const entidadId = tarea.id;
    const titulo = tarea.titulo;
    const entidad = entidadDe(tarea);

    await this.tareasRepository.remove(tarea);

    await this.historialService.registrarEvento({
      usuarioId,
      accion: 'eliminada',
      entidad,
      entidadId,
      titulo,
    });
  }
}