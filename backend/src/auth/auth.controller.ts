import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { UsuarioActual } from './usuario-actual.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener un token' })
  @ApiUnauthorizedResponse({ description: 'Correo o contraseña incorrectos' })
  login(@Body() datos: LoginDto) {
    return this.authService.login(datos.correo, datos.password);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver el usuario del token (para probar el login)' })
  perfil(@UsuarioActual() usuario: { id: string; correo: string }) {
    return usuario;
  }
}