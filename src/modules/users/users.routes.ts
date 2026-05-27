import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { usersController } from './users.controller';
import { favoriteParamSchema, updateMeSchema } from './users.schemas';

export const usersRoutes = Router();

usersRoutes.use(authenticate);
usersRoutes.get('/me', usersController.me);
usersRoutes.patch('/me', validate(updateMeSchema), usersController.updateMe);
usersRoutes.get('/me/favorites', usersController.favorites);
usersRoutes.post('/me/favorites/:businessId', validate(favoriteParamSchema), usersController.addFavorite);
usersRoutes.delete('/me/favorites/:businessId', validate(favoriteParamSchema), usersController.removeFavorite);
