import { prisma } from '@/lib/prisma';

export interface DeleteAppointmentResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function deleteAppointment(id: string, permanent: boolean = false): Promise<DeleteAppointmentResult> {
  try {
    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: { id, isDeleted: false }
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Rendez-vous introuvable'
      };
    }

    if (permanent) {
      // Permanent deletion
      await prisma.appointment.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Rendez-vous supprimé définitivement'
      };
    } else {
      // Soft deletion
      await prisma.appointment.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Rendez-vous déplacé vers la corbeille'
      };
    }

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return {
      success: false,
      error: 'Erreur lors de la suppression du rendez-vous'
    };
  }
}

export async function restoreAppointment(id: string): Promise<DeleteAppointmentResult> {
  try {
    // Check if appointment exists in trash
    const existingAppointment = await prisma.appointment.findFirst({
      where: { id, isDeleted: true }
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Rendez-vous introuvable dans la corbeille'
      };
    }

    // Restore appointment
    await prisma.appointment.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });

    return {
      success: true,
      message: 'Rendez-vous restauré avec succès'
    };

  } catch (error) {
    console.error('Error restoring appointment:', error);
    return {
      success: false,
      error: 'Erreur lors de la restauration du rendez-vous'
    };
  }
}
