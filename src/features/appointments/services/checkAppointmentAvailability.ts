import { prisma } from '@/lib/prisma';

export interface AvailabilityCheckResult {
  isAvailable: boolean;
  conflicts?: Array<{
    id: string;
    startTime: string;
    endTime: string;
    customerName: string;
  }>;
  error?: string;
}

export async function checkAppointmentAvailability(
  startTime: Date,
  endTime: Date,
  excludeAppointmentId?: string
): Promise<AvailabilityCheckResult> {
  try {
    // Check for overlapping appointments
    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        isDeleted: false,
        ...(excludeAppointmentId && { id: { not: excludeAppointmentId } }),
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } }
        ]
      },
      include: {
        customer: {
          select: {
            name: true
          }
        }
      }
    });

    if (conflictingAppointments.length > 0) {
      return {
        isAvailable: false,
        conflicts: conflictingAppointments.map(apt => ({
          id: apt.id,
          startTime: apt.startTime.toISOString(),
          endTime: apt.endTime.toISOString(),
          customerName: apt.customer.name
        }))
      };
    }

    return {
      isAvailable: true
    };

  } catch (error) {
    console.error('Error checking appointment availability:', error);
    return {
      isAvailable: false,
      error: 'Erreur lors de la vérification de disponibilité'
    };
  }
}
