
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegistroUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  correo: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
