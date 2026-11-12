import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { HistorialService } from './historial.service.js';
import { HistorialActividad } from './schemas/historial-actividad.schema.js';

@ApiTags('Historial')
@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get()
  @ApiOperation({ summary: 'Listar el historial de actividad de un usuario' })
  @ApiQuery({
    name: 'usuarioId',
    required: true,
    description: 'Id del usuario cuyo historial se quiere ver',
  })
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
    description: 'Eventos del usuario, del más reciente al más antiguo',
    type: [HistorialActividad],
  })
  @ApiBadRequestResponse({ description: 'Falta el parámetro usuarioId' })
  listar(
    @Query('usuarioId') usuarioId: string,
    @Query('entidad') entidad?: string,
    @Query('limite') limite?: string,
  ) {
    if (!usuarioId) {
      throw new BadRequestException('usuarioId es obligatorio');
    }

    return this.historialService.listar(
      usuarioId,
      entidad,
      Number(limite) || undefined,
    );
  }
}