import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Body,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
  @ApiOkResponse({ description: 'Lista de asignaturas del usuario autenticado' })
  buscarTodas(@UsuarioActual() usuario: UsuarioAutenticado) {
    return this.asignaturasService.buscarTodas(usuario.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una asignatura' })
  @ApiOkResponse({ description: 'La asignatura solicitada' })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  buscarUna(
    @Param('id', ParseUUIDPipe) id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.buscarUna(id, usuario.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una asignatura' })
  @ApiBody({ type: CrearAsignaturaDto })
  @ApiCreatedResponse({ description: 'Asignatura creada (registra el evento "creada" en el historial)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o campos de más' })
  crear(
    @Body() datos: CrearAsignaturaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.crear(datos, usuario.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una asignatura' })
  @ApiBody({ type: CrearAsignaturaDto })
  @ApiOkResponse({ description: 'Asignatura actualizada (registra el evento "editada" en el historial)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos, campos de más o id no UUID' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() datos: CrearAsignaturaDto,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.actualizar(id, datos, usuario.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asignatura' })
  @ApiOkResponse({ description: 'Asignatura eliminada (registra el evento "eliminada" en el historial)' })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'No existe o no pertenece al usuario' })
  eliminar(
    @Param('id', ParseUUIDPipe) id: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
  ) {
    return this.asignaturasService.eliminar(id, usuario.id);
  }
}