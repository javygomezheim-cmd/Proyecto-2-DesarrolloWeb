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
    it('usa por defecto tipo "tarea", prioridad "media" y estado "pendiente"', async () => {
      const create = vi.fn((datos) => datos);
      const save = vi.fn(async (tarea) => ({ ...tarea, id: 't1' }));
      const { servicio } = crearServicio({ create, save }, { findOne: vi.fn().mockResolvedValue({ id: 'a1' }) });

      await servicio.crear(datosTarea, 'u1');

      expect(create.mock.calls[0][0]).toMatchObject({
        tipo: 'tarea',
        prioridad: 'media',
        estado: 'pendiente',
        completada: false,
      });
    });

    it('registra entidad "evaluacion" y deriva completada desde estado', async () => {
      const create = vi.fn((datos) => datos);
      const save = vi.fn(async (tarea) => ({ ...tarea, id: 't2' }));
      const { servicio, historial } = crearServicio({ create, save }, { findOne: vi.fn().mockResolvedValue({ id: 'a1' }) });

      await servicio.crear(
        { ...datosTarea, tipo: 'evaluacion', prioridad: 'alta', estado: 'completada' },
        'u1',
      );

      expect(create.mock.calls[0][0]).toMatchObject({
        tipo: 'evaluacion',
        prioridad: 'alta',
        estado: 'completada',
        completada: true,
      });
      expect(historial.registrarEvento).toHaveBeenCalledWith(
        expect.objectContaining({ entidad: 'evaluacion', accion: 'creada', entidadId: 't2' }),
      );
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
    it('al desmarcar completada vuelve a "pendiente" y mantiene la sincronización', async () => {
      const tarea = { id: 't1', titulo: 'T', completada: true, estado: 'completada', subtareas: [] };
      const findOne = vi.fn().mockResolvedValue(tarea);
      const save = vi.fn(async (t) => t);
      const { servicio } = crearServicio({ findOne, save });

      const resultado = await servicio.actualizar('t1', { completada: false }, 'u1');

      expect(resultado.estado).toBe('pendiente');
      expect(resultado.completada).toBe(false);
    });

    it('estado "completada" fuerza completada = true y registra "completada"', async () => {
      const tarea = { id: 't1', titulo: 'T', completada: false, estado: 'pendiente', subtareas: [] };
      const findOne = vi.fn().mockResolvedValue(tarea);
      const save = vi.fn(async (t) => t);
      const { servicio, historial } = crearServicio({ findOne, save });

      const resultado = await servicio.actualizar('t1', { estado: 'completada' }, 'u1');

      expect(resultado.completada).toBe(true);
      expect(historial.registrarEvento).toHaveBeenCalledWith(
        expect.objectContaining({ accion: 'completada', detalle: 'Estado: pendiente → completada' }),
      );
    });

    it('registra detalle con cambio de fecha, estado y avance de subtareas', async () => {
      const tarea = {
        id: 't1',
        titulo: 'Control',
        tipo: 'evaluacion',
        completada: false,
        estado: 'pendiente',
        prioridad: 'media',
        fechaLimite: new Date('2026-12-01T12:00:00Z'),
        subtareas: [
          { id: 1, texto: 'a', hecha: false },
          { id: 2, texto: 'b', hecha: false },
        ],
      };
      const findOne = vi.fn().mockResolvedValue(tarea);
      const save = vi.fn(async (t) => t);
      const { servicio, historial } = crearServicio({ findOne, save });

      await servicio.actualizar(
        't1',
        {
          fechaLimite: '2026-12-05T12:00:00Z',
          subtareas: [
            { id: 1, texto: 'a', hecha: true },
            { id: 2, texto: 'b', hecha: false },
          ],
        },
        'u1',
      );

      const evento = historial.registrarEvento.mock.calls[0][0];
      expect(evento.entidad).toBe('evaluacion');
      expect(evento.accion).toBe('editada');
      expect(evento.detalle).toContain('Fecha límite');
      expect(evento.detalle).toContain('Estado: pendiente → en_progreso');
      expect(evento.detalle).toContain('Subtareas: 0/2 → 1/2');
    });

    it('no envía detalle cuando solo cambia un campo sin seguimiento', async () => {
      const tarea = {
        id: 't1', titulo: 'T', completada: false, estado: 'pendiente',
        prioridad: 'media', subtareas: [],
      };
      const findOne = vi.fn().mockResolvedValue(tarea);
      const save = vi.fn(async (t) => t);
      const { servicio, historial } = crearServicio({ findOne, save });

      await servicio.actualizar('t1', { descripcion: 'nueva' }, 'u1');

      expect(historial.registrarEvento.mock.calls[0][0].detalle).toBeUndefined();
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