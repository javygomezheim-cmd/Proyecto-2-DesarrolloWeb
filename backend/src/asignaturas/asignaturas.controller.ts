
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

import { AsignaturasService } from './asignaturas.service.js';
import { CrearAsignaturaDto } from './dto/crear-asignatura.dto.js';

@ApiTags('Asignaturas')
@Controller('asignaturas')
export class AsignaturasController {
  constructor(
    private readonly asignaturasService: AsignaturasService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar asignaturas de un usuario' })
  buscarTodas(@Query('usuarioId') usuarioId: string) {
    return this.asignaturasService.buscarTodas(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una asignatura' })
  buscarUna(
    @Param('id') id: string,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.buscarUna(id, usuarioId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una asignatura' })
  @ApiBody({ type: CrearAsignaturaDto })
  crear(
    @Body() datos: CrearAsignaturaDto,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.crear(datos, usuarioId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una asignatura' })
  @ApiBody({ type: CrearAsignaturaDto })
  actualizar(
    @Param('id') id: string,
    @Body() datos: CrearAsignaturaDto,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.actualizar(id, datos, usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asignatura' })
  eliminar(
    @Param('id') id: string,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.eliminar(id, usuarioId);
  }
}
