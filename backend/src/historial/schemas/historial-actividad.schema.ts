import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: { createdAt: 'fecha', updatedAt: false } })
export class HistorialActividad {
  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true, enum: ['creada', 'editada', 'completada', 'eliminada'] })
  accion: string;

  @Prop({ required: true, enum: ['asignatura', 'tarea', 'subtarea', 'evaluacion'] })
  entidad: string;

  @Prop({ required: true })
  entidadId: string;

  @Prop({ required: true })
  titulo: string;
}

export type HistorialActividadDocument = HydratedDocument<HistorialActividad>;
export const HistorialActividadSchema = SchemaFactory.createForClass(HistorialActividad);