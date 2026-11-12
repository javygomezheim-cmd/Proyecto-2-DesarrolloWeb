import { PartialType } from '@nestjs/swagger';
import { RegistroUsuarioDto } from './registro-usuario.dto.js';

export class ActualizarUsuarioDto extends PartialType(RegistroUsuarioDto) {}