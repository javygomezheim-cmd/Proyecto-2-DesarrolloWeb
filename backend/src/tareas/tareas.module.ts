import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasController } from './tareas.controller.js';
import { TareasService } from './tareas.service.js';
import { Tarea } from './entities/tarea.entity.js';
import { Asignatura } from '../asignaturas/entities/asignatura.entity.js';
import { HistorialModule } from '../historial/historial.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarea, Asignatura]),
    HistorialModule,
  ],
  controllers: [TareasController],
  providers: [TareasService],
  exports: [TareasService],
})
export class TareasModule {}