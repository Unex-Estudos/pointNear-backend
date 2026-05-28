import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { reviewsController } from './reviews.controller';
import {
  createReviewSchema,
  listReviewsSchema,
  updateReviewSchema,
  deleteReviewSchema,
} from './reviews.schemas';

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

export const reviewsRoutes = Router({ mergeParams: true });

reviewsRoutes.get('/', validate(listReviewsSchema), reviewsController.list);
reviewsRoutes.post('/', reviewLimiter, authenticate, validate(createReviewSchema), reviewsController.create);
reviewsRoutes.patch('/:reviewId', authenticate, validate(updateReviewSchema), reviewsController.update);
reviewsRoutes.delete('/:reviewId', authenticate, validate(deleteReviewSchema), reviewsController.delete);