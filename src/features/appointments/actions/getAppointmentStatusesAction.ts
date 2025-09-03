'use server';

import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth/authorization';

export async function getAppointmentStatusesAction() {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('appointments', 'read');


    const statuses = await prisma.appointmentStatus.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return {
      success: true,
      data: statuses
    };

  } catch (error) {
    console.error('Error getting appointment statuses:', error);
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {}
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }
    return {
      success: false,
      error: 'Erreur lors de la récupération des statuts'
    };
  }
}
