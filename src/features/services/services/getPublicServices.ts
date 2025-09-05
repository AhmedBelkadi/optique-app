import { prisma } from '@/lib/prisma';
import { Service } from '@/features/services/schema/serviceSchema';

export const getPublicServices = async () => {
  try {
    const services = await prisma.service.findMany({
      where: {
        isDeleted: false,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      take: 6, // Limit to 6 services for footer
    });

    // Transform to match Service schema
    const transformedServices: Service[] = services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || undefined,
      icon: service.icon || undefined,
      isActive: service.isActive,
      order: service.order,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt,
      isDeleted: service.isDeleted,
    }));

    return { success: true, data: transformedServices };
  } catch (error) {
    console.error('Error fetching public services:', error);
    return { success: false, error: 'Échec de la récupération des services.', data: [] };
  }
};
