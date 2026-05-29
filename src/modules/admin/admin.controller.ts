import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { adminService } from './admin.service';

export const adminController = {
  dashboard: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await adminService.dashboard() });
  }),

  users: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await adminService.users() });
  }),

  getUserById: asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await adminService.getUserById(req.params.id) });
  }),

  createUser: asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json({ data: await adminService.createUser(req.body) });
  }),

  updateUser: asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await adminService.updateUser(req.params.id, req.body, req.user!.id) });
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    await adminService.deleteUser(req.params.id, req.user!.id);
    res.status(204).send();
  }),

  businesses: asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await adminService.businesses(req.query.status as any) });
  }),

  setBusinessStatus: asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await adminService.setBusinessStatus(req.params.id, req.body.status, req.user!.id) });
  }),

  setFeatured: asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await adminService.setFeatured(req.params.id, req.body.featured, req.user!.id) });
  }),

  deleteBusiness: asyncHandler(async (req: Request, res: Response) => {
    await adminService.deleteBusiness(req.params.id);
    res.status(204).send();
  }),

  categories: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await adminService.categories.list() });
  }),

  createCategory: asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json({ data: await adminService.categories.create(req.body) });
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await adminService.categories.update(req.params.id, req.body) });
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    await adminService.categories.remove(req.params.id);
    res.status(204).send();
  }),

  reviews: asyncHandler(async (_req: Request, res: Response) => {
    res.json({ data: await adminService.reviews() });
  }),

  deleteReview: asyncHandler(async (req: Request, res: Response) => {
    await adminService.deleteReview(req.params.id, req.user!.id);
    res.status(204).send();
  }),
};
