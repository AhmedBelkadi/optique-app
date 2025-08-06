'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, ArrowLeft, Loader2, X, Edit } from 'lucide-react';
import { createTestimonialAction } from '@/features/testimonials/actions/createTestimonial';
import { updateTestimonialAction } from '@/features/testimonials/actions/updateTestimonial';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';
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
import { Switch } from '@/components/ui/switch';
import { useCSRF } from '@/components/common/CSRFProvider';

interface TestimonialFormProps {
  mode: 'create' | 'edit';
  testimonial?: Testimonial; // Only for edit mode
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  title: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function TestimonialForm({ mode, testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousIsPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial?.name || '',
      message: testimonial?.message || '',
      title: testimonial?.title || '',
      image: testimonial?.image || '',
      isActive: testimonial?.isActive ?? true,
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
        
        if (mode === 'edit' && testimonial) {
          result = await updateTestimonialAction(testimonial.id, data);
        } else {
          result = await createTestimonialAction(data);
        }

        if (result.success) {
          const message = mode === 'create' ? 'Testimonial created successfully!' : 'Testimonial updated successfully!';
          toast.success(message, {
            icon: '✅',
            style: {
              background: '#10b981',
              color: '#ffffff',
            },
          });
          router.push('/admin/testimonials');
        } else {
          setGeneralError(result.message || `Failed to ${mode} testimonial`);
          toast.error(result.message || `Failed to ${mode} testimonial`, {
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
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading security token...</p>
        </CardContent>
      </Card>
    );
  }

  if (csrfError) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Error loading security token. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  if (!csrfToken) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Security token not available. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              {mode === 'create' ? (
                <Plus className="w-4 h-4 text-white" />
              ) : (
                <Edit className="w-4 h-4 text-white" />
              )}
            </div>
            <span>{mode === 'create' ? 'Testimonial Information' : 'Edit Testimonial Information'}</span>
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
                      <FormLabel className="text-sm font-medium text-foreground">
                        Customer Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter customer name"
                          className={`transition-all duration-200 ${
                            fieldErrors.name 
                              ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.name && (
                          <div className="flex items-center text-destructive">
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Title/Position
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., CEO, Manager, Customer"
                          className={`transition-all duration-200 ${
                            fieldErrors.title 
                              ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage>
                        {fieldErrors.title && (
                          <div className="flex items-center text-destructive">
                            <X className="w-4 h-4 mr-1" />
                            {fieldErrors.title}
                          </div>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Testimonial Message *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the customer's testimonial message"
                        rows={4}
                        className={`transition-all duration-200 resize-none ${
                          fieldErrors.message 
                            ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                            : 'border-border focus:border-primary focus:ring-primary'
                        }`}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldErrors.message && (
                        <div className="flex items-center text-destructive">
                          <X className="w-4 h-4 mr-1" />
                          {fieldErrors.message}
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com/image.jpg"
                        className={`transition-all duration-200 ${
                          fieldErrors.image 
                            ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                            : 'border-border focus:border-primary focus:ring-primary'
                        }`}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage>
                      {fieldErrors.image && (
                        <div className="flex items-center text-destructive">
                          <X className="w-4 h-4 mr-1" />
                          {fieldErrors.image}
                        </div>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Published
                      </FormLabel>
                      <div className="text-xs text-muted-foreground">
                        Show this testimonial on the public website
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {generalError && (
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center text-destructive">
                      <X className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{generalError}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="bg-background/50 backdrop-blur-sm border-border hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
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
                          Create Testimonial
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Update Testimonial
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