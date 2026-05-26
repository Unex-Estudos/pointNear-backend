import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { Category } from '../entities/Category';
import { User, UserRole } from '../entities/User';
import { slugify } from '../utils/slugify';

const categories = [
  { name: 'Restaurantes', iconName: 'utensils', description: 'Comida local, delivery e experiências gastronômicas.' },
  { name: 'Saúde', iconName: 'heart-pulse', description: 'Clínicas, consultórios e serviços de bem-estar.' },
  { name: 'Serviços', iconName: 'briefcase-business', description: 'Serviços essenciais perto de você.' },
  { name: 'Lazer', iconName: 'map', description: 'Passeios, experiências e entretenimento.' },
];

async function seed() {
  await AppDataSource.initialize();
  const categoryRepository = AppDataSource.getRepository(Category);
  const userRepository = AppDataSource.getRepository(User);

  for (const category of categories) {
    const slug = slugify(category.name);
    const exists = await categoryRepository.findOne({ where: { slug } });
    if (!exists) await categoryRepository.save(categoryRepository.create({ ...category, slug }));
  }

  const ownerEmail = 'admin@pointnear.local';
  const ownerExists = await userRepository.findOne({ where: { email: ownerEmail } });
  if (!ownerExists) {
    await userRepository.save(userRepository.create({ fullName: 'Administrador PointNear', email: ownerEmail, passwordHash: await bcrypt.hash('PointNear@123', 10), role: UserRole.ADMIN }));
  }

  await AppDataSource.destroy();
  console.log('Seed finalizado com sucesso.');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
