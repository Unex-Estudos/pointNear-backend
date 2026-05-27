import { AuditAction, BusinessStatus, UserRole } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { businessInclude, mapBusiness } from '../../utils/business-mapper';
import { categoriesService } from '../categories/categories.service';

export const adminService = {
  async dashboard() {
    const [totalUsers, customers, merchants, admins, totalBusinesses, pending, approved, rejected, suspended, reviews, categories] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      prisma.user.count({ where: { role: UserRole.MERCHANT } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.business.count(),
      prisma.business.count({ where: { status: BusinessStatus.PENDING } }),
      prisma.business.count({ where: { status: BusinessStatus.APPROVED } }),
      prisma.business.count({ where: { status: BusinessStatus.REJECTED } }),
      prisma.business.count({ where: { status: BusinessStatus.SUSPENDED } }),
      prisma.review.aggregate({ _count: true, _avg: { rating: true } }),
      prisma.category.count(),
    ]);

    return {
      users: { total: totalUsers, customers, merchants, admins },
      businesses: { total: totalBusinesses, pending, approved, rejected, suspended },
      reviews: { total: reviews._count, averageRating: Number((reviews._avg.rating ?? 0).toFixed(1)) },
      categories: { total: categories },
    };
  },

  async users() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateUser(id: string, data: { name?: string; role?: UserRole }, actorId: string) {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    await prisma.auditLog.create({
      data: { userId: actorId, action: AuditAction.USER_UPDATED, entity: 'User', entityId: id, metadata: data },
    });

    return user;
  },

  async businesses(status?: BusinessStatus) {
    const businesses = await prisma.business.findMany({
      where: status ? { status } : undefined,
      include: businessInclude,
      orderBy: { createdAt: 'desc' },
    });

    return businesses.map(mapBusiness);
  },

  async setBusinessStatus(id: string, status: BusinessStatus, actorId: string) {
    const business = await prisma.business.update({
      where: { id },
      data: { status },
      include: businessInclude,
    });

    const action = status === BusinessStatus.APPROVED ? AuditAction.BUSINESS_APPROVED : status === BusinessStatus.REJECTED ? AuditAction.BUSINESS_REJECTED : AuditAction.BUSINESS_SUSPENDED;
    await prisma.auditLog.create({ data: { userId: actorId, action, entity: 'Business', entityId: id, metadata: { status } } });

    return mapBusiness(business);
  },

  async setFeatured(id: string, featured: boolean, actorId: string) {
    const business = await prisma.business.update({ where: { id }, data: { featured }, include: businessInclude });
    await prisma.auditLog.create({ data: { userId: actorId, action: AuditAction.BUSINESS_FEATURED_CHANGED, entity: 'Business', entityId: id, metadata: { featured } } });
    return mapBusiness(business);
  },

  async deleteBusiness(id: string) {
    await prisma.business.delete({ where: { id } });
  },

  categories: categoriesService,

  async reviews() {
    return prisma.review.findMany({ include: { business: { select: { id: true, name: true } }, user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } });
  },

  async deleteReview(id: string, actorId: string) {
    await prisma.review.delete({ where: { id } });
    await prisma.auditLog.create({ data: { userId: actorId, action: AuditAction.REVIEW_DELETED, entity: 'Review', entityId: id } });
  },
};
