import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CrearHistorialDto {
  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @IsIn(['creada', 'editada', 'completada', 'eliminada'])
  accion: string;

  @IsIn(['asignatura', 'tarea', 'subtarea', 'evaluacion'])
  entidad: string;

  @IsString()
  @IsNotEmpty()
  entidadId: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;
}