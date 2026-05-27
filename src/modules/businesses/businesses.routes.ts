import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { businessesController } from './businesses.controller';
import { businessIdParamSchema, createBusinessSchema, listBusinessSchema } from './businesses.schemas';
import { reviewsRoutes } from '../reviews/reviews.routes';

export const businessesRoutes = Router();

businessesRoutes.get('/', validate(listBusinessSchema), businessesController.list);
businessesRoutes.post('/', validate(createBusinessSchema), businessesController.create);
businessesRoutes.get('/:id', validate(businessIdParamSchema), businessesController.getById);
businessesRoutes.use('/:businessId/reviews', reviewsRoutes);
