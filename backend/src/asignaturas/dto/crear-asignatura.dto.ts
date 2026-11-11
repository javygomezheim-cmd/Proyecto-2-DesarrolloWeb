import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';

export class CrearAsignaturaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  profesor: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color: string;
}