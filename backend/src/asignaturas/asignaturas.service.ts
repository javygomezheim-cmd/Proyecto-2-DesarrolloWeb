
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Asignatura } from './entities/asignatura.entity.js';

@Injectable()
export class AsignaturasService {
  constructor(
    @InjectRepository(Asignatura)
    private readonly asignaturasRepository: Repository<Asignatura>,
  ) {}

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

    return this.asignaturasRepository.save(nuevaAsignatura);
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

    return this.asignaturasRepository.save(asignatura);
  }

  async eliminar(id: string, usuarioId: string): Promise<void> {
    const asignatura = await this.buscarUna(id, usuarioId);

    await this.asignaturasRepository.remove(asignatura);
  }
}
