import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { TareasController } from './tareas.controller.js';
import { TareasService } from './tareas.service.js';

describe('TareasController', () => {
  let controller: TareasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareasController],
      providers: [
        {
          provide: TareasService,
          useValue: { crear: vi.fn(), buscarTodas: vi.fn(), buscarUna: vi.fn(), actualizar: vi.fn(), eliminar: vi.fn() },
        },
      ],
    }).compile();

    controller = module.get<TareasController>(TareasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});