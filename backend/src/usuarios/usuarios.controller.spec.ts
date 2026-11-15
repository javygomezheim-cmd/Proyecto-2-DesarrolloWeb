import { describe, it, expect, vi } from 'vitest';

import { UsuariosController } from './usuarios.controller.js';

describe('UsuariosController', () => {
  it('registrar delega en el servicio con nombre, correo y contraseña', async () => {
    const respuesta = { id: 'u1', nombre: 'Ana', correo: 'ana@correo.cl' };
    const registrar = vi.fn().mockResolvedValue(respuesta);
    const controlador = new UsuariosController({ registrar } as never);

    const resultado = await controlador.registrar({
      nombre: 'Ana',
      correo: 'ana@correo.cl',
      password: 'clave12345',
    });

    expect(registrar).toHaveBeenCalledWith('Ana', 'ana@correo.cl', 'clave12345');
    expect(resultado).toBe(respuesta);
  });
});