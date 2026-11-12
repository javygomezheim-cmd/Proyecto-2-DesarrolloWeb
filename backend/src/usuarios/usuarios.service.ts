
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity.js';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) { }

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

  private sinClave(usuario: Usuario) {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      creadoEn: usuario.creadoEn,
    };
  }

  async buscarPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async obtenerPerfil(id: string) {
    return this.sinClave(await this.buscarPorId(id));
  }

  async actualizar(id: string, datos: ActualizarUsuarioDto) {
    const usuario = await this.buscarPorId(id);

    if (datos.correo && datos.correo !== usuario.correo) {
      const existente = await this.buscarPorCorreo(datos.correo);
      if (existente) {
        throw new ConflictException('Este correo electrónico ya está registrado');
      }
      usuario.correo = datos.correo;
    }

    if (datos.nombre) {
      usuario.nombre = datos.nombre;
    }

    if (datos.password) {
      usuario.passwordHash = await bcrypt.hash(datos.password, 10);
    }

    return this.sinClave(await this.usuariosRepository.save(usuario));
  }

  async eliminar(id: string): Promise<void> {
    const usuario = await this.buscarPorId(id);
    await this.usuariosRepository.remove(usuario);
  }
}
