import { PartialType } from '@nestjs/swagger';
import { CrearTareaDto } from './crear-tarea.dto.js';

export class ActualizarTareaDto extends PartialType(CrearTareaDto) {}