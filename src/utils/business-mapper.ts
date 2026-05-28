import { BusinessStatus, PriceRange, WeekDay } from '@prisma/client';

const dayMap: Record<WeekDay, string> = {
  SEGUNDA: 'segunda',
  TERCA: 'terca',
  QUARTA: 'quarta',
  QUINTA: 'quinta',
  SEXTA: 'sexta',
  SABADO: 'sabado',
  DOMINGO: 'domingo',
};

export const weekDays = Object.keys(dayMap) as WeekDay[];

export function toPriceSymbol(priceRange: PriceRange) {
  return priceRange === 'LOW' ? '$' : priceRange === 'HIGH' ? '$$$' : '$$';
}

export function toPriceRange(value?: string) {
  if (value === '$') return PriceRange.LOW;
  if (value === '$$$') return PriceRange.HIGH;
  return PriceRange.MEDIUM;
}

export function mapBusiness(business: any) {
  const reviews = business.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;

  const hours = weekDays.reduce<Record<string, { open: string; close: string; closed: boolean }>>(
    (acc, day) => {
      const found = business.hours?.find((hour: any) => hour.day === day);
      acc[dayMap[day]] = found
        ? { open: found.open, close: found.close, closed: found.closed }
        : { open: '09:00', close: '18:00', closed: false };
      return acc;
    },
    {},
  );

  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    category: business.category.slug,
    categoryLabel: business.category.label,
    subcategories: (business.subcategories ?? []).map((sub: any) => sub.name),
    description: business.description,
    photos: (business.photos ?? []).sort((a: any, b: any) => a.position - b.position).map((p: any) => p.url),
    address: {
      street: business.street,
      number: business.number,
      neighborhood: business.neighborhood,
      city: business.city,
      state: business.state,
      zip: business.zip,
      lat: business.lat == null ? 0 : Number(business.lat),
      lng: business.lng == null ? 0 : Number(business.lng),
    },
    contact: {
      phone: business.phone,
      whatsapp: business.whatsapp,
      instagram: business.instagram,
      email: business.email,
    },
    hours,
    rating: Number(avgRating.toFixed(1)),
    reviewCount: reviews.length,
    reviews: reviews.map((review: any) => ({
      id: review.id,
      userId: review.userId ?? null, // ← adicionado
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().slice(0, 10),
      comments: review.comments ?? [],
    })),
    services: (business.services ?? []).map((service: any) => ({
      id: service.id,
      name: service.name,
      price: Number(service.price),
      description: service.description,
    })),
    priceRange: toPriceSymbol(business.priceRange),
    featured: business.featured,
    status: business.status as BusinessStatus,
    ownerId: business.ownerId,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt,
  };
}

export const businessInclude = {
  category: true,
  photos: true,
  subcategories: true,
  hours: true,
  services: true,
  reviews: {
    include: {
      comments: true,
    },
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
};