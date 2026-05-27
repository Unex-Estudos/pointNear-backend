import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { authController } from './auth.controller';
import { loginSchema, refreshSchema, registerSchema } from './auth.schemas';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, validate(registerSchema), authController.register);
authRoutes.post('/login', authLimiter, validate(loginSchema), authController.login);
authRoutes.post('/refresh', validate(refreshSchema), authController.refresh);
authRoutes.post('/logout', authenticate, authController.logout);
authRoutes.get('/me', authenticate, authController.me);
