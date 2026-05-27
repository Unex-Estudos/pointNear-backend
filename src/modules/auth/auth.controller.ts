import { Request, Response } from 'express';
import { env } from '../../config/env';
import { asyncHandler } from '../../utils/async-handler';
import { authService } from './auth.service';

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: env.JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  });
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({ data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.json({ data: result });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.cookies.refreshToken ?? req.body.refreshToken);
    setRefreshCookie(res, result.refreshToken);
    res.json({ data: result });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id, req.cookies.refreshToken ?? req.body?.refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);
    res.json({ data: user });
  }),
};
