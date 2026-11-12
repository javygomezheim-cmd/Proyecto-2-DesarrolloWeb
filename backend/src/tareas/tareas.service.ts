import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity.js';
import { Asignatura } from '../asignaturas/entities/asignatura.entity.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';
import { HistorialService } from '../historial/historial.service.js';

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

    const nuevaTarea = this.tareasRepository.create({
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      fechaLimite: new Date(datos.fechaLimite),
      completada: datos.completada ?? false,
      subtareas: datos.subtareas ?? [],
      asignatura: { id: datos.asignaturaId },
      usuario: { id: usuarioId },
    });

    const tareaGuardada = await this.tareasRepository.save(nuevaTarea);

    await this.historialService.registrarEvento({
      usuarioId,
      accion: 'creada',
      entidad: 'tarea',
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

    Object.assign(tarea, datos);
    if (datos.fechaLimite) {
      tarea.fechaLimite = new Date(datos.fechaLimite);
    }

    const tareaActualizada = await this.tareasRepository.save(tarea);

    // Determinamos si cambió a completada o solo fue editada
    const accion = datos.completada === true ? 'completada' : 'editada';

    // Registrar evento en MongoDB al actualizar/completar tarea
    await this.historialService.registrarEvento({
      usuarioId,
      accion,
      entidad: 'tarea',
      entidadId: tareaActualizada.id,
      titulo: tareaActualizada.titulo,
    });

    return tareaActualizada;
  }

  async eliminar(id: string, usuarioId: string): Promise<void> {
    const tarea = await this.buscarUna(id, usuarioId);
    
    const entidadId = tarea.id;
    const titulo = tarea.titulo;

    await this.tareasRepository.remove(tarea);

    // Registrar evento en MongoDB al eliminar tarea
    await this.historialService.registrarEvento({
      usuarioId,
      accion: 'eliminada',
      entidad: 'tarea',
      entidadId,
      titulo,
    });
  }
}