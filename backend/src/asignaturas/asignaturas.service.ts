
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Asignatura } from './entities/asignatura.entity.js';
import { HistorialService } from '../historial/historial.service.js';

@Injectable()
export class AsignaturasService {
  constructor(
    @InjectRepository(Asignatura)
    private readonly asignaturasRepository: Repository<Asignatura>,

    private readonly historialService: HistorialService,
  ) { }

  async buscarTodas(usuarioId: string): Promise<Asignatura[]> {
    return this.asignaturasRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
    });
  }

  async buscarUna(id: string, usuarioId: string): Promise<Asignatura> {
    const asignatura = await this.asignaturasRepository.findOne({
      where: {
        id,
        usuario: { id: usuarioId },
      },
    });

    if (!asignatura) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    return asignatura;
  }

  async crear(
    datos: Partial<Asignatura>,
    usuarioId: string,
  ): Promise<Asignatura> {
    const nuevaAsignatura = this.asignaturasRepository.create({
      nombre: datos.nombre,
      profesor: datos.profesor,
      color: datos.color,
      usuario: { id: usuarioId },
    });

    const asignaturaGuardada =
      await this.asignaturasRepository.save(nuevaAsignatura);

    await this.historialService.registrarEvento({
      usuarioId,
      accion: 'creada',
      entidad: 'asignatura',
      entidadId: asignaturaGuardada.id,
      titulo: asignaturaGuardada.nombre,
    });

    return asignaturaGuardada;
  }

  async actualizar(
    id: string,
    datos: Partial<Asignatura>,
    usuarioId: string,
  ): Promise<Asignatura> {
    const asignatura = await this.buscarUna(id, usuarioId);

    asignatura.nombre = datos.nombre ?? asignatura.nombre;
    asignatura.profesor = datos.profesor ?? asignatura.profesor;
    asignatura.color = datos.color ?? asignatura.color;

    const asignaturaActualizada =
      await this.asignaturasRepository.save(asignatura);

    await this.historialService.registrarEvento({
      usuarioId,
      accion: 'editada',
      entidad: 'asignatura',
      entidadId: asignaturaActualizada.id,
      titulo: asignaturaActualizada.nombre,
    });

    return asignaturaActualizada;
  }

  
async eliminar(id: string, usuarioId: string): Promise<void> {
  const asignatura = await this.buscarUna(id, usuarioId);

  // Guardamos los datos antes de eliminar
  const entidadId = asignatura.id;
  const titulo = asignatura.nombre;

  await this.asignaturasRepository.remove(asignatura);

  // Registramos el evento en MongoDB
  await this.historialService.registrarEvento({
    usuarioId,
    accion: 'eliminada',
    entidad: 'asignatura',
    entidadId,
    titulo,
  });
}

}
