'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, ArrowLeft, Loader2, X, Edit } from 'lucide-react';
import { createAppointmentAction } from '@/features/appointments/actions/createAppointment';
import { updateAppointmentAction } from '@/features/appointments/actions/updateAppointment';
import { Appointment, AppointmentStatus } from '@/features/appointments/schema/appointmentSchema';
import { Customer } from '@/features/customers/schema/customerSchema';
import { getAllCustomersAction } from '@/features/customers/actions/getAllCustomersAction';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCSRF } from '@/components/common/CSRFProvider';

interface AppointmentFormProps {
  mode: 'create' | 'edit';
  appointment?: Appointment; // Only for edit mode
}

// Form validation schema
const formSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).default('SCHEDULED'),
  notes: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type FormData = z.infer<typeof formSchema>;

export default function AppointmentForm({ mode, appointment }: AppointmentFormProps) {
  const router = useRouter();
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: appointment?.customerId || '',
      title: appointment?.title || '',
      description: appointment?.description || '',
      startTime: appointment?.startTime 
        ? new Date(appointment.startTime).toISOString().slice(0, 16)
        : '',
      endTime: appointment?.endTime 
        ? new Date(appointment.endTime).toISOString().slice(0, 16)
        : '',
      status: appointment?.status || 'SCHEDULED',
      notes: appointment?.notes || '',
    },
  });

  // Load customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const result = await getAllCustomersAction({
          isDeleted: false,
          sortBy: 'name',
          sortOrder: 'asc',
          page: 1,
          limit: 100,
        });

        if (result.success) {
          setCustomers(result.data || []);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    };

    loadCustomers();
  }, []);

  const handleSubmit = async (data: FormData) => {
    if (csrfLoading) {
      toast.error('Security token is still loading. Please wait.');
      return;
    }

    if (csrfError) {
      toast.error('Security token error. Please refresh the page.');
      return;
    }

    if (!csrfToken) {
      toast.error('Security token not available. Please refresh the page.');
      return;
    }

    // Clear previous errors
    setFieldErrors({});
    setGeneralError('');

    startTransition(async () => {
      try {
        let result;
        
        if (mode === 'edit' && appointment) {
          result = await updateAppointmentAction(appointment.id, data);
        } else {
          result = await createAppointmentAction(data);
        }

        if (result.success) {
          const message = mode === 'create' ? 'Appointment created successfully!' : 'Appointment updated successfully!';
          toast.success(message, {
            icon: '✅',
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
          });
          router.push('/admin/appointments');
        } else {
          setGeneralError(result.message || `Failed to ${mode} appointment`);
          toast.error(result.message || `Failed to ${mode} appointment`, {
            icon: '❌',
            style: {
              background: '#ef4444',
              color: '#ffffff',
            },
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setGeneralError(errorMessage);
        toast.error(errorMessage, {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    });
  };

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      // Handle any post-submission logic here if needed
    }
    previousIsPending.current = isPending;
  }, [isPending]);

  if (csrfLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Loading security token...</p>
        </CardContent>
      </Card>
    );
  }

  if (csrfError) {
    return (
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Error loading security token. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  if (!csrfToken) {
    return (
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Security token not available. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              {mode === 'create' ? (
                <Plus className="w-4 h-4 text-white" />
              ) : (
                <Edit className="w-4 h-4 text-white" />
              )}
            </div>
            <span>{mode === 'create' ? 'Appointment Information' : 'Edit Appointment Information'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Customer *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={`transition-all duration-200 ${
                            fieldErrors.customerId 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} ({customer.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {fieldErrors.customerId && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.customerId}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Appointment Title *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter appointment title"
                          className={`transition-all duration-200 ${
                            fieldErrors.title 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.title && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.title}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Start Time *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className={`transition-all duration-200 ${
                            fieldErrors.startTime 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.startTime && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.startTime}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        End Time *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className={`transition-all duration-200 ${
                            fieldErrors.endTime 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.endTime && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.endTime}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Status
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="NO_SHOW">No Show</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {fieldErrors.status && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.status}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter appointment description"
                        rows={3}
                        className={`transition-all duration-200 resize-none ${
                          fieldErrors.description 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldErrors.description && (
                        <div className="flex items-center text-red-600">
                          <X className="w-4 h-4 mr-1" />
                          {fieldErrors.description}
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter any additional notes"
                        rows={4}
                        className={`transition-all duration-200 resize-none ${
                          fieldErrors.notes 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldErrors.notes && (
                        <div className="flex items-center text-red-600">
                          <X className="w-4 h-4 mr-1" />
                          {fieldErrors.notes}
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {generalError && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center text-red-700">
                      <X className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{generalError}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      {mode === 'create' ? (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Appointment
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Update Appointment
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 