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
  async update(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new AppError('Avaliação não encontrada.', 404);
  }

  if (review.userId !== userId) {
    throw new AppError('Você não tem permissão para editar esta avaliação.', 403);
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.comment !== undefined && { comment: data.comment }),
    },
    include: { comments: true },
  });
},

async delete(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new AppError('Avaliação não encontrada.', 404);
  }

  if (review.userId !== userId) {
    throw new AppError('Você não tem permissão para deletar esta avaliação.', 403);
  }

  await prisma.review.delete({ where: { id: reviewId } });

},

};
