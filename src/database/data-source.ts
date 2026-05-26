import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { environment } from '../config/environment';
import { Category } from '../entities/Category';
import { Establishment } from '../entities/Establishment';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: environment.DATABASE_HOST,
  port: environment.DATABASE_PORT,
  username: environment.DATABASE_USERNAME,
  password: environment.DATABASE_PASSWORD,
  database: environment.DATABASE_NAME,
  synchronize: environment.DATABASE_SYNCHRONIZE,
  logging: environment.DATABASE_LOGGING,
  entities: [Category, Establishment, User],
});
