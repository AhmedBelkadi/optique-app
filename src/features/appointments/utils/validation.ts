import { z } from 'zod';
import { APPOINTMENT_CONSTANTS, APPOINTMENT_ERRORS } from '../types';

// Base appointment form schema
export const baseAppointmentSchema = z.object({
  title: z.string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  appointmentDate: z.string()
    .min(1, 'La date est requise'),
  appointmentTime: z.string()
    .min(1, 'L\'heure est requise'),
  duration: z.number()
    .int()
    .min(APPOINTMENT_CONSTANTS.MIN_DURATION, `La durée minimale est de ${APPOINTMENT_CONSTANTS.MIN_DURATION} minutes`)
    .max(APPOINTMENT_CONSTANTS.MAX_DURATION, `La durée maximale est de ${APPOINTMENT_CONSTANTS.MAX_DURATION} minutes`),
  notes: z.string()
    .max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères')
    .optional(),
  customerName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  customerPhone: z.string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres'),
  customerEmail: z.string()
    .email('L\'email doit être valide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  customerNotes: z.string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .optional(),
});

// Business hours validation
export const businessHoursValidation = z.object({}).refine((data: any) => {
  const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
  const dayOfWeek = appointmentDateTime.getDay();
  const hour = appointmentDateTime.getHours();
  const minutes = appointmentDateTime.getMinutes();
  
  // Check if it's Sunday
  if (dayOfWeek === APPOINTMENT_CONSTANTS.DAYS_OF_WEEK.SUNDAY) {
    return false;
  }
  
  // Check business hours (9:00 AM to 7:00 PM)
  const appointmentTime = hour * 60 + minutes;
  const openTime = APPOINTMENT_CONSTANTS.BUSINESS_HOURS.START * 60;
  const closeTime = APPOINTMENT_CONSTANTS.BUSINESS_HOURS.END * 60;
  
  return appointmentTime >= openTime && appointmentTime < closeTime;
}, {
  message: APPOINTMENT_ERRORS.BUSINESS_HOURS,
  path: ['appointmentTime']
});

// Past date validation
export const pastDateValidation = z.object({}).refine((data: any) => {
  const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
  return appointmentDateTime >= new Date();
}, {
  message: APPOINTMENT_ERRORS.PAST_DATE,
  path: ['appointmentDate']
});

// Complete appointment schema with all validations
export const appointmentSchema = baseAppointmentSchema
  .and(businessHoursValidation)
  .and(pastDateValidation);

// Create appointment schema (with optional customer fields for existing customers)
export const createAppointmentSchema = baseAppointmentSchema.extend({
  customerName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .optional(),
  customerPhone: z.string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
    .max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres')
    .optional(),
  customerEmail: z.string()
    .email('L\'email doit être valide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères')
    .optional(),
});

// Update appointment schema - basic validation only, business logic handled in form
export const updateAppointmentSchema = baseAppointmentSchema;

// Validation utility functions
export function validateBusinessHours(date: string, time: string): boolean {
  const appointmentDate = new Date(`${date}T${time}`);
  const dayOfWeek = appointmentDate.getDay();
  const hour = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  
  // Sunday = 0, Monday = 1, ..., Saturday = 6
  if (dayOfWeek === APPOINTMENT_CONSTANTS.DAYS_OF_WEEK.SUNDAY) return false;
  
  // Business hours: 9:00 AM to 7:00 PM (19:00)
  const appointmentTime = hour * 60 + minutes;
  const openTime = APPOINTMENT_CONSTANTS.BUSINESS_HOURS.START * 60;
  const closeTime = APPOINTMENT_CONSTANTS.BUSINESS_HOURS.END * 60;
  
  return appointmentTime >= openTime && appointmentTime < closeTime;
}

export function validatePastDate(date: string, time: string): boolean {
  const appointmentDateTime = new Date(`${date}T${time}`);
  return appointmentDateTime >= new Date();
}

export function getBusinessHoursError(date: string, time: string): string | null {
  const appointmentDate = new Date(`${date}T${time}`);
  const dayOfWeek = appointmentDate.getDay();
  const hour = appointmentDate.getHours();
  const minutes = appointmentDate.getMinutes();
  
  if (dayOfWeek === APPOINTMENT_CONSTANTS.DAYS_OF_WEEK.SUNDAY) {
    return APPOINTMENT_ERRORS.SUNDAY_CLOSED;
  }
  
  if (hour < APPOINTMENT_CONSTANTS.BUSINESS_HOURS.START || hour >= APPOINTMENT_CONSTANTS.BUSINESS_HOURS.END) {
    return APPOINTMENT_ERRORS.BUSINESS_HOURS;
  }
  
  if (hour === APPOINTMENT_CONSTANTS.BUSINESS_HOURS.LAST_APPOINTMENT_HOUR && 
      minutes > APPOINTMENT_CONSTANTS.BUSINESS_HOURS.LAST_APPOINTMENT_MINUTE) {
    return 'Le dernier rendez-vous possible est à 18h30';
  }
  
  return null;
}
