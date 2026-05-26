import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';

export class CategoryController {
  constructor(private readonly categoryService = new CategoryService()) {}

  list = async (_request: Request, response: Response) => {
    return response.json(await this.categoryService.list());
  };

  create = async (request: Request, response: Response) => {
    return response.status(201).json(await this.categoryService.create(request.body));
  };

  update = async (request: Request, response: Response) => {
    return response.json(await this.categoryService.update(String(request.params.id), request.body));
  };

  remove = async (request: Request, response: Response) => {
    await this.categoryService.remove(String(request.params.id));
    return response.status(204).send();
  };
}
