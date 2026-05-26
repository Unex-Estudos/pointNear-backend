import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../entities/User';
import { AppError } from '../utils/AppError';

export function requireRole(...roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return next(new AppError('Acesso negado.', 403));
    }

    return next();
  };
}
