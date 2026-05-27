import { BusinessStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { businessInclude, mapBusiness } from '../../utils/business-mapper';
import { businessesService } from '../businesses/businesses.service';

export const merchantService = {
  async dashboard(userId: string) {
    const businesses = await prisma.business.findMany({
      where: { ownerId: userId },
      include: businessInclude,
      orderBy: { createdAt: 'desc' },
    });

    const mapped = businesses.map(mapBusiness);
    const ratings = mapped.filter((business) => business.reviewCount > 0).map((business) => business.rating);

    return {
      summary: {
        total: businesses.length,
        approved: businesses.filter((b) => b.status === BusinessStatus.APPROVED).length,
        pending: businesses.filter((b) => b.status === BusinessStatus.PENDING).length,
        rejected: businesses.filter((b) => b.status === BusinessStatus.REJECTED).length,
        averageRating: ratings.length ? Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)) : 0,
      },
      businesses: mapped,
    };
  },

  async businesses(userId: string) {
    const businesses = await prisma.business.findMany({
      where: { ownerId: userId },
      include: businessInclude,
      orderBy: { createdAt: 'desc' },
    });

    return businesses.map(mapBusiness);
  },

  createBusiness(userId: string, data: any) {
    return businessesService.create(data, userId, false);
  },

  updateBusiness(userId: string, businessId: string, data: any) {
    return businessesService.update(businessId, data, { id: userId, role: 'MERCHANT' });
  },

  removeBusiness(userId: string, businessId: string) {
    return businessesService.remove(businessId, { id: userId, role: 'MERCHANT' });
  },
};
