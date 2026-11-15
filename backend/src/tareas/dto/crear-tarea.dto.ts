import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsUUID, IsArray, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TIPOS_TAREA,
  PRIORIDADES_TAREA,
  ESTADOS_TAREA,
  type TipoTarea,
  type PrioridadTarea,
  type EstadoTarea,
} from '../entities/tarea.entity.js';

export class CrearTareaDto {
  @ApiProperty({ example: 'Proyecto Final de Álgebra' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiPropertyOptional({ example: 'Detalles de la evaluación' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: '2026-10-02T23:59:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fechaLimite: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  completada?: boolean;

  @ApiPropertyOptional({ enum: TIPOS_TAREA, default: 'tarea' })
  @IsIn(TIPOS_TAREA)
  @IsOptional()
  tipo?: TipoTarea;

  @ApiPropertyOptional({ enum: PRIORIDADES_TAREA, default: 'media' })
  @IsIn(PRIORIDADES_TAREA)
  @IsOptional()
  prioridad?: PrioridadTarea;

  @ApiPropertyOptional({
    enum: ESTADOS_TAREA,
    default: 'pendiente',
    description: 'Si se envía junto con "completada", prevalece "estado".',
  })
  @IsIn(ESTADOS_TAREA)
  @IsOptional()
  estado?: EstadoTarea;

  @ApiProperty({ example: 'uuid-de-la-asignatura' })
  @IsUUID()
  @IsNotEmpty()
  asignaturaId: string;

  @ApiPropertyOptional({ example: [{ id: 1, texto: 'Repasar guía', hecha: false }] })
  @IsArray()
  @IsOptional()
  subtareas?: any[];
}