import { prisma } from '@/lib/prisma';
import { UpdateServiceInput, Service } from '@/features/services/schema/serviceSchema';

export interface UpdateServiceResult {
  success: boolean;
  data?: Service;
  fieldErrors?: Record<string, string[]>;
  error?: string;
}

export async function updateService(id: string, serviceData: UpdateServiceInput): Promise<UpdateServiceResult> {
  try {
    // Check if service exists and is not deleted
    const existingService = await prisma.service.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existingService) {
      return {
        success: false,
        error: 'Service non trouvé',
      };
    }

    const service = await prisma.service.update({
      where: { id },
      data: serviceData,
    });

    // Transform to match Service schema
    const transformedService: Service = {
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
    };

    return {
      success: true,
      data: transformedService,
    };
  } catch (error) {
    console.error('Error updating service:', error);
    return {
      success: false,
      error: 'Échec de la mise à jour du service.',
    };
  }
}
