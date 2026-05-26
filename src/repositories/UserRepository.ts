import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';

export class UserRepository {
  private readonly repository: Repository<User> = AppDataSource.getRepository(User);

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<User>) {
    return this.repository.save(this.repository.create(data));
  }
}
