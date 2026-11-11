import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { HistorialService } from './historial.service.js';

@ApiTags('Historial')
@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get()
  @ApiOperation({ summary: 'Listar el historial de actividad de un usuario' })
  @ApiQuery({ name: 'usuarioId', required: true })
  @ApiQuery({ name: 'entidad', required: false })
  @ApiQuery({ name: 'limite', required: false })
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