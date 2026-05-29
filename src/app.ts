import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import { adminRoutes } from './modules/admin/admin.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { businessesRoutes } from './modules/businesses/businesses.routes';
import { categoriesRoutes } from './modules/categories/categories.routes';
import { merchantRoutes } from './modules/merchant/merchant.routes';
import { usersRoutes } from './modules/users/users.routes';
import { asyncHandler } from './utils/async-handler';
import uploadRoutes from './routes/upload.routes';
export const app = express();

<<<<<<< Updated upstream
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_ORIGINS, credentials: true }));
=======
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
>>>>>>> Stashed changes
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get(
  '/api/v1/health',
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ data: { status: 'ok', database: 'ok', timestamp: new Date().toISOString() } });
  }),
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/businesses', businessesRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/merchant', merchantRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use((_req, res) => {
  res.status(404).json({ error: { message: 'Rota não encontrada.' } });
});

app.use(errorMiddleware);
