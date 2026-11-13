import { describe, it, expect, vi } from 'vitest';

import { TareasController } from './tareas.controller.js';

// Es lo que el JwtAuthGuard deja en la petición después de validar el token.
const usuario = { id: 'u1', correo: 'u1@test.cl' };

describe('TareasController', () => {
  it('crear delega en el servicio con los datos y el id del usuario del token', async () => {
    const creada = { id: 't1' };
    const crear = vi.fn().mockResolvedValue(creada);
    const controlador = new TareasController({ crear } as never);
    const datos = { titulo: 'Informe', asignaturaId: 'a1' };

    const resultado = await controlador.crear(datos as never, usuario);

    expect(crear).toHaveBeenCalledWith(datos, 'u1');
    expect(resultado).toBe(creada);
  });

  it('buscarTodas pide al servicio solo las tareas del usuario del token', async () => {
    const buscarTodas = vi.fn().mockResolvedValue([]);
    const controlador = new TareasController({ buscarTodas } as never);

    await controlador.buscarTodas(usuario);

    expect(buscarTodas).toHaveBeenCalledWith('u1');
  });

  it('actualizar delega en el servicio con el id, los cambios y el usuario del token', async () => {
    const actualizar = vi.fn().mockResolvedValue({ id: 't1' });
    const controlador = new TareasController({ actualizar } as never);

    await controlador.actualizar('t1', { completada: true } as never, usuario);

    expect(actualizar).toHaveBeenCalledWith('t1', { completada: true }, 'u1');
  });

  it('eliminar delega en el servicio con el id y el usuario del token', async () => {
    const eliminar = vi.fn().mockResolvedValue(undefined);
    const controlador = new TareasController({ eliminar } as never);

    await controlador.eliminar('t1', usuario);

    expect(eliminar).toHaveBeenCalledWith('t1', 'u1');
  });
});