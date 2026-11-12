import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'uuid-de-la-asignatura' })
  @IsUUID()
  @IsNotEmpty()
  asignaturaId: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  subtareas?: any[];
}