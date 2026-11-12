import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
  crear(
    @Body() datos: CrearTareaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.crear(datos, usuario.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mis tareas' })
  buscarTodas(@UsuarioActual() usuario: UsuarioAutenticado) {
    return this.tareasService.buscarTodas(usuario.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una tarea específica' })
  buscarUna(
    @Param('id') id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.buscarUna(id, usuario.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea (ej. marcar como completada)' })
  @ApiBody({ type: ActualizarTareaDto })
  actualizar(
    @Param('id') id: string,
    @Body() datos: ActualizarTareaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.actualizar(id, datos, usuario.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  eliminar(
    @Param('id') id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.tareasService.eliminar(id, usuario.id);
  }
}