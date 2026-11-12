import { describe, it, expect, vi } from 'vitest';

import { AsignaturasController } from './asignaturas.controller.js';

describe('AsignaturasController', () => {
  it('crear delega en el servicio con los datos y el usuarioId', async () => {
    const creada = { id: 'a1' };
    const crear = vi.fn().mockResolvedValue(creada);
    const controlador = new AsignaturasController({ crear } as never);
    const datos = { nombre: 'Mat', profesor: 'Juan', color: '#2563eb' };

    const resultado = await controlador.crear(datos, 'u1');

    expect(crear).toHaveBeenCalledWith(datos, 'u1');
    expect(resultado).toBe(creada);
  });

  it('buscarTodas pide al servicio solo las asignaturas del usuario', async () => {
    const buscarTodas = vi.fn().mockResolvedValue([]);
    const controlador = new AsignaturasController({ buscarTodas } as never);

    await controlador.buscarTodas('u1');

    expect(buscarTodas).toHaveBeenCalledWith('u1');
  });

  it('eliminar delega en el servicio con el id y el usuarioId', async () => {
    const eliminar = vi.fn().mockResolvedValue(undefined);
    const controlador = new AsignaturasController({ eliminar } as never);

    await controlador.eliminar('a1', 'u1');

    expect(eliminar).toHaveBeenCalledWith('a1', 'u1');
  });
});