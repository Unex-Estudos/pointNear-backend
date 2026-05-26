import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  API_BASE_URL: z.string().url().default('http://localhost:3333'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USERNAME: z.string().default('postgres'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_NAME: z.string().default('pointnear'),
  DATABASE_SYNCHRONIZE: z.coerce.boolean().default(false),
  DATABASE_LOGGING: z.coerce.boolean().default(false),
  JWT_SECRET: z.string().min(16).default('development-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  UPLOAD_DIRECTORY: z.string().default('uploads'),
});

export const environment = environmentSchema.parse(process.env);
