import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRoles } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { businessIdParamSchema, createBusinessSchema, updateBusinessSchema } from '../businesses/businesses.schemas';
import { merchantController } from './merchant.controller';

export const merchantRoutes = Router();

merchantRoutes.use(authenticate, requireRoles(UserRole.MERCHANT, UserRole.ADMIN));
merchantRoutes.get('/dashboard', merchantController.dashboard);
merchantRoutes.get('/businesses', merchantController.businesses);
merchantRoutes.post('/businesses', validate(createBusinessSchema), merchantController.createBusiness);
merchantRoutes.patch('/businesses/:id', validate(updateBusinessSchema), merchantController.updateBusiness);
merchantRoutes.delete('/businesses/:id', validate(businessIdParamSchema), merchantController.removeBusiness);
