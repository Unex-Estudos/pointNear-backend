import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { merchantService } from './merchant.service';

export const merchantController = {
  dashboard: asyncHandler(async (req: Request, res: Response) => {
    const data = await merchantService.dashboard(req.user!.id);
    res.json({ data });
  }),

  businesses: asyncHandler(async (req: Request, res: Response) => {
    const data = await merchantService.businesses(req.user!.id);
    res.json({ data });
  }),

  createBusiness: asyncHandler(async (req: Request, res: Response) => {
    const data = await merchantService.createBusiness(req.user!.id, req.body);
    res.status(201).json({ data });
  }),

  updateBusiness: asyncHandler(async (req: Request, res: Response) => {
    const data = await merchantService.updateBusiness(req.user!.id, req.params.id, req.body);
    res.json({ data });
  }),

  removeBusiness: asyncHandler(async (req: Request, res: Response) => {
    await merchantService.removeBusiness(req.user!.id, req.params.id);
    res.status(204).send();
  }),
};
