import { Router } from 'express';
import { categoriesController } from './categories.controller';

export const categoriesRoutes = Router();

categoriesRoutes.get('/', categoriesController.list);
categoriesRoutes.get('/:slug', categoriesController.getBySlug);
