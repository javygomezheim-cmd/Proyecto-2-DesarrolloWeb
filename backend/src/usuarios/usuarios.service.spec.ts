import { describe, it, expect, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from './usuarios.service.js';

function crearServicio(repositorio: Record<string, unknown>) {
  return new UsuariosService(repositorio as never);
}

describe('UsuariosService', () => {
  describe('registrar', () => {
    it('guarda el usuario y no devuelve el hash de la contraseña', async () => {
      const findOne = vi.fn().mockResolvedValue(null);
      const create = vi.fn((datos) => datos);
      const save = vi.fn(async (usuario) => ({
        ...usuario,
        id: 'u1',
        creadoEn: new Date('2026-01-01'),
      }));
      const servicio = crearServicio({ findOne, create, save });

      const resultado = await servicio.registrar('Ana', 'ana@correo.cl', 'clave12345');

      expect(resultado).toEqual({
        id: 'u1',
        nombre: 'Ana',
        correo: 'ana@correo.cl',
        creadoEn: new Date('2026-01-01'),
      });
      expect(resultado).not.toHaveProperty('passwordHash');
    });

    it('guarda la contraseña cifrada, nunca en texto plano', async () => {
      const findOne = vi.fn().mockResolvedValue(null);
      const create = vi.fn((datos) => datos);
      const save = vi.fn(async (usuario) => ({ ...usuario, id: 'u1' }));
      const servicio = crearServicio({ findOne, create, save });

      await servicio.registrar('Ana', 'ana@correo.cl', 'clave12345');

      const datosGuardados = create.mock.calls[0][0];
      expect(datosGuardados.passwordHash).not.toBe('clave12345');
      expect(await bcrypt.compare('clave12345', datosGuardados.passwordHash)).toBe(true);
    });

    it('rechaza un correo ya registrado con ConflictException y no guarda nada', async () => {
      const findOne = vi.fn().mockResolvedValue({ id: 'existente' });
      const create = vi.fn();
      const save = vi.fn();
      const servicio = crearServicio({ findOne, create, save });

      await expect(
        servicio.registrar('Ana', 'ana@correo.cl', 'clave12345'),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(save).not.toHaveBeenCalled();
    });
  });

  describe('buscarPorCorreo', () => {
    it('consulta el repositorio filtrando por correo', async () => {
      const findOne = vi.fn().mockResolvedValue(null);
      const servicio = crearServicio({ findOne });

      await servicio.buscarPorCorreo('ana@correo.cl');

      expect(findOne).toHaveBeenCalledWith({ where: { correo: 'ana@correo.cl' } });
    });
  });
});