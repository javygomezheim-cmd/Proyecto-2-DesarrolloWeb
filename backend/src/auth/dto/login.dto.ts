import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ana@correo.cl' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'MiClave123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}