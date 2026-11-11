import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { TareasService } from './tareas.service.js';
import { Tarea } from './entities/tarea.entity.js';
import { Asignatura } from '../asignaturas/entities/asignatura.entity.js';

describe('TareasService', () => {
  let service: TareasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasService,
        { provide: getRepositoryToken(Tarea), useValue: {} },
        { provide: getRepositoryToken(Asignatura), useValue: {} },
      ],
    }).compile();

    service = module.get<TareasService>(TareasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});