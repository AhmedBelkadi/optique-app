'use server';

import { publicRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createAppointment } from '@/features/appointments/services/createAppointment';
import { logError } from '@/lib/errorHandling';
import { revalidatePath } from 'next/cache';
import { validateAndSanitizePublicForm, validateEmail, validatePhoneNumber } from '@/lib/security';

// Business hours validation function
function validateBusinessHours(date: string, time: string): { isValid: boolean; error?: string } {
  try {
    // Create date in local timezone to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create date object with local timezone
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    
    // Check if date is valid
    if (isNaN(appointmentDate.getTime())) {
      return { isValid: false, error: 'Date ou heure invalide' };
    }
    
    // Check if it's Sunday (day 0)
    const dayOfWeek = appointmentDate.getDay();
    
    if (dayOfWeek === 0) {
      return { isValid: false, error: 'Les rendez-vous ne sont pas disponibles le dimanche' };
    }
    
    // Check if it's Saturday (day 6) - if you want to allow Saturday
    // if (dayOfWeek === 6) {
    //   return { isValid: false, error: 'Les rendez-vous ne sont pas disponibles le samedi' };
    // }
    
    // Check if time is within business hours (9:00 AM to 7:00 PM)
    if (hours < 9 || hours >= 19) {
      return { isValid: false, error: 'Les rendez-vous ne sont disponibles que de 9h00 à 19h00' };
    }
    
    // Check if appointment is at least 30 minutes before closing
    if (hours === 18 && minutes > 30) {
      return { isValid: false, error: 'Le dernier rendez-vous possible est à 18h30' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Erreur lors de la validation de l\'horaire' };
  }
}

export async function createPublicAppointmentAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // Get client identifier for rate limiting (IP-based for public actions)
    const identifier = await getClientIdentifier();
    
    // Apply stricter rate limiting for public appointment creation
    await publicRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    // Security validation and sanitization
    const requiredFields = ['customerName', 'customerPhone', 'customerEmail', 'appointmentDate', 'appointmentTime', 'duration', 'reason'];
    const optionalFields = ['notes'];
    
    const validation = validateAndSanitizePublicForm(formData, requiredFields, optionalFields);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation échouée: ${validation.errors.join(', ')}`
      };
    }
    
    // Extract and validate sanitized data
    const {
      customerName,
      customerPhone,
      customerEmail,
      appointmentDate,
      appointmentTime,
      duration,
      reason,
      notes
    } = validation.sanitizedData;
    
    // 1. Validate email format
    if (!validateEmail(customerEmail)) {
      return {
        success: false,
        error: 'Format d\'email invalide'
      };
    }
    
    // 2. Validate phone number format
    if (!validatePhoneNumber(customerPhone)) {
      return {
        success: false,
        error: 'Format de numéro de téléphone invalide'
      };
    }
    
    // 3. Validate name (only safe characters)
    if (customerName.length < 2 || customerName.length > 100) {
      return {
        success: false,
        error: 'Le nom doit contenir entre 2 et 100 caractères'
      };
    }
    
    // 4. Validate appointment date (not in the past, not too far in the future)
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    if (appointmentDateTime < now) {
      return {
        success: false,
        error: 'La date de rendez-vous ne peut pas être dans le passé'
      };
    }
    
    if (appointmentDateTime > threeMonthsFromNow) {
      return {
        success: false,
        error: 'La date de rendez-vous ne peut pas être plus de 3 mois dans le futur'
      };
    }
    
    // 5. Validate business hours (Monday-Saturday, 9:00-19:00)
    const businessHoursValidation = validateBusinessHours(appointmentDate, appointmentTime);
    
    if (!businessHoursValidation.isValid) {
      return {
        success: false,
        error: businessHoursValidation.error || 'Horaire non disponible'
      };
    }
    
    // 6. Validate duration
    const durationValue = parseInt(duration);
    
    if (isNaN(durationValue) || durationValue < 15 || durationValue > 480) {
      return {
        success: false,
        error: 'La durée doit être entre 15 minutes et 8 heures'
      };
    }
    
    // 7. Validate reason
    const validReasons = ['eye-test', 'frame-fitting', 'contact-lens', 'repair', 'consultation', 'other'];
    
    if (!validReasons.includes(reason)) {
      return {
        success: false,
        error: 'Motif de visite invalide'
      };
    }
    
    // 8. Check if appointment time conflicts with existing appointments
    // This would require additional database queries in a real implementation
    // For now, we'll skip this check
    
    // Create appointment data with sanitized inputs
    const appointmentData = {
      customerName,
      customerPhone,
      customerEmail,
      appointmentDate: appointmentDateTime.toISOString(),
      appointmentTime,
      duration: durationValue,
      reason,
      notes: notes || '',
      status: 'pending',
      source: 'public_form'
    };
    
    // Create the appointment
    const result = await createAppointment(appointmentData);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Échec de la création du rendez-vous'
      };
    }
    
    // Revalidate relevant paths
    revalidatePath('/appointment');
    revalidatePath('/admin/appointments');
    
    return {
      success: true,
      message: 'Rendez-vous créé avec succès ! Nous vous confirmerons par WhatsApp dans les 24h.',
      appointmentId: result.data?.id
    };
    
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Limite de taux')) {
        return {
          success: false,
          error: 'Trop de tentatives. Veuillez patienter avant de réessayer.'
        };
      }
      
      if (error.message.includes('CSRF')) {
        return {
          success: false,
          error: 'Erreur de sécurité. Veuillez actualiser la page et réessayer.'
        };
      }
    }
    
    // Log error for monitoring
    await logError(error as Error, { 
      action: 'createPublicAppointment', 
      identifier: await getClientIdentifier() 
    });
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du rendez-vous. Veuillez réessayer.'
    };
  }
}
