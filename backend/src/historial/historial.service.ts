import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  HistorialActividad,
  HistorialActividadDocument,
} from './schemas/historial-actividad.schema.js';
import { CrearHistorialDto } from './dto/crear-historial.dto.js';

@Injectable()
export class HistorialService {
  private readonly logger = new Logger(HistorialService.name);

  constructor(
    @InjectModel(HistorialActividad.name)
    private readonly historialModel: Model<HistorialActividadDocument>,
  ) {}

  async registrarEvento(datos: CrearHistorialDto): Promise<void> {
    try {
      await this.historialModel.create(datos);
    } catch (error) {
      this.logger.error('No se pudo registrar el evento en el historial', error);
    }
  }

  async listar(usuarioId: string, entidad?: string, limite = 50) {
    const filtro: Record<string, string> = { usuarioId };
    if (entidad) {
      filtro.entidad = entidad;
    }

    return this.historialModel
      .find(filtro)
      .sort({ fecha: -1 })
      .limit(limite)
      .exec();
  }
}