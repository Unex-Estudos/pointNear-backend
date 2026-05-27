import { z } from 'zod';

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

export const favoriteParamSchema = z.object({
  params: z.object({ businessId: z.string().uuid() }),
});
