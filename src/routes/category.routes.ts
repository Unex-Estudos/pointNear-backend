import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { UserRole } from '../entities/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import { categoryIdSchema, createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const categoryRoutes = Router();
const categoryController = new CategoryController();
const adminOnly = [authMiddleware, requireRole(UserRole.ADMIN)];

categoryRoutes.get('/', categoryController.list);
categoryRoutes.post('/', ...adminOnly, validateRequest(createCategorySchema), categoryController.create);
categoryRoutes.put('/:id', ...adminOnly, validateRequest(updateCategorySchema), categoryController.update);
categoryRoutes.delete('/:id', ...adminOnly, validateRequest(categoryIdSchema), categoryController.remove);

export { categoryRoutes };
