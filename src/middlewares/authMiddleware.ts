import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import { UserRole } from '../entities/User';
import { AppError } from '../utils/AppError';

type TokenPayload = { sub: string; role: UserRole };

export function authMiddleware(request: Request, _response: Response, next: NextFunction) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return next(new AppError('Token de autenticação não informado.', 401));
  }

  const [, token] = authorizationHeader.split(' ');

  try {
    const payload = jwt.verify(token, environment.JWT_SECRET) as TokenPayload;
    request.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
}
