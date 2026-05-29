import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRoles } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { adminController } from './admin.controller';
import { businessStatusSchema, categorySchema, createUserSchema, featuredSchema, idParamSchema, listAdminBusinessesSchema, updateCategorySchema, updateUserSchema } from './admin.schemas';

export const adminRoutes = Router();

adminRoutes.use(authenticate, requireRoles(UserRole.ADMIN));
adminRoutes.get('/dashboard', adminController.dashboard);
adminRoutes.get('/users', adminController.users);
adminRoutes.post('/users', validate(createUserSchema), adminController.createUser);
adminRoutes.get('/users/:id', validate(idParamSchema), adminController.getUserById);
adminRoutes.patch('/users/:id', validate(updateUserSchema), adminController.updateUser);
adminRoutes.delete('/users/:id', validate(idParamSchema), adminController.deleteUser);
adminRoutes.get('/businesses', validate(listAdminBusinessesSchema), adminController.businesses);
adminRoutes.patch('/businesses/:id/status', validate(businessStatusSchema), adminController.setBusinessStatus);
adminRoutes.patch('/businesses/:id/featured', validate(featuredSchema), adminController.setFeatured);
adminRoutes.delete('/businesses/:id', validate(idParamSchema), adminController.deleteBusiness);
adminRoutes.get('/categories', adminController.categories);
adminRoutes.post('/categories', validate(categorySchema), adminController.createCategory);
adminRoutes.patch('/categories/:id', validate(updateCategorySchema), adminController.updateCategory);
adminRoutes.delete('/categories/:id', validate(idParamSchema), adminController.deleteCategory);
adminRoutes.get('/reviews', adminController.reviews);
adminRoutes.delete('/reviews/:id', validate(idParamSchema), adminController.deleteReview);
