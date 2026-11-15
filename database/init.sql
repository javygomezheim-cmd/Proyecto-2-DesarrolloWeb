-- Esquema PostgreSQL - Agenda Académica (Hito 3)
-- Se ejecuta solo con el volumen vacío: docker compose down -v && docker compose up -d

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuarios (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre        varchar(100) NOT NULL,
    correo        varchar(150) NOT NULL UNIQUE,
    password_hash varchar(255) NOT NULL,
    creado_en     timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS asignaturas (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre     varchar(100) NOT NULL,
    profesor   varchar(100) NOT NULL,
    color      varchar(7)   NOT NULL,
    periodo    varchar(10)  NOT NULL DEFAULT '2026-2',
    usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    creado_en  timestamp NOT NULL DEFAULT now(),
    CONSTRAINT chk_asignaturas_periodo CHECK (periodo ~ '^[0-9]{4}-[12]$')
);

CREATE TABLE IF NOT EXISTS tareas (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo        varchar(150) NOT NULL,
    descripcion   text,
    fecha_limite  timestamptz NOT NULL,
    completada    boolean NOT NULL DEFAULT false,
    tipo          varchar(15) NOT NULL DEFAULT 'tarea',
    prioridad     varchar(10) NOT NULL DEFAULT 'media',
    estado        varchar(15) NOT NULL DEFAULT 'pendiente',
    subtareas     jsonb DEFAULT '[]'::jsonb,
    asignatura_id uuid NOT NULL REFERENCES asignaturas(id) ON DELETE CASCADE,
    usuario_id    uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    creado_en     timestamp NOT NULL DEFAULT now(),
    CONSTRAINT chk_tareas_tipo      CHECK (tipo IN ('tarea', 'evaluacion')),
    CONSTRAINT chk_tareas_prioridad CHECK (prioridad IN ('baja', 'media', 'alta')),
    CONSTRAINT chk_tareas_estado    CHECK (estado IN ('pendiente', 'en_progreso', 'completada')),
    CONSTRAINT chk_tareas_sync      CHECK (completada = (estado = 'completada'))
);

CREATE INDEX IF NOT EXISTS idx_asignaturas_usuario ON asignaturas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_tareas_usuario_fecha ON tareas (usuario_id, fecha_limite);
CREATE INDEX IF NOT EXISTS idx_tareas_asignatura ON tareas (asignatura_id);

-- Evaluaciones: vista sobre tareas con tipo = 'evaluacion'
CREATE OR REPLACE VIEW evaluaciones AS
    SELECT * FROM tareas WHERE tipo = 'evaluacion';
