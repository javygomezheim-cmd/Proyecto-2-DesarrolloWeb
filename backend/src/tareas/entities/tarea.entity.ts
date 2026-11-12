import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Asignatura } from '../../asignaturas/entities/asignatura.entity.js';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fecha_limite', type: 'timestamp' })
  fechaLimite: Date;

  @Column({ default: false })
  completada: boolean;

  // Maneja las subtareas directamente
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