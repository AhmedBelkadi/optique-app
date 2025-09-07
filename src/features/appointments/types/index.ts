// Shared types for appointment features

export interface AppointmentStatus {
  id: string;
  name: string;
  displayName: string;
  color: string;
  description?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  customer: Customer;
  status: AppointmentStatus;
}

export interface AppointmentFormData {
  title: string;
  description?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  notes?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNotes?: string;
  customerId?: string;
  statusId?: string;
  csrf_token?: string;
}

export interface AppointmentActionResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  fieldErrors?: Record<string, string>;
}

export interface AppointmentServiceResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Form validation schemas
export interface AppointmentFormValidation {
  title: string;
  description?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  notes?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNotes?: string;
}

// Business logic constants
export const APPOINTMENT_CONSTANTS = {
  MIN_DURATION: 15,
  MAX_DURATION: 480,
  BUSINESS_HOURS: {
    START: 9, // 9:00 AM
    END: 19,  // 7:00 PM
    LAST_APPOINTMENT_HOUR: 18,
    LAST_APPOINTMENT_MINUTE: 30
  },
  DAYS_OF_WEEK: {
    SUNDAY: 0,
    MONDAY: 1,
    SATURDAY: 6
  }
} as const;

// Error messages
export const APPOINTMENT_ERRORS = {
  BUSINESS_HOURS: 'Les rendez-vous ne sont disponibles que du lundi au samedi, de 9h00 à 19h00.',
  SUNDAY_CLOSED: 'Les rendez-vous ne sont pas disponibles le dimanche.',
  PAST_DATE: 'La date de rendez-vous ne peut pas être dans le passé.',
  TIME_CONFLICT: 'Ce créneau horaire est déjà occupé par un autre rendez-vous.',
  CUSTOMER_NOT_FOUND: 'Client sélectionné introuvable. Veuillez sélectionner un autre client.',
  SYSTEM_ERROR: 'Erreur de configuration du système. Veuillez contacter l\'administrateur.',
  UPDATE_SUCCESS: 'Rendez-vous mis à jour avec succès',
  CREATE_SUCCESS: 'Rendez-vous créé avec succès ! Nous vous confirmerons par WhatsApp dans les 24h.',
  UPDATE_ERROR: 'Erreur lors de la mise à jour du rendez-vous',
  CREATE_ERROR: 'Erreur lors de la création du rendez-vous'
} as const;
