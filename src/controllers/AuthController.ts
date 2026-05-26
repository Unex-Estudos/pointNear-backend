import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (request: Request, response: Response) => {
    const result = await this.authService.register(request.body);
    return response.status(201).json(result);
  };

  login = async (request: Request, response: Response) => {
    const result = await this.authService.login(request.body);
    return response.json(result);
  };
}
