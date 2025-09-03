'use client';

import { useState, useEffect, useRef, useMemo, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AboutBenefitFormData, aboutBenefitFormSchema, AboutBenefit } from '@/features/about/schema/aboutBenefitSchema';
import { createAboutBenefitAction } from '@/features/about/actions/createAboutBenefit';
import { updateAboutBenefitAction } from '@/features/about/actions/updateAboutBenefit';
import { toast } from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';

interface AboutBenefitFormProps {
  benefit?: AboutBenefit | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (benefits: AboutBenefit[]) => void;
}

const iconOptions = [
  { value: 'Eye', label: 'Eye' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Clock', label: 'Clock' },
  { value: 'Users', label: 'Users' },
  { value: 'Award', label: 'Award' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Star', label: 'Star' },
  { value: 'CheckCircle', label: 'Check Circle' },
  { value: 'Zap', label: 'Zap' },
  { value: 'Target', label: 'Target' },
];

const colorOptions = [
  { value: 'text-blue-600', label: 'Blue' },
  { value: 'text-green-600', label: 'Green' },
  { value: 'text-purple-600', label: 'Purple' },
  { value: 'text-red-600', label: 'Red' },
  { value: 'text-yellow-600', label: 'Yellow' },
  { value: 'text-indigo-600', label: 'Indigo' },
  { value: 'text-pink-600', label: 'Pink' },
  { value: 'text-orange-600', label: 'Orange' },
];

const bgColorOptions = [
  { value: 'bg-blue-100', label: 'Blue' },
  { value: 'bg-green-100', label: 'Green' },
  { value: 'bg-purple-100', label: 'Purple' },
  { value: 'bg-red-100', label: 'Red' },
  { value: 'bg-yellow-100', label: 'Yellow' },
  { value: 'bg-indigo-100', label: 'Indigo' },
  { value: 'bg-pink-100', label: 'Pink' },
  { value: 'bg-orange-100', label: 'Orange' },
];

export default function AboutBenefitForm({ benefit, isOpen, onClose, onSuccess }: AboutBenefitFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousCreateIsPending = useRef(false);
  const previousUpdateIsPending = useRef(false);
  const isEditing = !!benefit;

  // Create action state
  const [createState, createFormAction, isCreatePending] = useActionState<any, FormData>(
    createAboutBenefitAction,
    {
      success: false,
      error: '',
      data: [],
    }
  );

  // Update action state
  const [updateState, updateFormAction, isUpdatePending] = useActionState<any, FormData>(
    updateAboutBenefitAction,
    {
      success: false,
      error: '',
      data: [],
    }
  );

  // Default values - memoized to prevent infinite re-renders
  const defaultValues = useMemo(() => ({
    title: benefit?.title || '',
    description: benefit?.description || '',
    highlight: benefit?.highlight || '',
    icon: benefit?.icon || 'Eye',
    color: benefit?.color || 'text-blue-600',
    bgColor: benefit?.bgColor || 'bg-blue-100',
  }), [benefit]);

  const form = useForm<AboutBenefitFormData>({
    resolver: zodResolver(aboutBenefitFormSchema),
    defaultValues,
  });

  // Reset form when dialog opens/closes to ensure proper initialization
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, benefit, form, defaultValues]);

  // Handle create success/error
  useEffect(() => {
    if (previousCreateIsPending.current && !isCreatePending) {
      if (createState.success) {
        toast.success('About benefit created successfully!');
        if (createState.data) {
          onSuccess?.(createState.data as AboutBenefit[]);
        }
        onClose();
        form.reset();
      } else if (createState.error) {
        toast.error(createState.error || 'Failed to create about benefit');
      }
    }
    previousCreateIsPending.current = isCreatePending;
  }, [isCreatePending, createState.success, createState.error, createState.data, onSuccess, onClose, form]);

  // Handle update success/error
  useEffect(() => {
    if (previousUpdateIsPending.current && !isUpdatePending) {
      if (updateState.success) {
        toast.success('About benefit updated successfully!');
        if (updateState.data) {
          onSuccess?.(updateState.data as AboutBenefit[]);
        }
        onClose();
        form.reset();
      } else if (updateState.error) {
        toast.error(updateState.error || 'Failed to update about benefit');
      }
    }
    previousUpdateIsPending.current = isUpdatePending;
  }, [isUpdatePending, updateState.success, updateState.error, updateState.data, onSuccess, onClose, form]);

  const onSubmit = (data: AboutBenefitFormData) => {
    if (csrfLoading) {
      toast.error('Le jeton de sécurité est encore en cours de chargement. Veuillez patienter.');
      return;
    }

    if (csrfError || !csrfToken) {
      toast.error('Erreur du jeton de sécurité. Veuillez actualiser la page.');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('highlight', data.highlight);
    formData.append('icon', data.icon);
    formData.append('color', data.color);
    formData.append('bgColor', data.bgColor);
    formData.append('csrf_token', csrfToken);

    if (isEditing && benefit) {
      formData.append('aboutBenefitId', benefit.id);
      startTransition(() => {
        updateFormAction(formData);
      });
    } else {
      startTransition(() => {
        createFormAction(formData);
      });
    }
  };

  const handleClose = () => {
    if (!isCreatePending && !isUpdatePending) {
      form.reset();
      onClose();
    }
  };

  if (csrfLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 animate-spin mx-auto text-muted-foreground/60 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2 text-muted-foreground">Chargement du jeton de sécurité...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (csrfError || !csrfToken) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="w-8 h-8 mx-auto mb-4 text-red-500">🔒</div>
            <p className="text-muted-foreground mb-4">
              {csrfError ? 'Erreur lors du chargement du jeton de sécurité.' : 'Jeton de sécurité non disponible.'}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Actualiser la page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Benefit' : 'Add New Benefit'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the benefit information below.'
              : 'Add a new benefit to showcase your services.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="e.g., Expert Care"
              disabled={isCreatePending || isUpdatePending}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe the benefit..."
              rows={3}
              disabled={isCreatePending || isUpdatePending}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlight">Highlight</Label>
            <Input
              id="highlight"
              {...form.register('highlight')}
              placeholder="e.g., 15 years of experience"
              disabled={isCreatePending || isUpdatePending}
            />
            {form.formState.errors.highlight && (
              <p className="text-sm text-red-500">
                {form.formState.errors.highlight.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={form.watch('icon')}
                onValueChange={(value) => form.setValue('icon', value)}
                disabled={isCreatePending || isUpdatePending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.icon && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.icon.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Icon Color</Label>
              <Select
                value={form.watch('color')}
                onValueChange={(value) => form.setValue('color', value)}
                disabled={isCreatePending || isUpdatePending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.color && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.color.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <Select
                value={form.watch('bgColor')}
                onValueChange={(value) => form.setValue('bgColor', value)}
                disabled={isCreatePending || isUpdatePending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  {bgColorOptions.map((bgColor) => (
                    <SelectItem key={bgColor.value} value={bgColor.value}>
                      {bgColor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.bgColor && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.bgColor.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreatePending || isUpdatePending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatePending || isUpdatePending || csrfLoading}>
              {isCreatePending || isUpdatePending ? 'Saving...' : (isEditing ? 'Update Benefit' : 'Add Benefit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
