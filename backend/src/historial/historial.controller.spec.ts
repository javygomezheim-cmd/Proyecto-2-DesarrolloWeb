import { describe, it, expect, vi } from 'vitest';

import { HistorialController } from './historial.controller.js';

// Es lo que el JwtAuthGuard deja en la petición después de validar el token.
const usuario = { id: 'u1', correo: 'u1@test.cl' };

describe('HistorialController', () => {
  it('listar pide al servicio el historial del usuario del token', async () => {
    const eventos = [{ accion: 'creada' }];
    const listar = vi.fn().mockResolvedValue(eventos);
    const controlador = new HistorialController({ listar } as never);

    const resultado = await controlador.listar(usuario);

    expect(listar).toHaveBeenCalledWith('u1', undefined, undefined);
    expect(resultado).toBe(eventos);
  });

  it('listar pasa el filtro de entidad y el límite como número', async () => {
    const listar = vi.fn().mockResolvedValue([]);
    const controlador = new HistorialController({ listar } as never);

    await controlador.listar(usuario, 'tarea', '10');

    expect(listar).toHaveBeenCalledWith('u1', 'tarea', 10);
  });

  it('listar ignora un límite inválido y usa el valor por defecto del servicio', async () => {
    const listar = vi.fn().mockResolvedValue([]);
    const controlador = new HistorialController({ listar } as never);

    await controlador.listar(usuario, undefined, 'abc');

    expect(listar).toHaveBeenCalledWith('u1', undefined, undefined);
  });
});