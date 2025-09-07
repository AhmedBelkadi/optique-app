'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Save, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FAQ, FAQFormData, faqFormSchema } from '@/features/faqs/schema/faqSchema';
import { createFAQAction } from '@/features/faqs/actions/createFAQ';
import { updateFAQAction } from '@/features/faqs/actions/updateFAQ';

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ | null;
  onSuccess?: (updatedFAQ: FAQ) => void;
}

export default function FAQDialog({ open, onOpenChange, faq, onSuccess }: FAQDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!faq;

  const form = useForm<FAQFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  // Reset form when dialog opens/closes or faq changes
  useEffect(() => {
    if (open) {
      if (faq) {
        form.reset({
          question: faq.question,
          answer: faq.answer,
        });
      } else {
        form.reset({
          question: '',
          answer: '',
        });
      }
    }
  }, [open, faq, form]);

  const onSubmit = async (data: FAQFormData) => {
    setIsLoading(true);
    try {
      let result;
      
      if (isEditing && faq) {
        const formData = new FormData();
        formData.append('id', faq.id);
        formData.append('question', data.question);
        formData.append('answer', data.answer);
        result = await updateFAQAction({ success: false, error: '', fieldErrors: {}, values: {} }, formData);
      } else {
        result = await createFAQAction({ success: false, error: '', fieldErrors: {}, values: {} }, new FormData());
      }

      if (result.success) {
        toast.success(isEditing ? 'FAQ updated successfully!' : 'FAQ created successfully!');
        if (result.data && onSuccess && result.data.length > 0) {
          onSuccess(result.data[0]);
        }
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error || 'Failed to save FAQ');
      }
    } catch (error) {
      toast.error('Failed to save FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span>{isEditing ? 'Edit FAQ' : 'Add New FAQ'}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the question and answer for this FAQ item.'
              : 'Create a new frequently asked question and its answer.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                {...form.register('question')}
                placeholder="Enter the question..."
                className="text-base"
              />
              {form.formState.errors.question && (
                <p className="text-sm text-destructive">{form.formState.errors.question.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                {...form.register('answer')}
                placeholder="Enter the answer..."
                rows={6}
                className="text-base resize-none"
              />
              {form.formState.errors.answer && (
                <p className="text-sm text-destructive">{form.formState.errors.answer.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : (isEditing ? 'Update FAQ' : 'Create FAQ')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
