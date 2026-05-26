import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Establishment } from '../entities/Establishment';

export type EstablishmentFilters = {
  search?: string;
  categoryId?: string;
  page: number;
  limit: number;
};

export class EstablishmentRepository {
  private readonly repository: Repository<Establishment> = AppDataSource.getRepository(Establishment);

  findPaginated(filters: EstablishmentFilters) {
    const where: FindOptionsWhere<Establishment>[] = [];
    const baseWhere: FindOptionsWhere<Establishment> = { isActive: true };

    if (filters.categoryId) baseWhere.categoryId = filters.categoryId;

    if (filters.search) {
      where.push({ ...baseWhere, name: ILike(`%${filters.search}%`) });
      where.push({ ...baseWhere, neighborhood: ILike(`%${filters.search}%`) });
      where.push({ ...baseWhere, city: ILike(`%${filters.search}%`) });
    }

    return this.repository.findAndCount({
      where: where.length ? where : baseWhere,
      order: { createdAt: 'DESC' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    });
  }

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  findAnotherBySlug(slug: string, id: string) {
    return this.repository.findOne({ where: { slug, id: Not(id) } });
  }

  findByOwnerId(ownerId: string) {
    return this.repository.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  countByCategoryId(categoryId: string) {
    return this.repository.count({ where: { categoryId } });
  }

  create(data: Partial<Establishment>) {
    return this.repository.save(this.repository.create(data));
  }

  async update(establishment: Establishment, data: Partial<Establishment>) {
    Object.assign(establishment, data);
    return this.repository.save(establishment);
  }

  remove(establishment: Establishment) {
    return this.repository.remove(establishment);
  }
}
