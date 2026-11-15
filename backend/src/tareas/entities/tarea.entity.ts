import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Asignatura } from '../../asignaturas/entities/asignatura.entity.js';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';

export const TIPOS_TAREA = ['tarea', 'evaluacion'] as const;
export const PRIORIDADES_TAREA = ['baja', 'media', 'alta'] as const;
export const ESTADOS_TAREA = ['pendiente', 'en_progreso', 'completada'] as const;

export type TipoTarea = (typeof TIPOS_TAREA)[number];
export type PrioridadTarea = (typeof PRIORIDADES_TAREA)[number];
export type EstadoTarea = (typeof ESTADOS_TAREA)[number];

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fecha_limite', type: 'timestamptz' })
  fechaLimite: Date;

  @Column({ default: false })
  completada: boolean;

  @Column({ type: 'varchar', length: 15, default: 'tarea' })
  tipo: TipoTarea;

  @Column({ type: 'varchar', length: 10, default: 'media' })
  prioridad: PrioridadTarea;

  @Column({ type: 'varchar', length: 15, default: 'pendiente' })
  estado: EstadoTarea;

  // Subtareas: [{ id, texto, hecha }]
  @Column({ type: 'jsonb', nullable: true, default: [] })
  subtareas: any[];

  @ManyToOne(() => Asignatura, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}