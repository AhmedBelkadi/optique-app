import { prisma } from '@/lib/prisma';
import { ReorderServicesInput, Service } from '@/features/services/schema/serviceSchema';

export interface ReorderServicesResult {
  success: boolean;
  data?: Service[];
  error?: string;
}

export async function reorderServices(data: ReorderServicesInput): Promise<ReorderServicesResult> {
  try {
    // Use transaction to update all services at once
    await (prisma as any).$transaction(
      data.services.map((service: any) =>
        (prisma as any).service.update({
          where: { id: service.id },
          data: { order: service.order },
        })
      )
    );

    // Fetch updated services
    const updatedServices = await (prisma as any).service.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });

    // Transform to match Service schema
    const transformedServices: Service[] = updatedServices.map((service: any) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      icon: service.icon,
      isActive: service.isActive,
      order: service.order,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt,
      isDeleted: service.isDeleted,
    }));

    return {
      success: true,
      data: transformedServices,
    };
  } catch (error) {
    console.error('Error reordering services:', error);
    return {
      success: false,
      error: 'Échec de la réorganisation des services.',
    };
  }
}
