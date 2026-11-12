import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UsuariosService } from './usuarios.service.js';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto.js';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post('registro')
  @ApiOperation({ summary: 'Registrar un usuario nuevo' })
  @ApiCreatedResponse({ description: 'Usuario registrado correctamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos de más' })
  @ApiConflictResponse({ description: 'El correo ya está registrado' })
  registrar(@Body() datos: RegistroUsuarioDto) {
    return this.usuariosService.registrar(
      datos.nombre,
      datos.correo,
      datos.password,
    );
  }
}