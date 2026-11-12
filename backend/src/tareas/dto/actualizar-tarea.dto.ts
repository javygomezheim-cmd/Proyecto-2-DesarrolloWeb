import { OmitType, PartialType } from '@nestjs/swagger';
import { CrearTareaDto } from './crear-tarea.dto.js';

export class ActualizarTareaDto extends PartialType(
  OmitType(CrearTareaDto, ['asignaturaId'] as const),
) {}