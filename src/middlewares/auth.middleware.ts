import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/app-error';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new AppError('Token de autenticação não informado.', 401);
    }

    const token = authorization.replace('Bearer ', '').trim();
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Token inválido ou expirado.', 401));
  }
}
