import { IsString, IsNotEmpty, MaxLength, Matches} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}