import { BusinessStatus, Prisma, WeekDay } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/app-error';
import { businessInclude, mapBusiness, toPriceRange, weekDays } from '../../utils/business-mapper';
import { getPagination, paginationMeta } from '../../utils/pagination';
import { createUniqueSlug } from '../../utils/slug';

const dayKeyToEnum: Record<string, WeekDay> = {
  segunda: 'SEGUNDA',
  terca: 'TERCA',
  quarta: 'QUARTA',
  quinta: 'QUINTA',
  sexta: 'SEXTA',
  sabado: 'SABADO',
  domingo: 'DOMINGO',
};

const defaultHours = {
  segunda: { open: '09:00', close: '18:00', closed: false },
  terca: { open: '09:00', close: '18:00', closed: false },
  quarta: { open: '09:00', close: '18:00', closed: false },
  quinta: { open: '09:00', close: '18:00', closed: false },
  sexta: { open: '09:00', close: '18:00', closed: false },
  sabado: { open: '09:00', close: '13:00', closed: false },
  domingo: { open: '00:00', close: '00:00', closed: true },
};

type BusinessPayload = {
  name: string;
  description: string;
  category: string;
  subcategories?: string[];
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    lat?: number | null;
    lng?: number | null;
  };
  contact: {
    phone?: string | null;
    whatsapp?: string | null;
    instagram?: string | null;
    email?: string | null;
  };
  hours?: typeof defaultHours;
  photos?: string[];
  services?: Array<{ name: string; price: number; description?: string }>;
  priceRange?: string;
};

function buildHourRows(hours?: typeof defaultHours) {
  const source = hours ?? defaultHours;
  return Object.entries(source).map(([day, value]) => ({
    day: dayKeyToEnum[day],
    open: value.open,
    close: value.close,
    closed: value.closed,
  }));
}

function currentDay() {
  const day = new Date().getDay();
  return weekDays[[6, 0, 1, 2, 3, 4, 5][day]];
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function isBusinessOpenNow(business: any) {
  const hour = business.hours?.find((item: any) => item.day === currentDay());
  if (!hour || hour.closed) return false;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const open = timeToMinutes(hour.open);
  const close = timeToMinutes(hour.close);

  if (open === close) return true;
  if (open < close) return current >= open && current <= close;
  return current >= open || current <= close;
}

export const businessesService = {
  async list(query: Record<string, any>) {
    const { page, limit, skip } = getPagination(query);
    const where: Prisma.BusinessWhereInput = {
      status: BusinessStatus.APPROVED,
    };

    if (query.featured !== undefined) {
      where.featured = Boolean(query.featured);
    }

    if (query.categoria) {
      const categorias = Array.isArray(query.categoria) ? query.categoria : [query.categoria];
      where.category = { slug: { in: categorias.map(String) } };
    }

    if (query.local) {
      const local = String(query.local);
      where.OR = [
        ...(where.OR ?? []),
        { neighborhood: { contains: local, mode: 'insensitive' } },
        { street: { contains: local, mode: 'insensitive' } },
        { city: { contains: local, mode: 'insensitive' } },
        { zip: { contains: local, mode: 'insensitive' } },
      ];
    }

    if (query.q) {
      const q = String(query.q);
      const searchOr: Prisma.BusinessWhereInput[] = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { subcategories: { some: { name: { contains: q, mode: 'insensitive' } } } },
      ];
      where.AND = [...(Array.isArray(where.AND) ? where.AND : []), { OR: searchOr }];
    }

    const orderBy: Prisma.BusinessOrderByWithRelationInput =
      query.sort === 'newest'
        ? { createdAt: 'desc' }
        : query.sort === 'reviews'
          ? { reviews: { _count: 'desc' } }
          : { featured: 'desc' };

    const [total, businesses] = await Promise.all([
      prisma.business.count({ where }),
      prisma.business.findMany({
        where,
        include: businessInclude,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    let data = businesses.map(mapBusiness);

    if (query.openNow) {
      data = data.filter((business, index) => isBusinessOpenNow(businesses[index]));
    }

    if (query.minRating) {
      data = data.filter((business) => business.rating >= Number(query.minRating));
    }

    if (query.sort === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    }

    if (query.sort === 'reviews') {
      data.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return {
      data,
      meta: paginationMeta(page, limit, total),
    };
  },

  async getById(id: string, includePrivate = false) {
    const business = await prisma.business.findFirst({
      where: {
        id,
        ...(includePrivate ? {} : { status: BusinessStatus.APPROVED }),
      },
      include: businessInclude,
    });

    if (!business) {
      throw new AppError('Negócio não encontrado.', 404);
    }

    return mapBusiness(business);
  },

  async create(data: BusinessPayload, ownerId?: string | null, approved = false) {
    const category = await prisma.category.findUnique({ where: { slug: data.category } });

    if (!category) {
      throw new AppError('Categoria inválida.', 400);
    }

    const slug = createUniqueSlug(data.name, Date.now().toString(36));

    const business = await prisma.business.create({
      data: {
        slug,
        name: data.name,
        description: data.description,
        status: approved ? BusinessStatus.APPROVED : BusinessStatus.PENDING,
        priceRange: toPriceRange(data.priceRange),
        categoryId: category.id,
        ownerId: ownerId ?? null,
        street: data.address.street,
        number: data.address.number,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        zip: data.address.zip,
        lat: data.address.lat ?? null,
        lng: data.address.lng ?? null,
        phone: data.contact.phone ?? null,
        whatsapp: data.contact.whatsapp ?? null,
        instagram: data.contact.instagram ?? null,
        email: data.contact.email ?? null,
        photos: {
          create: (data.photos?.length
            ? data.photos
            : [
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
              ]
          ).map((url, position) => ({
            url,
            position,
          })),
        },
        subcategories: {
          create: (data.subcategories ?? []).filter(Boolean).map((name) => ({ name })),
        },
        hours: {
          create: buildHourRows(data.hours),
        },
        services: {
          create: (data.services ?? []).map((service) => ({
            name: service.name,
            price: service.price,
            description: service.description,
          })),
        },
      },
      include: businessInclude,
    });

    return mapBusiness(business);
  },

  async update(id: string, data: Partial<BusinessPayload>, actor?: { id: string; role: string }) {
    const existing = await prisma.business.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError('Negócio não encontrado.', 404);
    }

    if (actor?.role !== 'ADMIN' && existing.ownerId !== actor?.id) {
      throw new AppError('Você não pode editar este negócio.', 403);
    }

    const category = data.category
      ? await prisma.category.findUnique({ where: { slug: data.category } })
      : null;

    if (data.category && !category) {
      throw new AppError('Categoria inválida.', 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.business.update({
        where: { id },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.description ? { description: data.description } : {}),
          ...(category ? { categoryId: category.id } : {}),
          ...(data.priceRange ? { priceRange: toPriceRange(data.priceRange) } : {}),
          ...(data.address
            ? {
                street: data.address.street,
                number: data.address.number,
                neighborhood: data.address.neighborhood,
                city: data.address.city,
                state: data.address.state,
                zip: data.address.zip,
                lat: data.address.lat ?? null,
                lng: data.address.lng ?? null,
              }
            : {}),
          ...(data.contact
            ? {
                phone: data.contact.phone ?? null,
                whatsapp: data.contact.whatsapp ?? null,
                instagram: data.contact.instagram ?? null,
                email: data.contact.email ?? null,
              }
            : {}),
        },
      });

      if (data.subcategories) {
        await tx.businessSubcategory.deleteMany({ where: { businessId: id } });
        await tx.businessSubcategory.createMany({
          data: data.subcategories.map((name) => ({ businessId: id, name })),
        });
      }

      if (data.photos) {
        await tx.businessPhoto.deleteMany({ where: { businessId: id } });
        await tx.businessPhoto.createMany({
          data: data.photos.map((url, position) => ({ businessId: id, url, position })),
        });
      }

      if (data.hours) {
        await tx.businessHour.deleteMany({ where: { businessId: id } });
        await tx.businessHour.createMany({
          data: buildHourRows(data.hours).map((hour) => ({ ...hour, businessId: id })),
        });
      }

      if (data.services) {
        await tx.service.deleteMany({ where: { businessId: id } });
        await tx.service.createMany({
          data: data.services.map((service) => ({
            businessId: id,
            name: service.name,
            price: service.price,
            description: service.description,
          })),
        });
      }
    });

    const updated = await prisma.business.findUniqueOrThrow({
      where: { id },
      include: businessInclude,
    });
    return mapBusiness(updated);
  },

  async remove(id: string, actor?: { id: string; role: string }) {
    const existing = await prisma.business.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError('Negócio não encontrado.', 404);
    }

    if (actor?.role !== 'ADMIN' && existing.ownerId !== actor?.id) {
      throw new AppError('Você não pode remover este negócio.', 403);
    }

    await prisma.business.delete({ where: { id } });
  },
};
