import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './entities/tarea.entity.js';
import { Asignatura } from '../asignaturas/entities/asignatura.entity.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareasRepository: Repository<Tarea>,
    @InjectRepository(Asignatura)
    private readonly asignaturasRepository: Repository<Asignatura>,
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

    return this.tareasRepository.save(nuevaTarea);
  }

  async buscarTodas(usuarioId: string): Promise<Tarea[]> {
    return this.tareasRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: { asignatura: true }, // <-- Cambio aquí
    });
  }

  async buscarUna(id: string, usuarioId: string): Promise<Tarea> {
    const tarea = await this.tareasRepository.findOne({
      where: { id, usuario: { id: usuarioId } },
      relations: { asignatura: true }, // <-- Cambio aquí
    });

    if (!tarea) {
      throw new NotFoundException('Tarea o evaluación no encontrada');
    }

    return tarea;
  }

  async actualizar(id: string, datos: Partial<CrearTareaDto>, usuarioId: string): Promise<Tarea> {
    const tarea = await this.buscarUna(id, usuarioId);

    // Actualizamos solo los campos que vengan en la petición
    Object.assign(tarea, datos);

    return this.tareasRepository.save(tarea);
  }

  async eliminar(id: string, usuarioId: string): Promise<void> {
    const tarea = await this.buscarUna(id, usuarioId);
    await this.tareasRepository.remove(tarea);
  }
}