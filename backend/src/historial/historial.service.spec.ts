import { describe, it, expect, vi } from 'vitest';
import { HistorialService } from './historial.service.js';

const evento = {
  usuarioId: 'u1',
  accion: 'creada',
  entidad: 'tarea',
  entidadId: 't1',
  titulo: 'Estudiar para el examen',
};

describe('HistorialService', () => {
  it('registrarEvento guarda el evento en la base', async () => {
    const create = vi.fn().mockResolvedValue({});
    const service = new HistorialService({ create } as never);

    await service.registrarEvento(evento);

    expect(create).toHaveBeenCalledWith(evento);
  });

  it('registrarEvento no lanza error si MongoDB falla', async () => {
    const create = vi.fn().mockRejectedValue(new Error('Mongo caido'));
    const service = new HistorialService({ create } as never);

    await expect(service.registrarEvento(evento)).resolves.toBeUndefined();
  });

  it('listar filtra por usuario y entidad, del mas reciente al mas antiguo', async () => {
    const exec = vi.fn().mockResolvedValue([]);
    const limit = vi.fn().mockReturnValue({ exec });
    const sort = vi.fn().mockReturnValue({ limit });
    const find = vi.fn().mockReturnValue({ sort });
    const service = new HistorialService({ find } as never);

    await service.listar('u1', 'tarea', 10);

    expect(find).toHaveBeenCalledWith({ usuarioId: 'u1', entidad: 'tarea' });
    expect(sort).toHaveBeenCalledWith({ fecha: -1 });
    expect(limit).toHaveBeenCalledWith(10);
  });
});