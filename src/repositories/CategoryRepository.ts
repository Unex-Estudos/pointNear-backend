import { Not, Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Category } from '../entities/Category';

export class CategoryRepository {
  private readonly repository: Repository<Category> = AppDataSource.getRepository(Category);

  findAll() {
    return this.repository.find({ order: { name: 'ASC' } });
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

  create(data: Partial<Category>) {
    return this.repository.save(this.repository.create(data));
  }

  async update(category: Category, data: Partial<Category>) {
    Object.assign(category, data);
    return this.repository.save(category);
  }

  remove(category: Category) {
    return this.repository.remove(category);
  }
}
