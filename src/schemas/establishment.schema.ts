import { z } from 'zod';

const establishmentBody = z.object({
  name: z.string().min(2),
  description: z.string().min(20),
  phone: z.string().min(8),
  whatsapp: z.string().optional(),
  website: z.string().url().optional(),
  street: z.string().min(2),
  number: z.string().min(1),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  postalCode: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  bannerImageUrl: z.string().url().optional(),
  galleryImageUrls: z.array(z.string().url()).optional(),
  openingHours: z.array(z.string()).optional(),
  categoryId: z.string().uuid(),
});

export const createEstablishmentSchema = z.object({ body: establishmentBody });

export const updateEstablishmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: establishmentBody.partial(),
});

export const establishmentIdSchema = z.object({ params: z.object({ id: z.string().uuid() }) });

export const listEstablishmentsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(12),
  }),
});
