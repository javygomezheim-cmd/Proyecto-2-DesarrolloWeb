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
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),

    // Conexión PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.getOrThrow<string>('POSTGRES_HOST'),
        port: Number(config.getOrThrow<string>('POSTGRES_PORT')),
        username: config.getOrThrow<string>('POSTGRES_USER'),
        password: config.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: config.getOrThrow<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // Conexión MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const usuario = encodeURIComponent(config.getOrThrow<string>('MONGO_USER'));
        const clave = encodeURIComponent(config.getOrThrow<string>('MONGO_PASSWORD'));
        const host = config.get<string>('MONGO_HOST', 'localhost');
        const puerto = config.get<string>('MONGO_PORT', '27017');
        const base = encodeURIComponent(config.getOrThrow<string>('MONGO_DB'));
        return {
          uri: `mongodb://${usuario}:${clave}@${host}:${puerto}/${base}?authSource=admin`,
        };
      },
    }),

    UsuariosModule,
    AsignaturasModule,
    TareasModule,
    HistorialModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}