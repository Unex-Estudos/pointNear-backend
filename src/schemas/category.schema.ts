import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    iconName: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createCategorySchema.shape.body.partial(),
});

export const categoryIdSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
