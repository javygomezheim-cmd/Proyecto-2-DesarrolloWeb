
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150, unique: true })
  correo: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
