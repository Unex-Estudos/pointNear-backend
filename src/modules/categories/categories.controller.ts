import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { categoriesService } from './categories.service';

export const categoriesController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoriesService.list();
    res.json({ data: categories });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.getBySlug(req.params.slug);
    res.json({ data: category });
  }),
};
