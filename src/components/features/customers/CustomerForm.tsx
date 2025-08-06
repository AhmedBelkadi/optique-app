'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, ArrowLeft, Loader2, X, Edit } from 'lucide-react';
import { createCustomerAction } from '@/features/customers/actions/createCustomer';
import { updateCustomerAction } from '@/features/customers/actions/updateCustomer';
import { Customer } from '@/features/customers/schema/customerSchema';
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
import { useCSRF } from '@/components/common/CSRFProvider';

interface CustomerFormProps {
  mode: 'create' | 'edit';
  customer?: Customer; // Only for edit mode
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CustomerForm({ mode, customer }: CustomerFormProps) {
  const router = useRouter();
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      notes: customer?.notes || '',
    },
  });

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
        
        if (mode === 'edit' && customer) {
          result = await updateCustomerAction(customer.id, data);
        } else {
          result = await createCustomerAction(data);
        }

        if (result.success) {
          const message = mode === 'create' ? 'Customer created successfully!' : 'Customer updated successfully!';
          toast.success(message, {
            icon: '✅',
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
          });
          router.push('/admin/customers');
        } else {
          setGeneralError(result.message || `Failed to ${mode} customer`);
          toast.error(result.message || `Failed to ${mode} customer`, {
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
            <span>{mode === 'create' ? 'Customer Information' : 'Edit Customer Information'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Customer Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter customer name"
                          className={`transition-all duration-200 ${
                            fieldErrors.name 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.name && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.name}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email address"
                          className={`transition-all duration-200 ${
                            fieldErrors.email 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.email && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.email}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter phone number"
                          className={`transition-all duration-200 ${
                            fieldErrors.phone 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.phone && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.phone}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter customer address"
                          className={`transition-all duration-200 ${
                            fieldErrors.address 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.address && (
                          <div className="flex items-center text-red-600">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.address}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

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
                        placeholder="Enter any additional notes about the customer"
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
                          Create Customer
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Update Customer
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