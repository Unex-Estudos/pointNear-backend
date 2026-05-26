import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { validateRequest } from '../middlewares/validateRequest';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', validateRequest(registerSchema), authController.register);
authRoutes.post('/login', validateRequest(loginSchema), authController.login);

export { authRoutes };
