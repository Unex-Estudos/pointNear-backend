import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details,
      },
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Dados inválidos.',
        details: error.flatten(),
      },
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: { message: 'Registro já existe.' } });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({ error: { message: 'Registro não encontrado.' } });
    }
  }

  console.error(error);

  return res.status(500).json({
    error: {
      message: 'Erro interno do servidor.',
      ...(env.NODE_ENV !== 'production' ? { details: String(error?.message ?? error) } : {}),
    },
  });
};
