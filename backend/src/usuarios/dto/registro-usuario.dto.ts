
import {IsEmail, IsNotEmpty, IsString, MinLength, MaxLength} from 'class-validator';
import { ApiProperty} from '@nestjs/swagger';

export class RegistroUsuarioDto {
  @ApiProperty({ example: 'Pepe Tapia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'correo@ejemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  correo: string;

  @ApiProperty({ example: 'contraseña' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
