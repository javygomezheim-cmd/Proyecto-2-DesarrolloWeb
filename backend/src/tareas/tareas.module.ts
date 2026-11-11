import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareasController } from './tareas.controller.js';
import { TareasService } from './tareas.service.js';
import { Tarea } from './entities/tarea.entity.js';
import { Asignatura } from '../asignaturas/entities/asignatura.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Asignatura])],
  controllers: [TareasController],
  providers: [TareasService],
  exports: [TareasService],
})
export class TareasModule {}