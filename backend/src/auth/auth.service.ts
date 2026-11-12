import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(correo: string, password: string) {
    const usuario = await this.usuariosService.buscarPorCorreo(correo);

    const credencialesValidas =
      usuario !== null && (await bcrypt.compare(password, usuario.passwordHash));

    if (!usuario || !credencialesValidas) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload = { sub: usuario.id, correo: usuario.correo };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
    };
  }
}