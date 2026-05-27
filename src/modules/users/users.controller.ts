import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { usersService } from './users.service';

export const usersController = {
  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.me(req.user!.id);
    res.json({ data: user });
  }),

  updateMe: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.updateMe(req.user!.id, req.body);
    res.json({ data: user });
  }),

  favorites: asyncHandler(async (req: Request, res: Response) => {
    const favorites = await usersService.favorites(req.user!.id);
    res.json({ data: favorites });
  }),

  addFavorite: asyncHandler(async (req: Request, res: Response) => {
    await usersService.addFavorite(req.user!.id, req.params.businessId);
    res.status(204).send();
  }),

  removeFavorite: asyncHandler(async (req: Request, res: Response) => {
    await usersService.removeFavorite(req.user!.id, req.params.businessId);
    res.status(204).send();
  }),
};
