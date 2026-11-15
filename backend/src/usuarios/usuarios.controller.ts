
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UsuariosService } from './usuarios.service.js';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto.js';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UsuarioActual } from '../auth/usuario-actual.decorator.js';

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver mi usuario' })
  obtenerPerfil(@UsuarioActual() usuario: { id: string }) {
    return this.usuariosService.obtenerPerfil(usuario.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar mi usuario' })
  actualizar(
    @UsuarioActual() usuario: { id: string },
    @Body() datos: ActualizarUsuarioDto,
  ) {
    return this.usuariosService.actualizar(usuario.id, datos);
  }

  @Delete('me')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar mi cuenta' })
  eliminar(@UsuarioActual() usuario: { id: string }) {
    return this.usuariosService.eliminar(usuario.id);
  }
}
