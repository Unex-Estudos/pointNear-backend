import { BusinessStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/app-error';

export const reviewsService = {
  async list(businessId: string) {
    const business = await prisma.business.findFirst({
      where: { id: businessId, status: BusinessStatus.APPROVED },
    });

    if (!business) {
      throw new AppError('Negócio não encontrado.', 404);
    }

    return prisma.review.findMany({
      where: { businessId },
      include: { comments: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(businessId: string, data: { authorName?: string; rating: number; comment: string }, user?: { id: string }) {
    const business = await prisma.business.findFirst({
      where: { id: businessId, status: BusinessStatus.APPROVED },
    });

    if (!business) {
      throw new AppError('Negócio não encontrado.', 404);
    }

    const dbUser = user?.id ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

    return prisma.review.create({
      data: {
        businessId,
        userId: dbUser?.id,
        authorName: dbUser?.name ?? data.authorName ?? 'Visitante',
        rating: data.rating,
        comment: data.comment,
      },
      include: { comments: true },
    });
  },
};
