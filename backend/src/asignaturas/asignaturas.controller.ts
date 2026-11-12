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

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

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
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiOkResponse({ description: 'Lista de asignaturas del usuario' })
  buscarTodas(@Query('usuarioId') usuarioId: string) {
    return this.asignaturasService.buscarTodas(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una asignatura' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiOkResponse({ description: 'La asignatura solicitada' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  buscarUna(
    @Param('id') id: string,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.buscarUna(id, usuarioId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una asignatura' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiBody({ type: CrearAsignaturaDto })
  @ApiCreatedResponse({ description: 'Asignatura creada (registra el evento "creada" en el historial)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos de más' })
  crear(
    @Body() datos: CrearAsignaturaDto,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.crear(datos, usuarioId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una asignatura' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiBody({ type: CrearAsignaturaDto })
  @ApiOkResponse({ description: 'Asignatura actualizada (registra el evento "editada" en el historial)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos de más' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  actualizar(
    @Param('id') id: string,
    @Body() datos: CrearAsignaturaDto,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.actualizar(id, datos, usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asignatura' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiOkResponse({ description: 'Asignatura eliminada (registra el evento "eliminada" en el historial)' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  eliminar(
    @Param('id') id: string,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.asignaturasService.eliminar(id, usuarioId);
  }
}