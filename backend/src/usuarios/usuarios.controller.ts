
import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service.js';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post('registro')
  registrar(@Body() datos: RegistroUsuarioDto) {
    return this.usuariosService.registrar(
      datos.nombre,
      datos.correo,
      datos.password,
    );
  }
}
