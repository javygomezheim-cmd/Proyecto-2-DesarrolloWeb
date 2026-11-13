import { IsString, IsNotEmpty, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearAsignaturaDto {
  @ApiProperty({ example: 'Matemática' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  profesor: string;

  @ApiProperty({ example: '#2563eb' })
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color: string;

  @ApiPropertyOptional({ example: '2026-2', default: '2026-2' })
  @IsOptional()
  @Matches(/^\d{4}-[12]$/, { message: 'periodo debe tener formato AAAA-S (ej. 2026-2)' })
  periodo?: string;
}