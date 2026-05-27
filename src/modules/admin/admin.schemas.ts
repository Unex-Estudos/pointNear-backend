import { BusinessStatus, UserRole } from '@prisma/client';
import { z } from 'zod';

export const businessStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ status: z.nativeEnum(BusinessStatus) }),
});

export const featuredSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ featured: z.boolean() }),
});

export const listAdminBusinessesSchema = z.object({
  query: z.object({ status: z.nativeEnum(BusinessStatus).optional() }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.nativeEnum(UserRole).optional(),
  }),
});

export const categorySchema = z.object({
  body: z.object({
    label: z.string().min(2),
    slug: z.string().optional(),
    iconName: z.string().min(1),
    color: z.string().min(1),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: categorySchema.shape.body.partial(),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
