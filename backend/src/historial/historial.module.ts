import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HistorialController } from './historial.controller.js';
import { HistorialService } from './historial.service.js';
import {
  HistorialActividad,
  HistorialActividadSchema,
} from './schemas/historial-actividad.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialActividad.name, schema: HistorialActividadSchema },
    ]),
  ],
  controllers: [HistorialController],
  providers: [HistorialService],
  exports: [HistorialService],
})
export class HistorialModule {}