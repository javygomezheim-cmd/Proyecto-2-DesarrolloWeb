import { describe, it, expect, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

import { TareasService } from './tareas.service.js';

function crearServicio(
  tareas: Record<string, unknown>,
  asignaturas: Record<string, unknown> = {},
) {
  const historial = { registrarEvento: vi.fn().mockResolvedValue(undefined) };
  const servicio = new TareasService(tareas as never, asignaturas as never, historial as never);
  return { servicio, historial };
}

const datosTarea = {
  titulo: 'Entrega 1',
  fechaLimite: '2026-12-01T23:59:00Z',
  asignaturaId: 'a1',
};

describe('TareasService', () => {
  describe('crear', () => {
    it('guarda la tarea con valores por defecto y registra "creada"', async () => {
      const create = vi.fn((datos) => datos);
      const save = vi.fn(async (tarea) => ({ ...tarea, id: 't1' }));
      const findAsignatura = vi.fn().mockResolvedValue({ id: 'a1' });
      const { servicio, historial } = crearServicio({ create, save }, { findOne: findAsignatura });

      await servicio.crear(datosTarea, 'u1');

      const guardado = create.mock.calls[0][0];
      expect(guardado.completada).toBe(false);
      expect(guardado.subtareas).toEqual([]);
      expect(guardado.usuario).toEqual({ id: 'u1' });
      expect(historial.registrarEvento).toHaveBeenCalledWith({
        usuarioId: 'u1',
        accion: 'creada',
        entidad: 'tarea',
        entidadId: 't1',
        titulo: 'Entrega 1',
      });
    });

    it('rechaza una asignatura que no es del usuario: no guarda ni registra evento', async () => {
      const create = vi.fn();
      const save = vi.fn();
      const findAsignatura = vi.fn().mockResolvedValue(null);
      const { servicio, historial } = crearServicio({ create, save }, { findOne: findAsignatura });

      await expect(servicio.crear(datosTarea, 'otro')).rejects.toBeInstanceOf(NotFoundException);

      expect(save).not.toHaveBeenCalled();
      expect(historial.registrarEvento).not.toHaveBeenCalled();
    });
  });

  describe('actualizar', () => {
    function servicioConTarea() {
      const tarea = { id: 't1', titulo: 'Entrega 1', completada: false };
      const findOne = vi.fn().mockResolvedValue(tarea);
      const save = vi.fn(async (t) => t);
      return crearServicio({ findOne, save });
    }

    it('registra "completada" cuando se marca completada = true', async () => {
      const { servicio, historial } = servicioConTarea();

      await servicio.actualizar('t1', { completada: true }, 'u1');

      expect(historial.registrarEvento).toHaveBeenCalledWith(
        expect.objectContaining({ accion: 'completada', entidad: 'tarea', entidadId: 't1' }),
      );
    });

    it('registra "editada" cuando se cambian otros campos', async () => {
      const { servicio, historial } = servicioConTarea();

      await servicio.actualizar('t1', { titulo: 'Entrega final' }, 'u1');

      expect(historial.registrarEvento).toHaveBeenCalledWith(
        expect.objectContaining({ accion: 'editada', titulo: 'Entrega final' }),
      );
    });

    it('no guarda ni registra evento si la tarea no es del usuario', async () => {
      const findOne = vi.fn().mockResolvedValue(null);
      const save = vi.fn();
      const { servicio, historial } = crearServicio({ findOne, save });

      await expect(servicio.actualizar('t1', { titulo: 'X' }, 'otro')).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(save).not.toHaveBeenCalled();
      expect(historial.registrarEvento).not.toHaveBeenCalled();
    });

    // Pendiente: hoy el PUT acepta Partial<CrearTareaDto> sin validar y hace Object.assign.
    it.todo('no debe permitir cambiar el dueño (usuario) ni el id de la tarea desde el cuerpo del PUT');
  });

  describe('eliminar', () => {
    it('elimina la tarea y registra "eliminada" con su título', async () => {
      const tarea = { id: 't1', titulo: 'Entrega 1' };
      const findOne = vi.fn().mockResolvedValue(tarea);
      const remove = vi.fn().mockResolvedValue(undefined);
      const { servicio, historial } = crearServicio({ findOne, remove });

      await servicio.eliminar('t1', 'u1');

      expect(remove).toHaveBeenCalledWith(tarea);
      expect(historial.registrarEvento).toHaveBeenCalledWith({
        usuarioId: 'u1',
        accion: 'eliminada',
        entidad: 'tarea',
        entidadId: 't1',
        titulo: 'Entrega 1',
      });
    });
  });
});