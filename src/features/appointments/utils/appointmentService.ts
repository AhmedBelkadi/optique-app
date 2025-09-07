import { prisma } from '@/lib/prisma';
import { APPOINTMENT_ERRORS } from '../types';

export interface TimeConflictCheck {
  startTime: Date;
  endTime: Date;
  excludeAppointmentId?: string;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface AppointmentData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  statusId: string;
  notes?: string;
  customerId: string;
}

/**
 * Check for time conflicts with existing appointments
 */
export async function checkTimeConflicts({ 
  startTime, 
  endTime, 
  excludeAppointmentId 
}: TimeConflictCheck): Promise<{ hasConflict: boolean; conflictingAppointment?: any }> {
  const whereClause: any = {
    isDeleted: false,
    OR: [
      {
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } }
        ]
      }
    ]
  };

  if (excludeAppointmentId) {
    whereClause.id = { not: excludeAppointmentId };
  }

  const conflictingAppointment = await prisma.appointment.findFirst({
    where: whereClause
  });

  return {
    hasConflict: !!conflictingAppointment,
    conflictingAppointment
  };
}

/**
 * Get or create customer
 */
export async function getOrCreateCustomer(
  tx: any, 
  customerId?: string, 
  customerData?: CustomerData
): Promise<any> {
  if (customerId) {
    // Use existing customer
    const customer = await tx.customer.findFirst({
      where: {
        id: customerId,
        isDeleted: false
      }
    });

    if (!customer) {
      throw new Error(APPOINTMENT_ERRORS.CUSTOMER_NOT_FOUND);
    }

    return customer;
  } else if (customerData) {
    // Create new customer
    return await tx.customer.create({
      data: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        notes: customerData.notes || undefined
      }
    });
  } else {
    throw new Error('Customer ID or customer data is required');
  }
}

/**
 * Get default appointment status
 */
export async function getDefaultAppointmentStatus(tx: any): Promise<any> {
  const defaultStatus = await tx.appointmentStatus.findFirst({
    where: { name: 'scheduled', isActive: true }
  });

  if (!defaultStatus) {
    throw new Error(APPOINTMENT_ERRORS.SYSTEM_ERROR);
  }

  return defaultStatus;
}

/**
 * Create appointment with all related data
 */
export async function createAppointmentWithRelations(
  tx: any,
  appointmentData: AppointmentData
): Promise<any> {
  return await tx.appointment.create({
    data: appointmentData,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          notes: true
        }
      },
      status: {
        select: {
          id: true,
          name: true,
          displayName: true,
          color: true
        }
      }
    }
  });
}

/**
 * Update appointment with all related data
 */
export async function updateAppointmentWithRelations(
  tx: any,
  appointmentId: string,
  appointmentData: Partial<AppointmentData>,
  customerData?: Partial<CustomerData>
): Promise<any> {
  // Update customer if customer data is provided
  if (customerData) {
    const existingAppointment = await tx.appointment.findFirst({
      where: { id: appointmentId, isDeleted: false },
      include: { customer: true }
    });

    if (existingAppointment) {
      await tx.customer.update({
        where: { id: existingAppointment.customerId },
        data: customerData
      });
    }
  }

  // Update appointment
  return await tx.appointment.update({
    where: { id: appointmentId },
    data: appointmentData,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          notes: true
        }
      },
      status: {
        select: {
          id: true,
          name: true,
          displayName: true,
          color: true
        }
      }
    }
  });
}

/**
 * Format appointment date and time for display
 */
export function formatAppointmentDateTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate end time from start time and duration
 */
export function calculateEndTime(startTime: Date, durationMinutes: number): Date {
  return new Date(startTime.getTime() + durationMinutes * 60 * 1000);
}
