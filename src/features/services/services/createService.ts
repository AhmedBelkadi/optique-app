import { prisma } from '@/lib/prisma';
import { CreateServiceInput, Service } from '@/features/services/schema/serviceSchema';

export interface CreateServiceResult {
  success: boolean;
  data?: Service;
  fieldErrors?: Record<string, string[]>;
  error?: string;
}

export async function createService(serviceData: CreateServiceInput): Promise<CreateServiceResult> {
  try {
    // Get the next order number
    const lastService = await prisma.service.findFirst({
      where: { isDeleted: false },
      orderBy: { order: 'desc' },
    });
    
    const nextOrder = lastService ? lastService.order + 1 : 0;

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        order: nextOrder,
      },
    });

    // Transform to match Service schema
    const transformedService: Service = {
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
    };

    return {
      success: true,
      data: transformedService,
    };
  } catch (error) {
    console.error('Error creating service:', error);
    return {
      success: false,
      error: 'Échec de la création du service.',
    };
  }
}
