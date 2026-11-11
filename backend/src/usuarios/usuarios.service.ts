
import {
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: { correo },
    });
  }

  async registrar(
    nombre: string,
    correo: string,
    password: string,
  ) {
    const usuarioExistente = await this.buscarPorCorreo(correo);

    if (usuarioExistente) {
      throw new ConflictException(
        'Este correo electrónico ya está registrado',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuariosRepository.create({
      nombre,
      correo,
      passwordHash,
    });

    const usuarioGuardado = await this.usuariosRepository.save(
      nuevoUsuario,
    );

    return {
      id: usuarioGuardado.id,
      nombre: usuarioGuardado.nombre,
      correo: usuarioGuardado.correo,
      creadoEn: usuarioGuardado.creadoEn,
    };
  }
}
