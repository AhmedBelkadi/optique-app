import { z } from 'zod';

export const appointmentFormSchema = z.object({
  // Customer data - either customerId (for existing) or customer details (for new)
  customerId: z.string().optional(),
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  customerPhone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres').max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres'),
  customerEmail: z.string().email('L\'email doit être valide').max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  customerNotes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional(),
  
  // Appointment data
  appointmentDate: z.string().min(1, 'La date est requise'),
  appointmentTime: z.string().min(1, 'L\'heure est requise'),
  duration: z.number().int().min(15, 'La durée minimale est de 15 minutes').max(480, 'La durée maximale est de 8 heures'),
  reason: z.string().min(1, 'Le motif est requis').max(500, 'Le motif ne peut pas dépasser 500 caractères'),
  notes: z.string().max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères').optional(),
  
  // Security
  csrf_token: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

// Validation for business hours (9h00-19h00, Monday-Saturday)
export const validateBusinessHours = (date: string, time: string): boolean => {
  const appointmentDate = new Date(`${date}T${time}`);
  const dayOfWeek = appointmentDate.getDay();
  const hour = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  
  // Sunday = 0, Monday = 1, ..., Saturday = 6
  if (dayOfWeek === 0) return false; // Sunday closed
  
  // Business hours: 9:00 AM to 7:00 PM (19:00)
  const appointmentTime = hour * 60 + minutes; // Convert to minutes
  const openTime = 9 * 60; // 9:00 AM = 540 minutes
  const closeTime = 19 * 60; // 7:00 PM = 1140 minutes
  
  return appointmentTime >= openTime && appointmentTime < closeTime;
};

// Check if time slot is available (no conflicts)
export const checkTimeSlotAvailability = async (
  date: string, 
  time: string, 
  duration: number,
  excludeAppointmentId?: string
): Promise<boolean> => {
  // This will be implemented in the service layer
  // For now, return true (available)
  return true;
};
