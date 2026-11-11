import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TareasService } from './tareas.service.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';

@ApiTags('Tareas y Evaluaciones')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea o evaluación' })
  @ApiBody({ type: CrearTareaDto })
  crear(@Body() datos: CrearTareaDto, @Query('usuarioId') usuarioId: string) {
    return this.tareasService.crear(datos, usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas de un usuario' })
  buscarTodas(@Query('usuarioId') usuarioId: string) {
    return this.tareasService.buscarTodas(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una tarea específica' })
  buscarUna(@Param('id') id: string, @Query('usuarioId') usuarioId: string) {
    return this.tareasService.buscarUna(id, usuarioId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea (ej. marcar como completada)' })
  @ApiBody({ type: CrearTareaDto })
  actualizar(
    @Param('id') id: string,
    @Body() datos: Partial<CrearTareaDto>,
    @Query('usuarioId') usuarioId: string,
  ) {
    return this.tareasService.actualizar(id, datos, usuarioId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  eliminar(@Param('id') id: string, @Query('usuarioId') usuarioId: string) {
    return this.tareasService.eliminar(id, usuarioId);
  }
}
