import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './Category';
import { User } from './User';

@Entity('establishments')
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar' })
  phone!: string;

  @Column({ type: 'varchar', nullable: true })
  whatsapp?: string;

  @Column({ type: 'varchar', nullable: true })
  website?: string;

  @Column({ type: 'varchar' })
  street!: string;

  @Column({ type: 'varchar' })
  number!: string;

  @Column({ type: 'varchar' })
  neighborhood!: string;

  @Column({ type: 'varchar' })
  city!: string;

  @Column({ type: 'varchar' })
  state!: string;

  @Column({ type: 'varchar', nullable: true })
  postalCode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'varchar', nullable: true })
  bannerImageUrl?: string;

  @Column('simple-array', { default: '' })
  galleryImageUrls!: string[];

  @Column('simple-array', { default: '' })
  openingHours!: string[];

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToOne(() => Category, (category) => category.establishments, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @Column({ type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => User, (owner) => owner.establishments, { eager: false })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column({ type: 'uuid' })
  ownerId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
