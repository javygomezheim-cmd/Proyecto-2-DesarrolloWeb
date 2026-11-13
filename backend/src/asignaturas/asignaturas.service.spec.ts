import { describe, it, expect, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

import { AsignaturasService } from './asignaturas.service.js';

function crearServicio(repositorio: Record<string, unknown>) {
  const historial = { registrarEvento: vi.fn().mockResolvedValue(undefined) };
  const servicio = new AsignaturasService(repositorio as never, historial as never);
  return { servicio, historial };
}

describe('AsignaturasService', () => {
  describe('buscarUna', () => {
    it('busca por id y por usuario dueño', async () => {
      const findOne = vi.fn().mockResolvedValue({ id: 'a1' });
      const { servicio } = crearServicio({ findOne });

      await servicio.buscarUna('a1', 'u1');

      expect(findOne).toHaveBeenCalledWith({
        where: { id: 'a1', usuario: { id: 'u1' } },
      });
    });

    it('lanza NotFoundException si no existe o es de otro usuario', async () => {
      const findOne = vi.fn().mockResolvedValue(null);
      const { servicio } = crearServicio({ findOne });

      await expect(servicio.buscarUna('a1', 'otro')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('crear', () => {
    it('guarda la asignatura y registra el evento "creada"', async () => {
      const create = vi.fn((datos) => datos);
      const save = vi.fn(async (asignatura) => ({ ...asignatura, id: 'a1' }));
      const { servicio, historial } = crearServicio({ create, save });

      const resultado = await servicio.crear(
        { nombre: 'Matemática', profesor: 'Juan', color: '#2563eb' },
        'u1',
      );

      expect(create).toHaveBeenCalledWith({
        nombre: 'Matemática',
        profesor: 'Juan',
        color: '#2563eb',
        usuario: { id: 'u1' },
      });
      expect(resultado.id).toBe('a1');
      expect(historial.registrarEvento).toHaveBeenCalledWith({
        usuarioId: 'u1',
        accion: 'creada',
        entidad: 'asignatura',
        entidadId: 'a1',
        titulo: 'Matemática',
      });
    });

    it('persiste el periodo académico recibido', async () => {
      const create = vi.fn((datos) => datos);
      const save = vi.fn(async (asignatura) => ({ ...asignatura, id: 'a2' }));
      const { servicio } = crearServicio({ create, save });

      await servicio.crear(
        { nombre: 'Física', profesor: 'Ana', color: '#16a34a', periodo: '2026-1' },
        'u1',
      );

      expect(create).toHaveBeenCalledWith(expect.objectContaining({ periodo: '2026-1' }));
    });
  });

  describe('actualizar', () => {
    it('cambia solo los campos enviados y registra "editada"', async () => {
      const existente = { id: 'a1', nombre: 'Mat', profesor: 'Juan', color: '#000000' };
      const findOne = vi.fn().mockResolvedValue(existente);
      const save = vi.fn(async (asignatura) => asignatura);
      const { servicio, historial } = crearServicio({ findOne, save });

      const resultado = await servicio.actualizar('a1', { nombre: 'Cálculo' }, 'u1');

      expect(resultado.nombre).toBe('Cálculo');
      expect(resultado.profesor).toBe('Juan');
      expect(resultado.color).toBe('#000000');
      expect(historial.registrarEvento).toHaveBeenCalledWith({
        usuarioId: 'u1',
        accion: 'editada',
        entidad: 'asignatura',
        entidadId: 'a1',
        titulo: 'Cálculo',
      });
    });
    
    it('actualiza el periodo sin tocar los demás campos', async () => {
      const existente = { id: 'a1', nombre: 'Mat', profesor: 'Juan', color: '#000000', periodo: '2026-2' };
      const findOne = vi.fn().mockResolvedValue(existente);
      const save = vi.fn(async (asignatura) => asignatura);
      const { servicio } = crearServicio({ findOne, save });

      const resultado = await servicio.actualizar('a1', { periodo: '2027-1' }, 'u1');

      expect(resultado.periodo).toBe('2027-1');
      expect(resultado.nombre).toBe('Mat');
    });

    it('no guarda ni registra evento si la asignatura no es del usuario', async () => {
      const findOne = vi.fn().mockResolvedValue(null);
      const save = vi.fn();
      const { servicio, historial } = crearServicio({ findOne, save });

      await expect(servicio.actualizar('a1', { nombre: 'X' }, 'otro')).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(save).not.toHaveBeenCalled();
      expect(historial.registrarEvento).not.toHaveBeenCalled();
    });
  });

  describe('eliminar', () => {
    it('elimina la asignatura y registra "eliminada" con su nombre', async () => {
      const existente = { id: 'a1', nombre: 'Física' };
      const findOne = vi.fn().mockResolvedValue(existente);
      const remove = vi.fn().mockResolvedValue(undefined);
      const { servicio, historial } = crearServicio({ findOne, remove });

      await servicio.eliminar('a1', 'u1');

      expect(remove).toHaveBeenCalledWith(existente);
      expect(historial.registrarEvento).toHaveBeenCalledWith({
        usuarioId: 'u1',
        accion: 'eliminada',
        entidad: 'asignatura',
        entidadId: 'a1',
        titulo: 'Física',
      });
    });

    it('no elimina ni registra evento si la asignatura no es del usuario', async () => {
      const findOne = vi.fn().mockResolvedValue(null);
      const remove = vi.fn();
      const { servicio, historial } = crearServicio({ findOne, remove });

      await expect(servicio.eliminar('a1', 'otro')).rejects.toBeInstanceOf(NotFoundException);

      expect(remove).not.toHaveBeenCalled();
      expect(historial.registrarEvento).not.toHaveBeenCalled();
    });
  });
});