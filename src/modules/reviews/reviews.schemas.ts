import { z } from 'zod';

export const createReviewSchema = z.object({
  params: z.object({ businessId: z.string().uuid() }),
  body: z.object({
    authorName: z.string().min(2).optional(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(3),
  }),
});

export const listReviewsSchema = z.object({
  params: z.object({ businessId: z.string().uuid() }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().uuid('ID da avaliação inválido.'),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(3, 'Comentário deve ter pelo menos 3 caracteres.').optional(),
  }).refine(
    (data) => data.rating !== undefined || data.comment !== undefined,
    { message: 'Informe ao menos rating ou comment para atualizar.' }
  ),
});

export const deleteReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().uuid('ID da avaliação inválido.'),
  }),
});
