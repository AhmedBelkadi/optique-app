'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';
import { upsertSettingsAction } from '@/features/settings/actions/upsertSettings';
import { SettingsWithTimestamps } from '@/features/settings/schema/settingsSchema';
import ImageUploadField from './ImageUploadField';
import ColorPicker from './ColorPicker';
import { useCSRF } from '@/components/common/CSRFProvider';
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
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  siteName: z.string().optional(),
  slogan: z.string().optional(),
  logoUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  openingHours: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SettingsFormProps {
  settings: SettingsWithTimestamps;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState(upsertSettingsAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      siteName: settings.siteName || '',
      slogan: settings.slogan || '',
      logoUrl: settings.logoUrl || '',
      heroImageUrl: settings.heroImageUrl || '',
      primaryColor: settings.primaryColor || '',
      secondaryColor: settings.secondaryColor || '',
      contactEmail: settings.contactEmail || '',
      phone: settings.phone || '',
      whatsapp: settings.whatsapp || '',
      address: settings.address || '',
      openingHours: settings.openingHours || '',
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: state.values?.siteName || settings.siteName || '',
      slogan: state.values?.slogan || settings.slogan || '',
      logoUrl: state.values?.logoUrl || settings.logoUrl || '',
      heroImageUrl: state.values?.heroImageUrl || settings.heroImageUrl || '',
      primaryColor: state.values?.primaryColor || settings.primaryColor || '',
      secondaryColor: state.values?.secondaryColor || settings.secondaryColor || '',
      contactEmail: state.values?.contactEmail || settings.contactEmail || '',
      phone: state.values?.phone || settings.phone || '',
      whatsapp: state.values?.whatsapp || settings.whatsapp || '',
      address: state.values?.address || settings.address || '',
      openingHours: state.values?.openingHours || settings.openingHours || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      await formAction(formData);
    });
  };

  // Handle state changes with useEffect
  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    }
  }, [state.success, state.message]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Optique" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slogan</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Vision, Our Expertise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Images</h3>
                
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="logoUrl"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Logo</FormLabel>
                         <FormControl>
                           <ImageUploadField
                             label=""
                             value={field.value}
                             onChange={field.onChange}
                             placeholder="Enter logo URL or upload file"
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                   <FormField
                     control={form.control}
                     name="heroImageUrl"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Hero Image</FormLabel>
                         <FormControl>
                           <ImageUploadField
                             label=""
                             value={field.value}
                             onChange={field.onChange}
                             placeholder="Enter hero image URL or upload file"
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
              </div>

              <Separator />

              {/* Theme Colors */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme Colors</h3>
                
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="primaryColor"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Primary Color</FormLabel>
                         <FormControl>
                           <ColorPicker
                             label=""
                             value={field.value}
                             onChange={field.onChange}
                             placeholder="Enter HSL color (e.g., 220 13% 18%)"
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                   <FormField
                     control={form.control}
                     name="secondaryColor"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Secondary Color</FormLabel>
                         <FormControl>
                           <ColorPicker
                             label=""
                             value={field.value}
                             onChange={field.onChange}
                             placeholder="Enter HSL color (e.g., 210 40% 96%)"
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="info@optique.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street, City, State 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="openingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Hours</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending || csrfLoading}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
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