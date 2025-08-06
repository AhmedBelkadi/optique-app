import { z } from 'zod';

export const appointmentStatusSchema = z.enum([
  'SCHEDULED',
  'CONFIRMED', 
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
]);

export const appointmentSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: appointmentStatusSchema.default('SCHEDULED'),
  notes: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const updateAppointmentSchema = appointmentSchema.partial();

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export type Appointment = {
  id: string;
  customerId: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isDeleted: boolean;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateAppointmentInput = z.infer<typeof appointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>; 