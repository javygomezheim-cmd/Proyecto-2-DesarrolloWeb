import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { AsignaturasModule } from './asignaturas/asignaturas.module.js';
import { TareasModule } from './tareas/tareas.module.js';
import { HistorialModule } from './historial/historial.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    // Conexión PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: 'localhost',
        port: 5432,
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // Conexión MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${encodeURIComponent(config.getOrThrow<string>('MONGO_USER'))}:${encodeURIComponent(config.getOrThrow<string>('MONGO_PASSWORD'))}@localhost:27017/${encodeURIComponent(config.getOrThrow<string>('MONGO_DB'))}?authSource=admin`,
      }),
    }),

    UsuariosModule,

    AsignaturasModule,

    TareasModule,

    HistorialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}