import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/app-error';
import { createSlug } from '../../utils/slug';

export const categoriesService = {
  async list() {
    return prisma.category.findMany({ orderBy: { label: 'asc' } });
  },

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    return category;
  },

  async create(data: { label: string; iconName: string; color: string; slug?: string }) {
    return prisma.category.create({
      data: {
        slug: data.slug ? createSlug(data.slug) : createSlug(data.label),
        label: data.label,
        iconName: data.iconName,
        color: data.color,
      },
    });
  },

  async update(id: string, data: Partial<{ label: string; iconName: string; color: string; slug: string }>) {
    return prisma.category.update({
      where: { id },
      data: {
        ...data,
        ...(data.slug ? { slug: createSlug(data.slug) } : {}),
      },
    });
  },

  async remove(id: string) {
    const count = await prisma.business.count({ where: { categoryId: id } });

    if (count > 0) {
      throw new AppError('Não é possível remover uma categoria com negócios vinculados.', 409);
    }

    await prisma.category.delete({ where: { id } });
  },
};
