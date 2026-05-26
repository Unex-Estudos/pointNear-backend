import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { establishmentRoutes } from './establishment.routes';

const routes = Router();

routes.get('/health', (_request, response) => response.json({ status: 'ok', service: 'pointnear-api' }));
routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/establishments', establishmentRoutes);

export { routes };
