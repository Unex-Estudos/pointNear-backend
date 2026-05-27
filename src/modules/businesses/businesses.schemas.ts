import { z } from 'zod';

const hourSchema = z.object({
  open: z.string().default('09:00'),
  close: z.string().default('18:00'),
  closed: z.boolean().default(false),
});

export const businessPayloadSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  subcategories: z.array(z.string()).default([]),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(2),
    zip: z.string().min(1),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
  }),
  contact: z.object({
    phone: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    instagram: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
  }),
  hours: z
    .object({
      segunda: hourSchema,
      terca: hourSchema,
      quarta: hourSchema,
      quinta: hourSchema,
      sexta: hourSchema,
      sabado: hourSchema,
      domingo: hourSchema,
    })
    .optional(),
  photos: z.array(z.string().url()).default([]),
  services: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().min(0),
        description: z.string().optional(),
      }),
    )
    .default([]),
  priceRange: z.enum(['$', '$$', '$$$']).default('$$'),
});

export const createBusinessSchema = z.object({
  body: businessPayloadSchema,
});

export const updateBusinessSchema = z.object({
  body: businessPayloadSchema.partial(),
  params: z.object({ id: z.string().uuid() }),
});

export const listBusinessSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    local: z.string().optional(),
    categoria: z.union([z.string(), z.array(z.string())]).optional(),
    openNow: z.coerce.boolean().optional(),
    minRating: z.coerce.number().optional(),
    sort: z.enum(['featured', 'relevance', 'rating', 'reviews', 'newest']).optional(),
    featured: z.coerce.boolean().optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
});

export const businessIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
