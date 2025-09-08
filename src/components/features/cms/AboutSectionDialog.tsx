'use client';

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Save, Loader2, X } from 'lucide-react';
import { AboutSection, aboutSectionFormSchema, AboutSectionFormData } from '@/features/about/shema/aboutSectionSchema';
import { upsertAboutSectionAction } from '@/features/about/actions/upsertAboutSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useCSRF } from '@/components/common/CSRFProvider';
import ImageUploadField from './ImageUploadField';

interface AboutSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: AboutSection | null;
  onSuccess: (sections: {
    id: string;
    title: string;
    content: string;
    image: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }[]) => void;
}

type ActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: AboutSectionFormData;
  data?: {
    id: string;
    title: string;
    content: string;
    image: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export default function AboutSectionDialog({
  open,
  onOpenChange,
  section,
  onSuccess,
}: AboutSectionDialogProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousIsPending = useRef(false);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    upsertAboutSectionAction,
    {
      success: false,
      error: '',
      fieldErrors: {},
      values: {
        title: section?.title || '',
        content: section?.content || '',
        image: section?.image || '',
      },
    }
  );

  const form = useForm<AboutSectionFormData>({
    resolver: zodResolver(aboutSectionFormSchema),
    defaultValues: {
      title: section?.title || '',
      content: section?.content || '',
      image: section?.image || '',
    },
  });

  // Handle form success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success(section ? 'About section updated successfully!' : 'About section created successfully!');
        if (state.data) {
          onSuccess(state.data);
        }
        onOpenChange(false);
      } else if (state.error) {
        toast.error(state.error || 'Failed to save about section');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, state.data, section, onSuccess, onOpenChange]);

  // Reset form when dialog opens/closes or section changes
  useEffect(() => {
    if (open) {
      form.reset({
        title: section?.title || '',
        content: section?.content || '',
        image: section?.image || '',
      });
    }
  }, [open, section, form]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (csrfLoading) {
      e.preventDefault();
      toast.error('Security token is still loading. Please wait.');
      return;
    }

    if (csrfError) {
      e.preventDefault();
      toast.error('Security token error. Please refresh the page.');
      return;
    }

    if (!csrfToken) {
      e.preventDefault();
      toast.error('Security token not available. Please refresh the page.');
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {section ? 'Edit About Section' : 'Add About Section'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="csrf_token" value={csrfToken || ''} />
            {section?.id && <input type="hidden" name="id" value={section.id} />}
            <input type="hidden" name="image" value={form.watch('image') || ''} />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Our Story"
                      name="title"
                      defaultValue={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your section content here..."
                      className="min-h-[200px]"
                      name="content"
                      defaultValue={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending || csrfLoading}
                className="min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Section
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
