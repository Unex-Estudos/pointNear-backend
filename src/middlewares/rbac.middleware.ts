import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils/app-error';

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Autenticação obrigatória.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Você não possui permissão para acessar este recurso.', 403));
    }

    next();
  };
}
