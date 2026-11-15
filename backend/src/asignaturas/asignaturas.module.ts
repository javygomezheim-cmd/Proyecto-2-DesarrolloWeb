
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AsignaturasController } from './asignaturas.controller.js';
import { AsignaturasService } from './asignaturas.service.js';
import { Asignatura } from './entities/asignatura.entity.js';
import { HistorialModule } from '../historial/historial.module.js';

@Module({
  imports: [
  TypeOrmModule.forFeature([Asignatura]), HistorialModule],
  controllers: [AsignaturasController],
  providers: [AsignaturasService],
  exports: [AsignaturasService],
})
export class AsignaturasModule {}
