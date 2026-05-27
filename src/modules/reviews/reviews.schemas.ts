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
