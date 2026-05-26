import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Establishment } from './Establishment';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  fullName!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.OWNER })
  role!: UserRole;

  @OneToMany(() => Establishment, (establishment) => establishment.owner)
  establishments!: Establishment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
