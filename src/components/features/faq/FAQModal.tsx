'use client';

import { useState, useEffect, useRef, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import { faqFormSchema, type FAQFormData } from '@/features/faqs/schema/faqSchema';
import { createFAQAction, CreateFAQState } from '@/features/faqs/actions/createFAQ';
import { updateFAQAction, UpdateFAQState } from '@/features/faqs/actions/updateFAQ';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Save, Plus, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';

interface FAQModalProps {
  faq?: {
    id: string;
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any[]) => void;
}

export default function FAQModal({ faq, isOpen, onClose, onSuccess }: FAQModalProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const previousCreateIsPending = useRef(false);
  const previousUpdateIsPending = useRef(false);
  const isEditing = !!faq;

  // Create action state
  const [createState, createFormAction, isCreatePending] = useActionState<CreateFAQState, FormData>(
    createFAQAction,
    {
      success: false,
      error: '',
      fieldErrors: {},
      values: {},
      data: [],
    }
  );

  // Update action state
  const [updateState, updateFormAction, isUpdatePending] = useActionState<UpdateFAQState, FormData>(
    updateFAQAction,
    {
      success: false,
      error: '',
      fieldErrors: {},
      values: {},
      data: [],
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: faq?.question || '',
      answer: faq?.answer || '',
    },
  });

  // Reset form when modal opens/closes or faq changes
  useEffect(() => {
    if (isOpen) {
      if (faq) {
        reset({
          question: faq.question,
          answer: faq.answer,
        });
      } else {
        reset({
          question: '',
          answer: '',
        });
      }
    }
  }, [isOpen, faq, reset]);

  // Handle create success/error
  useEffect(() => {
    if (previousCreateIsPending.current && !isCreatePending) {
      if (createState.success) {
        toast.success('FAQ créé avec succès !');
        if (createState.data) {
          onSuccess(createState.data);
        }
        onClose();
      } else if (createState.error) {
        toast.error(createState.error || 'Échec de la création de la FAQ');
      }
    }
    previousCreateIsPending.current = isCreatePending;
  }, [isCreatePending, createState.success, createState.error, createState.data, onSuccess, onClose]);

  // Handle update success/error
  useEffect(() => {
    if (previousUpdateIsPending.current && !isUpdatePending) {
      if (updateState.success) {
        toast.success('FAQ mise à jour avec succès !');
        if (updateState.data) {
          onSuccess(updateState.data);
        }
        onClose();
      } else if (updateState.error) {
        toast.error(updateState.error || 'Échec de la mise à jour de la FAQ');
      }
    }
    previousUpdateIsPending.current = isUpdatePending;
  }, [isUpdatePending, updateState.success, updateState.error, updateState.data, onSuccess, onClose]);



  const onSubmit = (data: any) => {
    if (csrfLoading) {
      toast.error('Le jeton de sécurité est encore en cours de chargement. Veuillez patienter.');
      return;
    }

    if (csrfError || !csrfToken) {
      toast.error('Erreur du jeton de sécurité. Veuillez actualiser la page.');
      return;
    }

    const formData = new FormData();
    formData.append('question', data.question);
    formData.append('answer', data.answer);

    formData.append('csrf_token', csrfToken);

    if (isEditing && faq) {
      formData.append('id', faq.id);
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
      reset();
      onClose();
    }
  };

  if (csrfLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
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
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-8 h-8 mx-auto mb-4 text-red-500">🔒</div>
            <p className="text-muted-foreground mb-4">
              {csrfError ? 'Erreur lors du chargement du jeton de sécurité.' : 'Jeton de sécurité non disponible.'}
            </p>
            <Button onClick={() => window.location.reload()} variant="default">
              Actualiser la page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl w-[95vw] sm:w-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5" />
                Modifier la FAQ
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Ajouter une nouvelle FAQ
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Mettez à jour la question fréquemment posée et sa réponse ci-dessous.'
              : 'Créez une nouvelle question fréquemment posée et sa réponse.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Question Field */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              placeholder="Entrez la question fréquemment posée..."
              {...register('question')}
              className={errors.question ? 'border-destructive' : ''}
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question.message}</p>
            )}
          </div>

          {/* Answer Field */}
          <div className="space-y-2">
            <Label htmlFor="answer">Réponse *</Label>
            <Textarea
              id="answer"
              placeholder="Fournissez une réponse claire et utile..."
              rows={4}
              {...register('answer')}
              className={errors.answer ? 'border-destructive' : ''}
            />
            {errors.answer && (
              <p className="text-sm text-destructive">{errors.answer.message}</p>
            )}
          </div>

          {/* Active Status */}


          {/* Form Actions */}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isCreatePending || isUpdatePending}
              className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isCreatePending || isUpdatePending}
              className="w-full sm:w-auto"
            >
              {isCreatePending || isUpdatePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Mettre à jour la FAQ' : 'Créer la FAQ'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
