import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { reviewsService } from './reviews.service';

export const reviewsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const reviews = await reviewsService.list(req.params.businessId);
    res.json({ data: reviews });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewsService.create(req.params.businessId, req.body, req.user);
    res.status(201).json({ data: review });
  }),

  update: async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId = req.user!.id;
  const updated = await reviewsService.update(reviewId, userId, req.body);
  res.json(updated);
},

delete: async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId = req.user!.id;
  await reviewsService.delete(reviewId, userId);
  res.status(204).send();
},
};
