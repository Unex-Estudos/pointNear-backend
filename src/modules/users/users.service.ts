import { BusinessStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/app-error';
import { businessInclude, mapBusiness } from '../../utils/business-mapper';

export const usersService = {
  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
    };
  },

  async updateMe(userId: string, data: { name?: string; phone?: string; avatarUrl?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
    };
  },

  async favorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId, business: { status: BusinessStatus.APPROVED } },
      include: { business: { include: businessInclude } },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((favorite) => mapBusiness(favorite.business));
  },

  async addFavorite(userId: string, businessId: string) {
    const business = await prisma.business.findFirst({ where: { id: businessId, status: BusinessStatus.APPROVED } });

    if (!business) {
      throw new AppError('Negócio não encontrado.', 404);
    }

    await prisma.favorite.upsert({
      where: { userId_businessId: { userId, businessId } },
      update: {},
      create: { userId, businessId },
    });
  },

  async removeFavorite(userId: string, businessId: string) {
    await prisma.favorite.deleteMany({ where: { userId, businessId } });
  },
};
