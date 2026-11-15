import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { HistorialService } from './historial.service.js';
import { HistorialActividad } from './schemas/historial-actividad.schema.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import {
  UsuarioActual,
  type UsuarioAutenticado,
} from '../auth/usuario-actual.decorator.js';

@ApiTags('Historial')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get()
  @ApiOperation({ summary: 'Listar mi historial de actividad' })
  @ApiQuery({
    name: 'entidad',
    required: false,
    description: 'Filtrar por tipo de elemento',
    enum: ['asignatura', 'tarea', 'subtarea', 'evaluacion'],
  })
  @ApiQuery({
    name: 'limite',
    required: false,
    description: 'Cantidad máxima de eventos a devolver (por defecto 50)',
    example: 50,
  })
  @ApiOkResponse({
    description: 'Mis eventos, del más reciente al más antiguo',
    type: [HistorialActividad],
  })
  listar(
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Query('entidad') entidad?: string,
    @Query('limite') limite?: string,
  ) {
    return this.historialService.listar(
      usuario.id,
      entidad,
      Number(limite) || undefined,
    );
  }
}