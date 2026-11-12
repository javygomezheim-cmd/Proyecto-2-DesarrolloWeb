import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TareasService } from './tareas.service.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';

@ApiTags('Tareas y Evaluaciones')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea o evaluación' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiBody({ type: CrearTareaDto })
  @ApiCreatedResponse({ description: 'Tarea creada (registra el evento "creada" en el historial)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos de más' })
  @ApiNotFoundResponse({ description: 'La asignatura no existe o no pertenece al usuario' })
  crear(@Body() datos: CrearTareaDto, @Query('usuarioId') usuarioId: string) {
    return this.tareasService.crear(datos, usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas de un usuario' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiOkResponse({ description: 'Lista de tareas del usuario' })
  buscarTodas(@Query('usuarioId') usuarioId: string) {
    return this.tareasService.buscarTodas(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una tarea específica' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiOkResponse({ description: 'La tarea solicitada' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  buscarUna(@Param('id') id: string, @Query('usuarioId') usuarioId: string) {
    return this.tareasService.buscarUna(id, usuarioId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea (ej. marcar como completada)',
    description:
      'Se envían solo los campos a cambiar. Registra "completada" si completada=true; en otro caso "editada".',
  })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiBody({ type: CrearTareaDto })
  @ApiOkResponse({ description: 'Tarea actualizada' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  actualizar(
    @Param('id') id: string,
    @Body() datos: Partial<CrearTareaDto>,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.tareasService.actualizar(id, datos, usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiQuery({ name: 'usuarioId', required: true, description: 'Id del usuario dueño' })
  @ApiOkResponse({ description: 'Tarea eliminada (registra el evento "eliminada" en el historial)' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  eliminar(@Param('id') id: string, @Query('usuarioId') usuarioId: string) {
    return this.tareasService.eliminar(id, usuarioId);
  }
}