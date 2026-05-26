import { CategoryRepository } from '../repositories/CategoryRepository';
import { EstablishmentFilters, EstablishmentRepository } from '../repositories/EstablishmentRepository';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';

export type EstablishmentPayload = {
  name: string;
  description: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  bannerImageUrl?: string;
  galleryImageUrls?: string[];
  openingHours?: string[];
  categoryId: string;
};

export class EstablishmentService {
  constructor(
    private readonly establishmentRepository = new EstablishmentRepository(),
    private readonly categoryRepository = new CategoryRepository(),
  ) {}

  async list(filters: EstablishmentFilters) {
    const [items, total] = await this.establishmentRepository.findPaginated(filters);
    return { items, meta: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) } };
  }

  listMine(ownerId: string) {
    return this.establishmentRepository.findByOwnerId(ownerId);
  }

  async findById(id: string) {
    const establishment = await this.establishmentRepository.findById(id);
    if (!establishment) throw new AppError('Estabelecimento não encontrado.', 404);
    return establishment;
  }

  async create(ownerId: string, data: EstablishmentPayload) {
    await this.ensureCategoryExists(data.categoryId);
    const slug = slugify(data.name);
    const existingEstablishment = await this.establishmentRepository.findBySlug(slug);
    if (existingEstablishment) throw new AppError('Já existe estabelecimento com este nome.', 409);
    return this.establishmentRepository.create({ ...data, slug, ownerId, galleryImageUrls: data.galleryImageUrls ?? [], openingHours: data.openingHours ?? [] });
  }

  async update(id: string, ownerId: string, data: Partial<EstablishmentPayload>) {
    const establishment = await this.findById(id);
    if (establishment.ownerId !== ownerId) throw new AppError('Acesso negado ao estabelecimento.', 403);
    if (data.categoryId) await this.ensureCategoryExists(data.categoryId);

    const slug = data.name ? slugify(data.name) : establishment.slug;
    const existingEstablishment = await this.establishmentRepository.findAnotherBySlug(slug, id);
    if (existingEstablishment) throw new AppError('Já existe estabelecimento com este nome.', 409);

    return this.establishmentRepository.update(establishment, { ...data, slug });
  }

  async remove(id: string, ownerId: string) {
    const establishment = await this.findById(id);
    if (establishment.ownerId !== ownerId) throw new AppError('Acesso negado ao estabelecimento.', 403);
    await this.establishmentRepository.update(establishment, { isActive: false });
  }

  async prepareImageUpload(file?: Express.Multer.File) {
    if (!file) throw new AppError('Arquivo de imagem não enviado.', 400);
    return { imageUrl: `/uploads/${file.filename}`, originalName: file.originalname };
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new AppError('Categoria inválida.', 400);
  }
}
