import { prisma } from '@/lib/prisma';

export interface DeleteServiceResult {
  success: boolean;
  error?: string;
}

export async function deleteService(id: string): Promise<DeleteServiceResult> {
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

    // Soft delete the service
    await prisma.service.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting service:', error);
    return {
      success: false,
      error: 'Échec de la suppression du service.',
    };
  }
}
