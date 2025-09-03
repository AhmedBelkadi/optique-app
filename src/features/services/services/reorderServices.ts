import { prisma } from '@/lib/prisma';
import { ReorderServicesInput } from '@/features/services/schema/serviceSchema';

export interface ReorderServicesResult {
  success: boolean;
  error?: string;
}

export async function reorderServices(data: ReorderServicesInput): Promise<ReorderServicesResult> {
  try {
    // Use transaction to update all services at once
    await prisma.$transaction(
      data.services.map(service =>
        prisma.service.update({
          where: { id: service.id },
          data: { order: service.order },
        })
      )
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error reordering services:', error);
    return {
      success: false,
      error: 'Échec de la réorganisation des services.',
    };
  }
}
