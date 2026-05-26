import { CategoryRepository } from '../repositories/CategoryRepository';
import { EstablishmentRepository } from '../repositories/EstablishmentRepository';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';

export class CategoryService {
  constructor(
    private readonly categoryRepository = new CategoryRepository(),
    private readonly establishmentRepository = new EstablishmentRepository(),
  ) {}

  list() {
    return this.categoryRepository.findAll();
  }

  async create(data: { name: string; iconName?: string; description?: string }) {
    const slug = slugify(data.name);
    const existingCategory = await this.categoryRepository.findBySlug(slug);
    if (existingCategory) throw new AppError('Categoria já cadastrada.', 409);
    return this.categoryRepository.create({ ...data, slug });
  }

  async update(id: string, data: { name?: string; iconName?: string; description?: string }) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new AppError('Categoria não encontrada.', 404);

    const slug = data.name ? slugify(data.name) : category.slug;
    const existingCategory = await this.categoryRepository.findAnotherBySlug(slug, id);
    if (existingCategory) throw new AppError('Categoria já cadastrada.', 409);

    return this.categoryRepository.update(category, { ...data, slug });
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new AppError('Categoria não encontrada.', 404);

    const establishmentsCount = await this.establishmentRepository.countByCategoryId(id);
    if (establishmentsCount > 0) throw new AppError('Categoria possui estabelecimentos vinculados.', 409);

    await this.categoryRepository.remove(category);
  }
}
