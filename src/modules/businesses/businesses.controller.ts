import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { businessesService } from './businesses.service';

export const businessesController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await businessesService.list(req.query);
    res.json(result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const business = await businessesService.getById(req.params.id);
    res.json({ data: business });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const business = await businessesService.create(req.body, req.user?.id ?? null, false);
    res.status(201).json({ data: business });
  }),
};
