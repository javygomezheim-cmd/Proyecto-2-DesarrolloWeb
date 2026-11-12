import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { AsignaturasService } from './asignaturas.service.js';
import { CrearAsignaturaDto } from './dto/crear-asignatura.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import {
  UsuarioActual,
  type UsuarioAutenticado,
} from '../auth/usuario-actual.decorator.js';

@ApiTags('Asignaturas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mis asignaturas' })
  buscarTodas(@UsuarioActual() usuario: UsuarioAutenticado) {
    return this.asignaturasService.buscarTodas(usuario.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una asignatura' })
  buscarUna(
    @Param('id') id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.buscarUna(id, usuario.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una asignatura' })
  @ApiBody({ type: CrearAsignaturaDto })
  crear(
    @Body() datos: CrearAsignaturaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.crear(datos, usuario.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una asignatura' })
  @ApiBody({ type: CrearAsignaturaDto })
  actualizar(
    @Param('id') id: string,
    @Body() datos: CrearAsignaturaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.actualizar(id, datos, usuario.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asignatura' })
  eliminar(
    @Param('id') id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.eliminar(id, usuario.id);
  }
}