import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: { createdAt: 'fecha', updatedAt: false } })
export class HistorialActividad {
  @ApiProperty({
    description: 'Id del usuario dueño del evento',
    example: 'b3f1c2a4-7d5e-4c1a-9f20-1a2b3c4d5e6f',
  })
  @Prop({ required: true })
  usuarioId: string;

  @ApiProperty({
    description: 'Qué se hizo',
    enum: ['creada', 'editada', 'completada', 'eliminada'],
    example: 'creada',
  })
  @Prop({ required: true, enum: ['creada', 'editada', 'completada', 'eliminada'] })
  accion: string;

  @ApiProperty({
    description: 'Sobre qué tipo de elemento',
    enum: ['asignatura', 'tarea', 'subtarea', 'evaluacion'],
    example: 'tarea',
  })
  @Prop({ required: true, enum: ['asignatura', 'tarea', 'subtarea', 'evaluacion'] })
  entidad: string;

  @ApiProperty({
    description: 'Id del elemento afectado',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @Prop({ required: true })
  entidadId: string;

  @ApiProperty({
    description: 'Nombre del elemento en el momento del evento',
    example: 'Estudiar para el examen',
  })
  @Prop({ required: true })
  titulo: string;

  @ApiPropertyOptional({
    description: 'Detalle del cambio (fecha límite, estado, prioridad, avance de subtareas)',
    example: 'Estado: pendiente → en_progreso; Subtareas: 0/2 → 1/2',
  })
  @Prop({ type: String, required: false })
  detalle?: string;

  @ApiProperty({
    description: 'Fecha y hora del evento (la asigna el sistema)',
    example: '2026-11-11T23:03:30.000Z',
  })
  fecha: Date;
}

export type HistorialActividadDocument = HydratedDocument<HistorialActividad>;
export const HistorialActividadSchema = SchemaFactory.createForClass(HistorialActividad);