import { Request, Response } from 'express';
import { EstablishmentFilters } from '../repositories/EstablishmentRepository';
import { EstablishmentService } from '../services/EstablishmentService';

export class EstablishmentController {
  constructor(private readonly establishmentService = new EstablishmentService()) {}

  list = async (request: Request, response: Response) => {
    return response.json(await this.establishmentService.list(request.query as unknown as EstablishmentFilters));
  };

  mine = async (request: Request, response: Response) => {
    const establishments = await this.establishmentService.listMine(request.user!.id);
    return response.json({ items: establishments });
  };

  show = async (request: Request, response: Response) => {
    return response.json(await this.establishmentService.findById(String(request.params.id)));
  };

  create = async (request: Request, response: Response) => {
    return response.status(201).json(await this.establishmentService.create(request.user!.id, request.body));
  };

  update = async (request: Request, response: Response) => {
    return response.json(await this.establishmentService.update(String(request.params.id), request.user!.id, request.body));
  };

  remove = async (request: Request, response: Response) => {
    await this.establishmentService.remove(String(request.params.id), request.user!.id);
    return response.status(204).send();
  };

  uploadImage = async (request: Request, response: Response) => {
    return response.status(201).json(await this.establishmentService.prepareImageUpload(request.file));
  };
}
