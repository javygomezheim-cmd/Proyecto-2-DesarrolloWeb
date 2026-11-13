-- Datos de prueba - Agenda Académica (Hito 3)
-- Usuario demo: demo@agenda.cl / Demo1234
-- Las fechas son relativas a NOW() para que dashboard y calendario siempre tengan vencimientos.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios (id, nombre, correo, password_hash) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Estudiante Demo', 'demo@agenda.cl',
   crypt('Demo1234', gen_salt('bf', 10)))
ON CONFLICT (id) DO NOTHING;

INSERT INTO asignaturas (id, nombre, profesor, color, periodo, usuario_id) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'Cálculo II',   'Dr. Pérez',  '#2563EB', '2026-2', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000002', 'Programación', 'Prof. Soto', '#16A34A', '2026-2', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000003', 'Física',       'Prof. Rojas','#DC2626', '2026-2', 'a0000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tareas
  (id, titulo, descripcion, fecha_limite, completada, tipo, prioridad, estado, subtareas, asignatura_id, usuario_id)
VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Control 1 de integrales', 'Integrales por partes y sustitución.',
   now() + interval '2 days', false, 'evaluacion', 'alta', 'en_progreso',
   '[{"id":1,"texto":"Repasar guía 3","hecha":true},{"id":2,"texto":"Resolver ejercicios propuestos","hecha":false}]'::jsonb,
   'b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001'),

  ('c0000000-0000-4000-8000-000000000002', 'Informe de laboratorio 2', 'Péndulo simple: datos y conclusiones.',
   now() + interval '5 days', false, 'tarea', 'media', 'pendiente',
   '[]'::jsonb,
   'b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001'),

  ('c0000000-0000-4000-8000-000000000003', 'Certamen 1', 'Estructuras de datos y complejidad.',
   now() + interval '10 days', false, 'evaluacion', 'alta', 'pendiente',
   '[{"id":1,"texto":"Listas y pilas","hecha":false},{"id":2,"texto":"Árboles","hecha":false},{"id":3,"texto":"Notación O","hecha":false}]'::jsonb,
   'b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001'),

  ('c0000000-0000-4000-8000-000000000004', 'Resumen capítulo 3', 'Resumen de una página.',
   now() - interval '2 days', false, 'tarea', 'baja', 'pendiente',
   '[]'::jsonb,
   'b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001'),

  ('c0000000-0000-4000-8000-000000000005', 'Guía de ejercicios 3', 'Series y convergencia.',
   now() - interval '1 day', true, 'tarea', 'media', 'completada',
   '[{"id":1,"texto":"Ejercicios 1-10","hecha":true},{"id":2,"texto":"Ejercicios 11-20","hecha":true}]'::jsonb,
   'b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001'),

  ('c0000000-0000-4000-8000-000000000006', 'Proyecto final', 'API REST con persistencia dual.',
   now() + interval '20 days', false, 'tarea', 'alta', 'en_progreso',
   '[{"id":1,"texto":"Modelo de datos","hecha":true},{"id":2,"texto":"Endpoints","hecha":false},{"id":3,"texto":"Informe","hecha":false}]'::jsonb,
   'b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO NOTHING;
