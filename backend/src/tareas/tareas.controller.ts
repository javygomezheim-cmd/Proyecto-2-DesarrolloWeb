import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TareasService } from './tareas.service.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import {
  UsuarioActual,
  type UsuarioAutenticado,
} from '../auth/usuario-actual.decorator.js';

@ApiTags('Tareas y Evaluaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea o evaluación' })
  @ApiBody({ type: CrearTareaDto })
  @ApiCreatedResponse({ description: 'Tarea creada (registra el evento "creada" en el historial)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos de más' })
  @ApiNotFoundResponse({ description: 'La asignatura no existe o no pertenece al usuario' })
  crear(
    @Body() datos: CrearTareaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.crear(datos, usuario.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mis tareas' })
  @ApiOkResponse({ description: 'Lista de tareas del usuario autenticado' })
  buscarTodas(@UsuarioActual() usuario: UsuarioAutenticado) {
    return this.tareasService.buscarTodas(usuario.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una tarea específica' })
  @ApiOkResponse({ description: 'La tarea solicitada' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  buscarUna(
    @Param('id', ParseUUIDPipe) id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.buscarUna(id, usuario.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea (ej. marcar como completada)',
    description:
      'Se envían solo los campos a cambiar. Registra "completada" si completada=true; en otro caso "editada".',
  })
  @ApiBody({ type: ActualizarTareaDto })
  @ApiOkResponse({ description: 'Tarea actualizada' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos de más' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datos: ActualizarTareaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.actualizar(id, datos, usuario.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiOkResponse({ description: 'Tarea eliminada (registra el evento "eliminada" en el historial)' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  eliminar(
    @Param('id', ParseUUIDPipe) id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.eliminar(id, usuario.id);
  }
}