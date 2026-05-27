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
};
